import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import {
  RAZORPAY_PLANS,
  PlanKey,
  BillingCycle,
} from "@/config/razorpayPlans";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type CreateSubscriptionBody = {
  planKey: PlanKey;
  billing: BillingCycle;
  userId: string;
};

export async function POST(req: Request) {
  try {
    const body: CreateSubscriptionBody = await req.json();

    const { planKey, billing, userId } = body;

    const planId = RAZORPAY_PLANS[planKey][billing];

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

    return NextResponse.json(subscription);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
