"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { reload } from "firebase/auth"; // ← ADD THIS AT TOP


import {
  setDoc,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "@/firebase/firebaseConfig";

interface Props {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  refreshUser: (updatedUser: any) => void;
}


// IMAGE COMPRESSION
const compressImage = (file: File, maxWidth = 512, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = maxWidth / img.width;
      const width = maxWidth;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressed = new File([blob], file.name, { type: file.type });
            resolve(compressed);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
  });
};

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  refreshUser,
}: Props) {
  const [name, setName] = useState(user?.displayName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [photo, setPhoto] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const [checking, setChecking] = useState(false);
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setName(user?.displayName || "");
      setUsername(user?.username || "");
      setDob(user?.dob || "");
      setGender(user?.gender || "");
      setBio(user?.bio || "");
      setPhoto(null);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!username) {
      setUsernameValid(null);
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
     setChecking(true);

const ref = doc(db, "usernames", username);
const snap = await getDoc(ref);

const exists = snap.exists() && snap.data()?.uid !== user.uid;

setUsernameValid(!exists);

if (exists) {
  const base = username.toLowerCase();
  setSuggestions([
    `${base}${Math.floor(100 + Math.random() * 900)}`,
    `${base}${Math.floor(1000 + Math.random() * 9000)}`,
    `${base}${Date.now().toString().slice(-4)}`,
  ]);
} else {
  setSuggestions([]);
}

setChecking(false);

    }, 400);

    return () => clearTimeout(timeout);
  }, [username, user?.uid]);

  const autoGenerate = () => {
    const base = (name || "user").toLowerCase().replace(/[^a-z0-9]/g, "");
    const rand = Math.floor(100 + Math.random() * 9000);
    setUsername(`${base}${rand}`);
  };

  const handleCancel = () => {
    setName(user?.displayName || "");
    setUsername(user?.username || "");
    setDob(user?.dob || "");
    setGender(user?.gender || "");
    setBio(user?.bio || "");
    setPhoto(null);
    onClose();
  };

 const handleSave = async () => {
  if (!user || saving || usernameValid === false) return;

  setSaving(true);
  // 🔥 Reserve username in public index
await setDoc(
  doc(db, "usernames", username),
  {
    uid: user.uid,
  }
);
if (user.username && user.username !== username) {
  await deleteDoc(doc(db, "usernames", user.username));
}


  const finalName = name.trim() || user.displayName || "";
  let photoURL: string | null = user?.photoURL ?? null;

  if (photo) {
    const compressed = await compressImage(photo, 512, 0.7);

    const formData = new FormData();
    formData.append("file", compressed);
    formData.append("upload_preset", "<YOUR_UPLOAD_PRESET>");

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/<YOUR_CLOUD_NAME>/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await cloudinaryRes.json();
    photoURL = data.secure_url ?? null;
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      displayName: finalName,
      username,
      dob,
      gender,
      bio,
      photoURL: photoURL ?? null,
    },
    { merge: true }
  );

  await updateProfile(auth.currentUser!, {
    displayName: finalName,
    photoURL: photoURL ?? null,
  });

  // ⭐ FORCE REFRESH FIREBASE AUTH
  await reload(auth.currentUser!);

  refreshUser({
    ...user,
    displayName: finalName,
    username,
    dob,
    gender,
    bio,
    photoURL,
  });

  setSaving(false);
  onClose();
};

  const canSave = !saving && !checking && (usernameValid !== false);

  if (!isOpen || typeof window === "undefined") return null;

 return createPortal(
  <div className="fixed inset-0 z-[9999] flex items-center justify-center">

    {/* BACKDROP */}
    <div
      onClick={onClose}
      className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black/70 to-pink-900/40 animate-gradientSlow"
    />
    <div
      onClick={onClose}
      className="absolute inset-0 backdrop-blur-xl bg-black/50"
    />

    {/* MODAL */}
    <div
      className="
        relative
        w-[500px] max-w-[92%]
        rounded-2xl
        p-6
        border border-white/10
        bg-gradient-to-br from-[#141625]/90 via-[#0F1B2A]/90 to-[#0B1020]/90
        backdrop-blur-2xl
        shadow-[0_0_60px_rgba(168,85,247,0.35)]
        animate-modalPop
        overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* GLOW — FIXED POSITION */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl opacity-60 animate-glowPulse pointer-events-none" />

      {/* LOADING OVERLAY */}
      {saving && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-50">
          <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-10">
        {/* ⬇️ EVERYTHING INSIDE YOUR MODAL STAYS SAME ⬇️ */}


        {saving && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl z-[1000001]">
            <div className="w-14 h-14 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          </div>
        )}

        <h2 className="text-xl text-center font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
          Edit Profile
        </h2>
       
        {/* AVATAR */}
        <div className="flex justify-center mb-4">
          <label className="cursor-pointer block">
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
            <div className="avatar-fixed rounded-full overflow-hidden border-2 border-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              <img
                src={photo ? URL.createObjectURL(photo) : user?.photoURL || "/default-avatar.png"}
                className="w-full h-full object-cover"
              />
            </div>
          </label>
        </div>

        {/* FULL NAME */}
        <label className="text-xs text-white">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="premium-input mb-3 interactive text-white" />

        {/* USERNAME */}
        <label className="text-xs text-gray-300">Username</label>
        <div className="flex gap-2 mb-1">
          <input
            value={username}
            onChange={(e) => {
              const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "");
              setUsername(sanitized);
            }}
            className={`flex-1 premium-input interactive text-white ${
              usernameValid === false
                ? "ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.6)]"
                : usernameValid
                ? "ring-green-500 shadow-[0_0_10px_rgba(0,255,0,0.4)]"
                : ""
            }`}
          />
          <button onClick={autoGenerate} className="w-[95px] rounded-lg bg-white/10 hover:bg-white/20 hover:scale-105 transition text-sm text-white">
            Auto
          </button>
        </div>

        {/* FEEDBACK */}
        <div className="min-h-[42px] text-xs text-gray-200">
          {checking && <p>Checking…</p>}
          {!checking && usernameValid === false && (
            <>
              <p className="text-red-400 mb-1">Username taken</p>
              <div className="flex gap-2 flex-wrap">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => setUsername(s)} className="suggestion-chip">
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
          {!checking && usernameValid === true && username && <p className="text-green-400">Available</p>}
        </div>

        {/* DOB */}
        <label className="text-xs text-gray-300">Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="premium-input mb-3 interactive text-white" />

        {/* GENDER */}
        <label className="text-xs text-gray-300">Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="premium-input text-gray-200 mb-3 interactive">
          <option value="" className="text-black">Select gender</option>
          <option value="Male" className="text-black">Male</option>
          <option value="Female" className="text-black">Female</option>
          <option value="Other" className="text-black">Other</option>
        </select>

        {/* BIO */}
        <label className="text-xs text-gray-300">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="premium-input h-20 resize-none mb-5 interactive text-white" />

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} className="premium-cancel">Cancel</button>
          <button disabled={!canSave} onClick={handleSave} className={`premium-save ${!canSave && "opacity-40 cursor-not-allowed"}`}>
            Save
          </button>
        </div>

        <style>{`
          .premium-input {
            width: 100%;
            background: rgba(255,255,255,0.08);
            padding: 8px 10px;
            border-radius: 8px;
            outline: none;
            transition: 0.25s;
          }
          .interactive:focus {
            transform: scale(1.05);
            box-shadow: 0 0 18px rgba(168,85,247,0.75);
          }
          .suggestion-chip {
            background: rgba(255,255,255,0.12);
            padding: 4px 8px;
            border-radius: 6px;
            cursor: pointer;
          }
          .premium-save {
            background: linear-gradient(to right, #a855f7, #ec4899);
            color: white;
            padding: 6px 20px;
            border-radius: 8px;
          }
          .premium-cancel {
            background: rgba(255,255,255,0.08);
            color: #ddd;
            padding: 6px 20px;
            border-radius: 8px;
          }
          .avatar-fixed {
            width: 96px !important;
            height: 96px !important;
            min-width: 96px !important;
            min-height: 96px !important;
            max-width: 96px !important;
            max-height: 96px !important;
          }
            @keyframes modalPop {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes gradientSlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-modalPop {
  animation: modalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-glowPulse {
  animation: glowPulse 4s ease-in-out infinite;
}

.animate-gradientSlow {
  background-size: 300% 300%;
  animation: gradientSlow 12s ease infinite;
}

        `}</style>
      </div>
    </div>
  </div>,
  document.body
);
}