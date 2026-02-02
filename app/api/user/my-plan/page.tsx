"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contextAuth/AuthContext";
import { usePlan } from "@/hooks/usePlan";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  doc,
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function MyPlanPage() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    isFree,
    isStudentPlus,
    isPro,
    label,
    messageLimit,
    exportLimit,
    hasUnlimited,
  } = usePlan(user);

  
  /* ================= CANCEL MODAL STATE ================= */
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
const cancelDate =
  user?.currentPeriodEnd?.toDate?.() ?? null;

const cancelDisabled =
  user?.subscriptionStatus === "cancelled_pending";

  /* ================= REAL USAGE STATE ================= */
  const [usedMessages, setUsedMessages] = useState<number>(0);
  const [usedExports, setUsedExports] = useState<number>(0);

  /* ================= FIRESTORE LIVE USAGE ================= */
  useEffect(() => {
    if (!user || hasUnlimited) {
      setUsedMessages(0);
      setUsedExports(0);
      return;
    }

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      const usage = data.usage || {};

      const lastResetTs = usage.lastResetAt?.toDate?.();
      const now = new Date();

      // ✅ UTC-safe daily reset
      const todayKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}-${now.getUTCDate()}`;
      const lastKey = lastResetTs
        ? `${lastResetTs.getUTCFullYear()}-${lastResetTs.getUTCMonth()}-${lastResetTs.getUTCDate()}`
        : null;

      const messages =
        lastKey === todayKey ? Number(usage.messagesToday || 0) : 0;

      const exports =
        lastKey === todayKey ? Number(usage.exportsToday || 0) : 0;

      setUsedMessages(messages);
      setUsedExports(exports);
    });

    return () => unsub();
  }, [user, hasUnlimited]);

  /* ================= PROGRESS ================= */
  const messagePercent = hasUnlimited
    ? 100
    : Math.min(100, (usedMessages / messageLimit) * 100);

  const exportPercent = hasUnlimited
    ? 100
    : Math.min(100, (usedExports / exportLimit) * 100);


  /* ================= Invoices ================= */
type Invoice = {
  invoiceId: string;
  plan: string;
  amount: number;
  pdfUrl?: string;
  createdAt?: any;
};

const [invoices, setInvoices] = useState<Invoice[]>([]);

useEffect(() => {
  if (!user || isFree) {
    setInvoices([]);
    return;
  }

  const ref = doc(db, "users", user.uid);

  const unsub = onSnapshot(  
  collection(db, "users", user.uid, "invoices"),
  (snap: QuerySnapshot<DocumentData>) => {
    const list = snap.docs
      .map((d) => d.data() as any)
      .sort(
        (a: any, b: any) =>
          b.createdAt?.toMillis?.() -
          a.createdAt?.toMillis?.()
      );

    setInvoices(list);
  }
);


  return () => unsub();
}, [user, isFree]);

    
  /* ================= CANCEL HANDLER ================= */
  const handleCancelSubscription = async () => {
  if (!user) return;

  try {
    setCancelLoading(true);

    const token = await getAuth().currentUser?.getIdToken(true);

    const res = await fetch("/api/razorpay/cancel-subscription", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      // ✅ Friendly message for already-cancelled subscriptions
      if (
        data?.error?.description?.includes("not cancellable") ||
        data?.message?.includes("already requested")
      ) {
        setShowCancelModal(false);
        alert(
          "Your subscription cancellation is already scheduled. You will keep access until the end of the billing cycle."
        );
        return;
      }

      throw new Error("Cancel failed");
    }

    setShowCancelModal(false);
    alert("Subscription will be cancelled at the end of the billing cycle.");
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please contact support if this continues.");
  } finally {
    setCancelLoading(false);
  }
};
const formatCancelDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });


  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#08121d] via-[#0b1624] to-[#060a12] text-white px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* ================= BACK ================= */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* ================= HEADER ================= */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold">My Plan</h1>
            <p className="text-sm text-gray-400 mt-2">
              Manage your subscription, usage & billing
            </p>
          </div>

          {/* ================= CURRENT PLAN ================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`
              relative max-w-3xl mx-auto
              rounded-3xl p-8 backdrop-blur-xl border
              ${
                isPro
                  ? "bg-purple-500/10 border-purple-500/40 shadow-[0_0_60px_rgba(168,85,247,0.25)]"
                  : isStudentPlus
                  ? "bg-cyan-500/10 border-cyan-400/40 shadow-[0_0_60px_rgba(34,211,238,0.2)]"
                  : "bg-white/5 border-white/10"
              }
            `}
          >
            <span className="absolute top-4 right-4 text-[11px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
              Active
            </span>

            {user?.subscriptionStatus === "cancelled_pending" && cancelDate && (
  <span className="absolute top-12 right-4 text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
    Cancels on {formatCancelDate(cancelDate)}
  </span>
)}


            <h2 className="text-2xl font-semibold">{label} Plan</h2>

            <p className="text-sm text-gray-400 mt-2 mb-6 max-w-md">
              {isFree && "Basic access with daily limits. Upgrade to unlock advanced tools."}
              {isStudentPlus && "Advanced academic tools with higher daily limits."}
              {isPro && "Unlimited access with priority AI processing."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/#pricing")}
                className={`
                  flex-1 py-2.5 rounded-xl font-medium transition
                  ${
                    isFree
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-white/10 border border-white/10 hover:bg-white/15"
                  }
                `}
              >
                {isFree ? "Upgrade Plan" : "Change Plan"}
              </button>

              {!isFree && (
               <button
  onClick={() => setShowCancelModal(true)}
  disabled={cancelDisabled}
  className={`
    flex-1 py-2.5 rounded-xl
    text-red-400 border border-red-500/20
    transition
    ${
      cancelDisabled
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-red-500/10"
    }
  `}
>
  {cancelDisabled ? "Cancellation Scheduled" : "Cancel Subscription"}
</button>

              )}
            </div>
          </motion.div>

          {/* ================= USAGE ================= */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Messages */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Daily Messages</p>
                <p className="text-xs text-gray-400">
                  {hasUnlimited ? "Unlimited" : `${usedMessages} / ${messageLimit}`}
                </p>
              </div>

              {!hasUnlimited ? (
                <>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${messagePercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Resets every 24 hours</p>
                </>
              ) : (
                <p className="text-xs text-green-400">Unlimited messages available</p>
              )}
            </div>

            {/* Exports */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Daily Exports</p>
                <p className="text-xs text-gray-400">
                  {hasUnlimited ? "Unlimited" : `${usedExports} / ${exportLimit}`}
                </p>
              </div>

              {!hasUnlimited ? (
                <>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${exportPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Resets every 24 hours</p>
                </>
              ) : (
                <p className="text-xs text-green-400">Unlimited exports available</p>
              )}
            </div>
          </div>
        

        {/* ================= FEATURES ================= */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white/5 border border-white/10 p-8">
          <h3 className="text-lg font-semibold mb-5">What’s Included</h3>

          <ul className="grid sm:grid-cols-2 gap-4 text-sm">
            <li>✔ AI Chat & Writing</li>
            <li>✔ Basic Assignments & Research</li>
            <li>{isFree ? "✖" : "✔"} Advanced Assignments</li>
            <li>{isFree ? "✖" : "✔"} Advanced Research Mode</li>
            <li>{isFree ? "✖" : "✔"} PPT Generator</li>
            <li>{isFree ? "✖" : "✔"} Clean PDF Exports</li>
            <li>{hasUnlimited ? "✔ Unlimited Exports" : "✔ Limited Exports"}</li>
            <li>{isPro ? "✔ Priority AI Processing" : "✖ Priority AI Processing"}</li>
          </ul>
        </div>

        {/* ================= INVOICES ================= */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-white/5 border border-white/10 p-8">
          <h3 className="text-lg font-semibold mb-4">Invoice History</h3>

          {isFree ? (
            <p className="text-sm text-gray-400">
              No invoices available on the Free plan.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
  <tr
    key={inv.invoiceId}
    className="border-t border-white/10"
  >
    <td className="px-4 py-3">
      {inv.createdAt?.toDate
        ? inv.createdAt
            .toDate()
            .toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
        : "-"}
    </td>

    <td className="px-4 py-3">
      {inv.plan}
    </td>

    <td className="px-4 py-3">
      ₹{inv.amount}
    </td>

    <td className="px-4 py-3 text-right">
      {inv.pdfUrl ? (
        <a
          href={inv.pdfUrl}
          target="_blank"
          className="text-purple-400 hover:text-purple-300"
        >
          Download
        </a>
      ) : (
        "-"
      )}
    </td>
  </tr>
))}

                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">
            Changes apply at the end of the current billing cycle.
          </p>
        </div>
      </div>

      {/* ================= CANCEL MODAL ================= */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0F0F11] border border-white/10 p-6">
            <h2 className="text-lg font-semibold">Cancel Subscription?</h2>

            <p className="text-sm text-gray-400 mt-2">
              You will keep access until the end of the billing cycle.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl bg-white/10"
              >
                Keep Plan
              </button>

              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}