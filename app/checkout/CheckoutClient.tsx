"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contextAuth/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PLAN_CONFIG: any = {
  student_plus: {
    name: "Student+",
    monthly: 1,
    yearly: 2388,
    features: [
      "100 chats per day",
      "Advanced Assignment tool",
      "Advanced Research mode",
      "Advanced PPT generator",
      "PDF export without watermark",
      "Handwritten notes (clean export)",
      "Higher daily export limits",
      "Faster AI responses",
    ],
  },
  pro: {
    name: "Pro",
    monthly: 499,
    yearly: 4999,
    features: [
      "Unlimited chats",
      "Unlimited Assignment generation",
      "Unlimited Research & PPT tools",
      "Priority AI processing",
      "Unlimited PDF & handwritten exports",
      "No watermark on any export",
      "Early access to new tools",
    ],
  },
};

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const rawPlanKey = params.get("plan");

  const safePlanKey =
    rawPlanKey === "student_plus" || rawPlanKey === "pro"
      ? rawPlanKey
      : null;

  const initialBilling = params.get("billing");

  const [billing, setBilling] = useState<"monthly" | "yearly">(
    initialBilling === "yearly" ? "yearly" : "monthly"
  );

  const [loading, setLoading] = useState(false);

  const plan = safePlanKey ? PLAN_CONFIG[safePlanKey] : null;

  useEffect(() => {
    if (!safePlanKey) {
      router.replace("/");
    }
  }, [safePlanKey, router]);


  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);


  if (!plan) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/70">Redirecting to upgrade…</p>
        </div>
      </main>
    );
  }

  const price = billing === "monthly" ? plan.monthly : plan.yearly;
  const savings =
    billing === "yearly"
      ? Math.round(
          ((plan.monthly * 12 - plan.yearly) /
            (plan.monthly * 12)) *
            100
        )
      : 0;

 const onPay = async () => {
  if (!user || !safePlanKey) return;

  setLoading(true);

  try {
    const res = await fetch("/api/razorpay/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey: safePlanKey,
        billing,
        userId: user.uid,
      }),
    });

    const subscription = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name: "AI Videxa",
      description: `${plan.name} (${billing})`,
      prefill: { email: user.email },
      theme: { color: "#0A0D12" },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    alert("Payment failed");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

 
  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0A0D12, #10162A, #05070C)",
            backgroundSize: "400% 400%",
            animation: "gradientMove 30s ease infinite",
          }}
        />
      </div>

      {/* HEADER */}
      <header className="fixed top-6 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo-acadify.png"
                alt="AI Videxa logo"
                className="w-8 h-8"
              />
              <span className="text-lg font-semibold tracking-wide">
                AI Videxa
              </span>
            </Link>

            <Link
              href="/#pricing"
              className="text-sm text-white/80 hover:text-white"
            >
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="relative max-w-6xl mx-auto px-6 pt-28 md:pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: PLAN SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold">
              {plan.name} Plan
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-semibold">
                ₹{price}
              </span>
              <span className="text-sm text-white/60">
                /{" "}
                {billing === "monthly" ? "month" : "year"}
              </span>

              {billing === "yearly" && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-cyan-400 text-black">
                  Save {savings}%
                </span>
              )}
            </div>

            {/* BILLING TOGGLE */}
            <div className="mt-6">
              <div className="relative grid grid-cols-2 w-[220px] p-1 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
                <motion.div
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                  className={`
                    absolute top-1 bottom-1 w-[calc(50%-4px)]
                    rounded-lg bg-white
                    ${
                      billing === "monthly"
                        ? "left-1"
                        : "left-[calc(50%+1px)]"
                    }
                  `}
                />

                <button
                  onClick={() => setBilling("monthly")}
                  className={`relative z-10 py-2 text-sm font-medium transition-colors ${
                    billing === "monthly"
                      ? "text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Monthly
                </button>

                <button
                  onClick={() => setBilling("yearly")}
                  className={`relative z-10 py-2 text-sm font-medium transition-colors ${
                    billing === "yearly"
                      ? "text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* FEATURES */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">
                What’s included:
              </p>

              <ul className="space-y-2 text-sm text-white/70">
                {plan.features.map((f: string) => (
                  <li
                    key={f}
                    className="flex items-start gap-2"
                  >
                    <span className="text-orange-400 mt-[2px]">
                      ✔
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-xs text-white/50">
              Cancel anytime. No long-term commitment.
            </p>
          </motion.div>

          {/* RIGHT: PAYMENT */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold">
              Payment Details
            </h3>

            {/* EMAIL */}
            <div className="mt-4">
              <label className="text-sm text-white/70">
                Email
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="
                  mt-2 w-full px-4 py-2 rounded-lg
                  bg-white/5 border border-white/10
                  text-white/70
                "
              />
            </div>

            {/* PAYMENT METHOD */}
            <div className="mt-6">
              <label className="text-sm text-white/70">
                Payment Method
              </label>

              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/5">
                  <input type="radio" checked readOnly />
                  <span>
                    UPI / Cards / NetBanking
                  </span>
                </div>
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-white/70">
                Total
              </span>
              <span className="text-xl font-semibold">
                ₹{price}
              </span>
            </div>

            {/* PAY BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              onClick={onPay}
              className="
                mt-6 w-full px-6 py-3 rounded-xl
                font-medium
                bg-gradient-to-r from-cyan-500 to-indigo-500
                text-black
                transition-all duration-300
                hover:brightness-110
                active:scale-95
                disabled:opacity-60
              "
            >
              {loading
                ? "Processing..."
                : `Pay ₹${price}`}
            </motion.button>

            {/* TRUST */}
            <div className="mt-6 text-xs text-white/50 space-y-1">
              <p>
                ✔ Secure payment via Razorpay /
                Stripe
              </p>
              <p>
                ✔ No card data stored on AI
                Videxa
              </p>
              <p>✔ Cancel anytime</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
