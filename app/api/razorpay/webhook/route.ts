import crypto from "crypto";
import { headers } from "next/headers";
import { adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  /* ===============================
     🔥 SUBSCRIPTION ACTIVATED
  =============================== */
  if (event.event === "subscription.activated") {
    const sub = event.payload.subscription.entity;

    const userId = sub.notes?.userId;
    const planKey = sub.notes?.planKey;

    if (!userId || !planKey) {
      console.warn("⚠️ Missing userId / planKey in subscription notes");
      return Response.json({ received: true });
    }

    await adminDb.collection("users").doc(userId).update({
      plan: planKey,
      subscriptionId: sub.id,
      subscriptionStatus: sub.status,
      paymentProvider: "razorpay",
      upgradedAt: new Date(),
    });

    console.log("✅ Subscription activated:", userId, planKey);
  }

  /* ===============================
     🔁 RENEWAL PAYMENT
  =============================== */
  if (event.event === "invoice.paid") {
    const invoice = event.payload.invoice.entity;
    const subId = invoice.subscription_id;

    await adminDb.collection("subscriptions").doc(subId).set(
      {
        lastInvoiceId: invoice.id,
        paidAt: new Date(),
      },
      { merge: true }
    );

    console.log("🔁 Invoice paid:", subId);
  }

  return Response.json({ received: true });
}
