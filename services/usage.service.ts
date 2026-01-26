import {
  doc,
  getDoc,
  runTransaction,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { PLAN_LIMITS, PlanType } from "@/config/plans";

/* ================== HELPERS ================== */
const getTodayKeyFromServer = (ts: Timestamp) => {
  const d = ts.toDate();
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
};

/* ================== CHECK ================== */
export async function canSendMessage(
  uid: string
): Promise<{ allowed: boolean; left: number | null }> {
  const ref = doc(db, "users", uid);

  const snap = await getDoc(ref);
  if (!snap.exists()) return { allowed: false, left: 0 };

  const data = snap.data();

  const plan = (data.plan || "free") as PlanType;
  const limit = PLAN_LIMITS[plan].messagesPerDay;

  // Unlimited plan
  if (limit === Infinity) {
    return { allowed: true, left: null };
  }

  const serverNow = Timestamp.now(); // 🔥 SERVER-TIME
  const today = getTodayKeyFromServer(serverNow);

  const lastResetTs = data.usage?.lastResetAt as Timestamp | undefined;
  const lastResetKey = lastResetTs
    ? getTodayKeyFromServer(lastResetTs)
    : null;

  let used =
    lastResetKey === today ? Number(data.usage?.messagesToday || 0) : 0;

  const left = Math.max(0, limit - used);

  if (left <= 0) {
    return { allowed: false, left: 0 };
  }

  return { allowed: true, left };
}

/* ================== INCREMENT ================== */
export async function incrementMessageUsage(uid: string) {
  const ref = doc(db, "users", uid);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return;

    const data = snap.data();

    const now = Timestamp.now(); // 🔥 SERVER-TIME
    const today = getTodayKeyFromServer(now);

    const lastResetTs = data.usage?.lastResetAt as Timestamp | undefined;
    const lastResetKey = lastResetTs
      ? getTodayKeyFromServer(lastResetTs)
      : null;

    const current =
      lastResetKey === today
        ? Number(data.usage?.messagesToday || 0)
        : 0;

    const newCount = current + 1;

    transaction.update(ref, {
      "usage.messagesToday": newCount,
      "usage.lastResetAt": now, // 🔥 STORE SERVER TS
    });
  });
}
