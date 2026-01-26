import {
  collection,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

/**
 * 🔧 One-time chat repair
 * Safe to run once
 */
export async function fixUserChats(userId: string) {
  if (!userId) return;

  const snap = await getDocs(
    collection(db, "users", userId, "chats")
  );

  if (snap.empty) {
    console.log("No chats to fix");
    return;
  }

  const batch = writeBatch(db);
  let fixed = 0;

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const updates: any = {};

    if (!data.updatedAt) {
      updates.updatedAt = serverTimestamp();
    }

    if (typeof data.pinned !== "boolean") {
      updates.pinned = false;
    }

    if (Object.keys(updates).length > 0) {
      batch.update(docSnap.ref, updates);
      fixed++;
    }
  });

  if (fixed > 0) {
    await batch.commit();
    console.log(`✅ Fixed ${fixed} chats`);
  } else {
    console.log("✅ Chats already healthy");
  }
}
