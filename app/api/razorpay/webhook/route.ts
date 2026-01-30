import crypto from "crypto";
import { headers } from "next/headers";
import { adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  const body = await req.text();

  const signature =
    headers().get("x-razorpay-signature") || "";

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // ✅ SUBSCRIPTION ACTIVATED
  if (event.event === "subscription.activated") {
    const sub = event.payload.subscription.entity;

    const userId = sub.notes.userId;
    const plan = sub.notes.planKey;
    const billing = sub.notes.billing;

    if (!userId || !plan) {
      console.warn("⚠️ Missing notes in subscription");
      return Response.json({ received: true });
    }

    await adminDb.collection("users").doc(userId).update({
      plan,
      billing,
      subscriptionId: sub.id,
      subscriptionStatus: "active",
      paymentProvider: "razorpay",
      updatedAt: new Date(),
    });

    console.log("✅ Subscription activated:", userId, plan);
  }

  return Response.json({ received: true });
}
