"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contextAuth/AuthContext";
import { fixUserChats } from "@/utils/fixChats";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/* ---------------- TOGGLE ---------------- */
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition ${
      checked ? "bg-purple-600" : "bg-white/20"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition ${
        checked ? "translate-x-5" : ""
      }`}
    />
  </button>
);

export default function SettingsModal({ isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  /* ✅ ONE-TIME FIRESTORE FIX */
  useEffect(() => {
    if (!isOpen || !user?.uid) return;
    fixUserChats(user.uid);
  }, [isOpen, user]);

  const [settings, setSettings] = useState({
    notifications: true,
    autoScroll: true,
    enterToSend: true,
    chatHistory: true,
  });

  const [confirmDelete, setConfirmDelete] =
    useState<null | "all" | "30days">(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* ================= REALTIME SETTINGS SYNC ================= */
  useEffect(() => {
    if (!user || !isOpen) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, snap => {
      if (snap.exists() && snap.data().settings) {
        setSettings(prev => ({
          ...prev,
          ...snap.data().settings,
        }));
      }
    });

    return () => unsub();
  }, [user, isOpen]);

  /* ================= SAVE SETTING (🔥 FIXED) ================= */
  const toggleSetting = async (key: keyof typeof settings) => {
    if (!user) return;

    const next = !settings[key];
    setSettings(prev => ({ ...prev, [key]: next }));

    await updateDoc(doc(db, "users", user.uid), {
      [`settings.${key}`]: next,
      "settings.updatedAt": serverTimestamp(),
    });
  };

  /* ================= DELETE INTENTS ================= */

  const triggerDeleteAllChats = async () => {
    if (!user) return;
    setLoadingDelete(true);

    await updateDoc(doc(db, "users", user.uid), {
      "settings.clearChatsAt": serverTimestamp(),
    });

    setLoadingDelete(false);
    setConfirmDelete(null);
  };

  const triggerDeleteOldChats = async () => {
    if (!user) return;
    setLoadingDelete(true);

    await updateDoc(doc(db, "users", user.uid), {
      "settings.deleteOlderThanDays": 30,
      "settings.deleteTriggeredAt": serverTimestamp(),
    });

    setLoadingDelete(false);
    setConfirmDelete(null);
  };

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
 useEffect(() => {
  const handler = (e: MouseEvent) => {
    // 🚫 Do NOT close settings when confirm modal is open
    if (confirmDelete) return;

    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, [onClose, confirmDelete]);


  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-2xl bg-[#0F0F11] border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.35)] p-6"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-6 text-sm">
          <Section title="General">
            <Row
              label="Notifications"
              desc="Get alerts and updates"
              action={
                <Toggle
                  checked={settings.notifications}
                  onChange={() => toggleSetting("notifications")}
                />
              }
            />
          </Section>

          <Section title="Chat">
            <Row
              label="Auto-scroll"
              desc="Scroll automatically during replies"
              action={
                <Toggle
                  checked={settings.autoScroll}
                  onChange={() => toggleSetting("autoScroll")}
                />
              }
            />
            <Row
              label="Enter to send"
              desc="Press Enter to send messages"
              action={
                <Toggle
                  checked={settings.enterToSend}
                  onChange={() => toggleSetting("enterToSend")}
                />
              }
            />
          </Section>

          <Section title="Privacy">
            <Row
              danger
              label="Delete all chats"
              desc="Permanently remove all conversations"
              action={
                <button
                  onClick={() => setConfirmDelete("all")}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              }
            />
            <Row
              danger
              label="Delete chats older than 30 days"
              desc="Automatically clean up old chats"
              action={
                <button
                  onClick={() => setConfirmDelete("30days")}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              }
            />
          </Section>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Done
          </button>
        </div>
      </div>

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center">
          <div className="bg-[#121214] border border-red-500/20 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-red-400 font-semibold mb-2">
              Confirm deletion
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                disabled={loadingDelete}
                onClick={
                  confirmDelete === "all"
                    ? triggerDeleteAllChats
                    : triggerDeleteOldChats
                }
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                {loadingDelete ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const Section = ({ title, children }: any) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
      {title}
    </p>
    <div className="space-y-2">{children}</div>
  </div>
);

const Row = ({ label, desc, action, danger = false }: any) => (
  <div
    className={`flex items-center justify-between px-3 py-3 rounded-xl ${
      danger ? "hover:bg-red-500/10" : "hover:bg-white/5"
    }`}
  >
    <div>
      <p className={`font-medium ${danger ? "text-red-400" : "text-gray-200"}`}>
        {label}
      </p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    {action}
  </div>
);
