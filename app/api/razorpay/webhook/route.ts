import crypto from "crypto";
import { headers } from "next/headers";
import { adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  /* ===============================
     🔐 VERIFY SIGNATURE
  =============================== */
  const body = await req.text();
  const signature =
    headers().get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_WEBHOOK_SECRET!
    )
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  /* ===============================
     💰 INVOICE PAID (ACTUAL PAYMENT)
     → THIS IS WHERE UPGRADE HAPPENS
  =============================== */
  if (event.event === "invoice.paid") {
    const invoice = event.payload.invoice.entity;
    const subscriptionId = invoice.subscription_id;

    if (!subscriptionId) {
      console.warn("⚠️ invoice.paid without subscription_id");
      return Response.json({ received: true });
    }

    // 1️⃣ Fetch subscription → user mapping
    const subSnap = await adminDb
      .collection("subscriptions")
      .doc(subscriptionId)
      .get();

    if (!subSnap.exists) {
      console.error(
        "❌ Subscription mapping not found:",
        subscriptionId
      );
      return Response.json({ received: true });
    }

    const { userId, planKey, billing } =
      subSnap.data() as {
        userId: string;
        planKey: string;
        billing: "monthly" | "yearly";
      };

    // 2️⃣ Upgrade user plan
    await adminDb.collection("users").doc(userId).update({
      plan: planKey,
      subscriptionId,
      billing,
      paymentProvider: "razorpay",
      paymentStatus: "active",
      upgradedAt: new Date(),
      lastInvoiceId: invoice.id,
    });

    // 3️⃣ Update subscription record
    await adminDb
      .collection("subscriptions")
      .doc(subscriptionId)
      .set(
        {
          status: "active",
          lastInvoiceId: invoice.id,
          lastPaidAt: new Date(),
        },
        { merge: true }
      );

    console.log(
      "✅ USER UPGRADED:",
      userId,
      planKey,
      billing
    );
  }

  /* ===============================
     🔁 OPTIONAL: SUBSCRIPTION HALTED
  =============================== */
  if (event.event === "subscription.halted") {
    const sub = event.payload.subscription.entity;

    await adminDb
      .collection("subscriptions")
      .doc(sub.id)
      .set(
        {
          status: "halted",
          haltedAt: new Date(),
        },
        { merge: true }
      );

    console.warn("⛔ Subscription halted:", sub.id);
  }

  return Response.json({ received: true });
}
