import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/firebase/admin";

/* ================= RAZORPAY ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/* ================= POST ================= */

export async function POST(req: NextRequest) {
  try {
    /* ================= AUTH ================= */
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.replace("Bearer ", "");
    const decoded = await getAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    /* ================= USER ================= */
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const subscriptionId = userData?.subscriptionId;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    /* ================= RAZORPAY STATUS SYNC ================= */
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    // 🔥 SAFELY READ (typing fix)
    const cancelAtCycleEnd =
      (subscription as Record<string, any>).cancel_at_cycle_end === 1;

    // 🔄 Sync Razorpay → Firestore
    await userRef.update({
      razorpayStatus: subscription.status,
      cancelAtCycleEnd,
      currentPeriodEnd: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : null,
    });

    /* ================= GUARD ================= */
    if (subscription.status === "cancelled" || cancelAtCycleEnd) {
      return NextResponse.json({
        success: true,
        message: "Subscription cancellation already scheduled.",
      });
    }

    /* ================= CANCEL ================= */
    // ✅ Cancel at end of billing cycle
    await razorpay.subscriptions.cancel(subscriptionId, 1);

    await userRef.update({
      subscriptionStatus: "cancelled_pending",
      cancelRequestedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Subscription will be cancelled at the end of the billing cycle.",
    });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
