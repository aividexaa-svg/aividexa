import crypto from "crypto";
import { headers } from "next/headers";
import { adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  /* ===============================
     🔐 VERIFY SIGNATURE
  =============================== */
  const body = await req.text();
  const signature = headers().get("x-razorpay-signature") || "";

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
     💰 INVOICE PAID
  =============================== */
  if (event.event === "invoice.paid") {
  const invoice = event.payload.invoice.entity;
  const subscriptionId = invoice.subscription_id;

  if (!subscriptionId) {
    console.warn("⚠️ invoice.paid without subscription_id");
    return Response.json({ received: true });
  }

  const subSnap = await adminDb
    .collection("subscriptions")
    .doc(subscriptionId)
    .get();

  if (!subSnap.exists) {
    console.error("❌ Subscription mapping not found:", subscriptionId);
    return Response.json({ received: true });
  }

  const { userId, planKey, billing } = subSnap.data() as {
    userId: string;
    planKey: string;
    billing: "monthly" | "yearly";
  };

  // ✅ Upgrade user
  await adminDb.collection("users").doc(userId).update({
    plan: planKey,
    subscriptionId,
    billing,
    paymentProvider: "razorpay",
    paymentStatus: "active",
    subscriptionStatus: "active",
    razorpayStatus: "active",
    upgradedAt: new Date(),
    lastInvoiceId: invoice.id,
  });

  // ✅ Update subscription record
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

  // ✅ SAVE INVOICE (THIS IS THE MISSING PART)
  await adminDb
    .collection("users")
    .doc(userId)
    .collection("invoices")
    .doc(invoice.id)
    .set({
      invoiceId: invoice.id,
      subscriptionId,
      plan: planKey,
      billing,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: "paid",
      pdfUrl: invoice.short_url || null,
      createdAt: new Date(invoice.created_at * 1000),
    });

  console.log("✅ USER UPGRADED & INVOICE SYNCED:", userId);
}


  /* ===============================
     🕒 SUBSCRIPTION UPDATED
     → cancel_at_cycle_end set
  =============================== */
  if (event.event === "subscription.updated") {
    const sub = event.payload.subscription.entity;
    const subscriptionId = sub.id;

    const subSnap = await adminDb
      .collection("subscriptions")
      .doc(subscriptionId)
      .get();

    if (!subSnap.exists) return Response.json({ received: true });

    const { userId } = subSnap.data() as { userId: string };

    const cancelAtCycleEnd = sub.cancel_at_cycle_end === 1;

    await adminDb.collection("users").doc(userId).update({
      razorpayStatus: sub.status,
      subscriptionStatus: cancelAtCycleEnd
        ? "cancelled_pending"
        : "active",
      cancelAtCycleEnd,
      currentPeriodEnd: sub.current_end
        ? new Date(sub.current_end * 1000)
        : null,
    });

    console.log("🔄 Subscription updated:", subscriptionId);
  }

  /* ===============================
     ❌ SUBSCRIPTION CANCELLED
     → DOWNGRADE USER
  =============================== */
  if (event.event === "subscription.cancelled") {
    const sub = event.payload.subscription.entity;
    const subscriptionId = sub.id;

    const subSnap = await adminDb
      .collection("subscriptions")
      .doc(subscriptionId)
      .get();

    if (!subSnap.exists) {
      console.error("❌ Subscription mapping not found:", subscriptionId);
      return Response.json({ received: true });
    }

    const { userId } = subSnap.data() as { userId: string };

    await adminDb.collection("users").doc(userId).update({
      plan: "free",
      subscriptionId: null,
      billing: null,
      paymentStatus: "cancelled",
      subscriptionStatus: "cancelled",
      razorpayStatus: "cancelled",
      cancelAtCycleEnd: false,
      currentPeriodEnd: null,
      cancelledAt: new Date(),
    });

    await adminDb
      .collection("subscriptions")
      .doc(subscriptionId)
      .set(
        {
          status: "cancelled",
          cancelledAt: new Date(),
        },
        { merge: true }
      );

    console.log("🧾 Subscription cancelled → user downgraded:", userId);
  }

  /* ===============================
     ⛔ SUBSCRIPTION HALTED
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
