export const RAZORPAY_PLANS = {
  student_plus: {
    monthly: "plan_SA79gHALFo5SpE", // ← paste Student+ Monthly plan ID
    yearly: "plan_SA6Q1e3yclauJg",  // (create yearly separately)
  },
  pro: {
    monthly: "plan_SA6RM7en6qrGeW",
    yearly: "plan_SA6UC8oJBEr6lV",
  },
};

export type PlanKey = keyof typeof RAZORPAY_PLANS;
export type BillingCycle = "monthly" | "yearly";
