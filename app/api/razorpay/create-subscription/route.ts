import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import {
  RAZORPAY_PLANS,
  PlanKey,
  BillingCycle,
} from "@/config/razorpayPlans";
import { adminDb } from "@/firebase/admin";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const planKey = body.planKey as PlanKey;
    const billing = body.billing as BillingCycle;
    const userId = body.userId as string;

    if (!planKey || !billing || !userId) {
      return NextResponse.json(
        { error: "Missing params" },
        { status: 400 }
      );
    }

    const planId = RAZORPAY_PLANS[planKey][billing];

    // 1️⃣ Create subscription in Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: billing === "monthly" ? 12 : 1,
      notes: {
        userId,
        planKey,
        billing,
      },
    });

    // 2️⃣ 🔥 SAVE MAPPING FOR WEBHOOK
    await adminDb
      .collection("subscriptions")
      .doc(subscription.id)
      .set({
        userId,
        planKey,
        billing,
        status: "created",
        createdAt: new Date(),
      });

    return NextResponse.json(subscription);
  } catch (err) {
    console.error("Create subscription error:", err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
