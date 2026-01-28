"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import EditProfileModal from "@/Profile/EditProfileModal";
import SettingsModal from "@/app/Settings/SettingsModal";
import { getDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import AssignmentAdvancedForm from "@/app/assignment/AssignmentAdvancedForm";
import AdvancedResearchForm from "@/app/research/AdvancedResearchForm";
import AdvancedPptForm from "@/app/ppt/AdvancedPptForm";
import { useRouter } from "next/navigation";
import PdfExportModal from "@/app/components/PdfExportModal";
import HandwrittenExportModal from "@/app/components/HandwrittenExportModal";
import HelpModal from "@/app/components/HelpModal";
import { usePlan } from "@/hooks/usePlan";
import { getAuth } from "firebase/auth";
import {
  canSendMessage,
  incrementMessageUsage,
} from "@/services/usage.service";
import WritingModal from "@/app/writing/WritingModal";
import DisclaimerBar from "@/app/components/DisclaimerBar";
import { useCookiePreferences } from "@/app/context/CookieContext";


import {
  doc,
  getDocs,
  collection,
  updateDoc,
  serverTimestamp,
  addDoc,
  deleteDoc,
  onSnapshot,     
  query,        // ✅ ADD
  where,        // ✅ ADD 
} from "firebase/firestore";

import { useAuth } from "@/contextAuth/AuthContext";
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

/* ================= TYPES ================= */



type Message = {
  role: "user" | "ai";
  text: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  pinned?: boolean;
  updatedAt?: Timestamp; // ✅ ADD THIS

};

type EmailPayload = {
  platform: string;
  purpose: string;
  tone: string;
  length: string;
  context: string;
};
export type SummaryPayload = {
  content?: string;
  youtubeUrl?: string;
  summaryType: "short" | "detailed" | "bullets" | "study" | "timestamped";
  style: "simple" | "academic" | "exam" | "beginner";
};


/* ================= MULTI TAB CHANNEL ================= */
const chatChannel =
  typeof window !== "undefined"
    ? new BroadcastChannel("acadify-chat-sync")
    : null;

/* =================  MessageActions  ================= */
const MessageActions = ({
  text,
  onRegenerate,
}: {
  text: string;
  onRegenerate: () => void;
}) => {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
  <div className="flex items-center gap-3 text-white/40 text-[11px]">
      <button
        onClick={copyToClipboard}
        className="hover:text-white transition"
        title="Copy"
      >
        <Copy size={14} />
      </button>

      <button
        onClick={() => alert("Thanks for the feedback 👍")}
        className="hover:text-green-400 transition"
        title="Like"
      >
        <ThumbsUp size={14} />
      </button>

      <button
        onClick={() => alert("Feedback noted 👎")}
        className="hover:text-red-400 transition"
        title="Dislike"
      >
        <ThumbsDown size={14} />
      </button>

      <button
        onClick={onRegenerate}
        className="hover:text-purple-400 transition"
        title="Regenerate"
      >
        <RefreshCw size={14} />
      </button>

      <button
        onClick={() => alert("More options coming soon")}
        className="hover:text-white transition"
        title="More"
      >
        <MoreHorizontal size={14} />
      </button>
    </div>
  );
};




/* ================= CHAT ROW ================= */

const ChatRow = ({
  chat,
  activeChatId,
  setActiveChat,
  openChatMenu,
  setOpenChatMenu,
  chatMenuRef,
  togglePin,
  renameChat,
  deleteChat,
}: any) => (

  <div
  onClick={() => setActiveChat(chat.id)}

  className={`group relative flex justify-between px-3 py-2 rounded-lg text-sm cursor-pointer ${
    chat.id === activeChatId
      ? "bg-gradient-to-r from-purple-600/30 to-pink-600/20 shadow-lg"
      : "hover:bg-white/10"
  }`}
>
  <span className="truncate flex items-center gap-1">
    {chat.pinned && <span className="text-xs opacity-60">★</span>}
    <span className="truncate">{chat.title}</span>
  </span>

  {chat.id !== "new-chat" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setOpenChatMenu(openChatMenu === chat.id ? null : chat.id);
      }}
    >
      ⋯
    </button>
  )}

  {openChatMenu === chat.id && (
    <div
      ref={chatMenuRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute right-2 top-10 w-40 bg-black border border-white/10 rounded-xl shadow-xl z-50"
    >
      <button onClick={() => togglePin(chat.id)} className="w-full px-4 py-2 text-left hover:bg-white/10">
        {chat.pinned ? "Unpin" : "Pin"}
      </button>

      <button onClick={() => renameChat(chat.id)} className="w-full px-4 py-2 text-left hover:bg-white/10">
        Rename
      </button>

      <button onClick={() => deleteChat(chat.id)} className="w-full px-4 py-2 text-left hover:bg-white/10 text-red-400">
        Delete
      </button>
    </div>
  )}
</div>
);


const MemoChatRow = React.memo(ChatRow);

/* ================= MAIN PAGE ================= */

export default function ChatPage() {
 
const regenerateLast = () => {
  if (!activeChatId) return;

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  const lastUser = [...chat.messages]
    .reverse()
    .find(m => m.role === "user");

  if (!lastUser) return;

  sendMessage(lastUser.text); // 🔥 reuse your existing logic
};

/* ================= free & premium ================= */


/* ================= EXPORT LIMIT (PDF + HANDWRITTEN) ================= */





const router = useRouter();


const [researchMode, setResearchMode] =
  useState<"basic" | "advanced">("basic");

const [researchAnimating, setResearchAnimating] = useState(false);



const [settingsOpen, setSettingsOpen] = useState(false);

const [settings, setSettings] = useState({
  autoScroll: true,
  enterToSend: true,
  chatHistory: true,
});


  const { user, logout } = useAuth();
const [currentUser, setCurrentUser] = useState<any>(user);

/* ================= free & premium ================= */
const {
  isFree,
  isStudentPlus,
  isPro,
  canUseAdvanced,
  hasUnlimited,
  label,
  exportLimit,     // ✅ ADD THIS
  messageLimit,    // (optional but recommended)
} = usePlan(currentUser);

  const [openingAdvanced, setOpeningAdvanced] = useState(false);


  const [assignmentMode, setAssignmentMode] = useState<"basic" | "advanced">("basic");


  const [marks, setMarks] = useState("10");
const [references, setReferences] = useState(true);
const [citations, setCitations] = useState("APA");
const [plagiarismSafe, setPlagiarismSafe] = useState(true);

const [assignmentAnimating, setAssignmentAnimating] = useState(false);

const [helpOpen, setHelpOpen] = useState(false);


  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const botTimeout = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);


  const [openChatMenu, setOpenChatMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const chatMenuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);  
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [previewPrompt, setPreviewPrompt] = useState<string | null>(null);

  const [exportsLeft, setExportsLeft] = useState<number | null>(null);
const [exportLimitReached, setExportLimitReached] = useState(false);



const DAILY_FREE_MESSAGE_LIMIT = messageLimit; // from usePlan

const [messagesLeft, setMessagesLeft] = useState<number | null>(null);
const [limitReached, setLimitReached] = useState(false);

const prevMessagesLeft = useRef<number | null>(null);
const [counterAnim, setCounterAnim] = useState("");


useEffect(() => {
 if (!user || !isFree) {
  setMessagesLeft(null);
  setLimitReached(false);
  return;
}

  const ref = doc(db, "users", user.uid);

  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;

    const data = snap.data();
    const usage = data.usage || {};

   const lastResetTs = usage?.lastResetAt?.toDate?.();
const todayUTC = new Date();

const todayKey = `${todayUTC.getUTCFullYear()}-${todayUTC.getUTCMonth() + 1}-${todayUTC.getUTCDate()}`;

const lastKey = lastResetTs
  ? `${lastResetTs.getUTCFullYear()}-${lastResetTs.getUTCMonth() + 1}-${lastResetTs.getUTCDate()}`
  : null;

const used =
  lastKey === todayKey
    ? Number(usage?.messagesToday ?? 0)
    : 0;


    const limit = messageLimit;

    const left = Math.max(0, limit - used);

    setMessagesLeft(left);
    setLimitReached(left <= 0);
  });

  return () => unsub();
}, [user, messageLimit]);

useEffect(() => {
  if (!user) return;

  if (hasUnlimited) {
    setExportsLeft(null);
    setExportLimitReached(false);
    return;
  }

  const usedToday = 0; // UI hint only (backend is real)
  const left = Math.max(0, exportLimit - usedToday);

  setExportsLeft(left);
  setExportLimitReached(left <= 0);
}, [user, exportLimit, hasUnlimited]);



useEffect(() => {
  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
}, []);

  /* ================= COOKIE PREFERENCES  ================= */
const { preferences } = useCookiePreferences();

useEffect(() => {
  if (!preferences) return;

  if (preferences.analytics) {
    console.log("📊 Analytics enabled");
    // load analytics script here later
  } else {
    console.log("🚫 Analytics disabled");
  }

  if (preferences.marketing) {
    console.log("📣 Marketing cookies enabled");
  }

}, [preferences]);


  /* ================= ACTIVE CHAT HANDLER ================= */

  const setActiveChat = (id: string, broadcast = true) => {
    if (abortControllerRef.current) {
    abortControllerRef.current.abort();
    abortControllerRef.current = null;
    setIsTyping(false);
  }
    setActiveChatId(id);

    if (broadcast && id !== "new-chat") {
      chatChannel?.postMessage({
        type: "ACTIVE_CHAT",
        chatId: id,
      });
    }
  };
  useEffect(() => {
  const handler = () => {
    setChats([]);               // 🔥 clear sidebar immediately
    setActiveChatId("new-chat");
  };

  window.addEventListener("chats-cleared", handler);
  return () => window.removeEventListener("chats-cleared", handler);
}, []);

useEffect(() => {
  if (!user) return;

  const last = sessionStorage.getItem("lastChatId");
  if (last) {
    setActiveChatId(last);
  } else {
    setActiveChatId("new-chat");
  }
}, [user]);



useEffect(() => {
  if (messagesLeft === null) return;

  // Only animate on change
  if (prevMessagesLeft.current !== null &&
      prevMessagesLeft.current !== messagesLeft) {
    setCounterAnim(
      messagesLeft <= 0 ? "animate-shake-red" : "animate-counter"
    );

    const t = setTimeout(() => setCounterAnim(""), 450);
    return () => clearTimeout(t);
  }

  prevMessagesLeft.current = messagesLeft;
}, [messagesLeft]);

/* ================= ensureChatExists ================= */
const ensureChatExists = async (
  user: any,
  activeChatId: string | null,
  setActiveChatId: (id: string) => void,
  title: string
): Promise<string> => {
  if (!user) throw new Error("User not logged in");

  let chatId = activeChatId;

  if (!chatId || chatId === "new-chat") {
    const ref = await addDoc(
      collection(db, "users", user.uid, "chats"),
      {
        title,
        pinned: false,
        messages: [],
        updatedAt: serverTimestamp(),
      }
    );

    chatId = ref.id;

    // 🔥 FORCE SYNC — NO REACT LAG
    setActiveChatId(chatId);
    sessionStorage.setItem("lastChatId", chatId);
  }

  return chatId;
};


  /* ================= MULTI TAB LISTENER ================= */

useEffect(() => {
  if (!chatChannel) return;

  const handler = (event: MessageEvent) => {
    const data = event.data;
    if (!data) return;

    if (data.type === "ACTIVE_CHAT") {
      setActiveChatId(data.chatId);
    }

    // ❌ DO NOT handle MESSAGE_UPDATE here
    // Firestore onSnapshot is the single source of truth
  };

  chatChannel.addEventListener("message", handler);
  return () => chatChannel.removeEventListener("message", handler);
}, []);







  /* ================= AssignmentMode ================= */

          /* ===== BasicAssignmentMode ===== */
const [assignmentOpen, setAssignmentOpen] = useState(false);

const [subject, setSubject] = useState("");
const [topic, setTopic] = useState("");
const [words, setWords] = useState("200"); // default under 250
const [tone, setTone] = useState("Simple Academic");

const generateAssignmentPrompt = () => {
  const prompt = `
Write a short academic assignment on "${topic}" for the subject "${subject}".

Rules:
- Maximum ${words} words (DO NOT exceed 250 words)
- Tone: ${tone}
- Simple, student-friendly language
- Clear and concise writing
- No unnecessary explanations

Structure:
1. Short Introduction
2. Main Points (brief)
3. Conclusion
`;
  setInput(prompt.trim());
  setAssignmentOpen(false);
};



  
/* ================= AdbancedAssignmentMode ================= */

useEffect(() => {
  if (!assignmentOpen) {
    setAssignmentMode("basic");
  }
}, [assignmentOpen]);


/* ================= RESEARCH MODE ================= */


         /* ===== BasicRESEARCH MODE ===== */
const [researchOpen, setResearchOpen] = useState(false);
const [researchTopic, setResearchTopic] = useState("");
const [researchDepth, setResearchDepth] = useState("Overview");
const [researchSources, setResearchSources] = useState("General");

const generateBasicResearchPrompt = () => {
  const prompt = `
Provide a short research overview on "${researchTopic}".

Rules:
- Maximum 250 words (DO NOT exceed)
- Level: ${researchDepth}
- Language: simple and student-friendly
- Avoid deep academic explanation

Structure:
1. Brief Introduction
2. Key Points
3. Short Conclusion
`;
  setInput(prompt.trim());
  setResearchOpen(false);
};



/* ================= ADVANCE RESEARCH MODE ================= */

useEffect(() => {
  if (!researchOpen) {
    setResearchMode("basic");
  }
}, [researchOpen]);



/* ================= PPT MODE ================= */


        /* ===== BASIC PPT MODE ===== */
const [pptOpen, setPptOpen] = useState(false);
const [pptMode, setPptMode] = useState<"basic" | "advanced">("basic");
const [pptAnimating, setPptAnimating] = useState(false);

const [pptTopic, setPptTopic] = useState("");
const [pptSlides, setPptSlides] = useState("6"); // basic max
const [pptTone, setPptTone] = useState("Simple");
const generateBasicPptPrompt = () => {
  const prompt = `
Create a short PPT on "${pptTopic}".

Rules:
- Maximum ${pptSlides} slides (DO NOT exceed 6)
- Tone: ${pptTone}
- Use short bullet points only
- Simple student-friendly language
- Avoid detailed explanations

Slide Structure:
1. Title
2. Introduction
3. Key Points
4. Summary
`;
  setInput(prompt.trim());
  setPptOpen(false);
};



/* ================= ADVANCE PPT MODE ================= */

useEffect(() => {
  if (!pptOpen) {
    setPptMode("basic");
  }
}, [pptOpen]);


/* ================= "pdf" | "handwritten" ================= */
const [exportMode, setExportMode] = useState<"handwritten" | "pdf" | null>(null);
const [pdfOpen, setPdfOpen] = useState(false);
const [handwrittenOpen, setHandwrittenOpen] = useState(false);

/* ================= | "handwritten" ================= */

const downloadHandwrittenPDF = async (
  text: string,
  preview = false
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

const token = await user.getIdToken(true); // 🔥 force refresh

  const res = await fetch("/api/handwritten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text,
      preview, // ✅ NEW
    }),
  });

 if (!res.ok) {
  let message = "Export failed";

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const err = await res.json();
    message = err.error || message;
  } else {
    message = await res.text(); // fallback
  }

  alert(message);
  return;
}


  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  if (preview) {
    window.open(url);
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = "handwritten.pdf";
    a.click();
  }

  URL.revokeObjectURL(url);
};




const getLastAIMessage = () => {
  if (!activeChatId) return null;

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat || !chat.messages) return null;

  const aiMessages = chat.messages.filter(m => m.role === "ai");
  return aiMessages.length > 0
    ? aiMessages[aiMessages.length - 1].text
    : null;
};


/* ================= "pdf" | ================= */


const handlePdfDownload = async (options: any) => {
  if (!options.text.trim()) {
    alert("Please enter content for the PDF");
    return;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("Please login with Google");
    return;
  }

  // 🔥 FORCE REFRESH TOKEN
  const token = await user.getIdToken(true);

  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔒 REQUIRED
    },
    body: JSON.stringify({
      text: options.text,
      title: options.title,
      subject: options.subject,
      includeTitle: options.includeTitle,
      pageNumbers: options.pageNumbers,
      plan: currentUser?.plan || "free",
    }),
  });

  // 🛑 BLOCK NON-PDF RESPONSES
  const contentType = res.headers.get("content-type");

  if (!res.ok || !contentType?.includes("application/pdf")) {
    let message = "PDF generation failed";

    if (contentType?.includes("application/json")) {
      const err = await res.json();
      message = err.error || message;
    } else {
      message = await res.text();
    }

    alert(message);
    return;
  }

  // ✅ SAFE TO DOWNLOAD PDF
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "acadify.pdf";
  a.click();

  URL.revokeObjectURL(url);
  setPdfOpen(false);
};



/* ================= WRITING MODE ================= */
const [writingOpen, setWritingOpen] = useState(false);



  /* ================= SAVE LAST CHAT (SAME TAB) ================= */

useEffect(() => {
  if (!user) return;

  const q = query(collection(db, "users", user.uid, "chats"));

  const unsub = onSnapshot(q, snap => {
    const fetched: Chat[] = [];
    snap.forEach(d => fetched.push({ id: d.id, ...(d.data() as any) }));

    // ✅ CHATGPT STYLE SORT
    const sorted = fetched.sort((a, b) => {
      // 1️⃣ pinned first
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

      // 2️⃣ newest updated first
      const ta = a.updatedAt?.toMillis?.() ?? 0;
      const tb = b.updatedAt?.toMillis?.() ?? 0;
      return tb - ta;
    });

    setChats(sorted);

    // fallback if active chat deleted
    if (
      activeChatId &&
      activeChatId !== "new-chat" &&
      !sorted.some(c => c.id === activeChatId)
    ) {
      setActiveChatId("new-chat");
    }
  });

  return () => unsub();
}, [user, activeChatId]);


  useEffect(() => {
    if (activeChatId) {
      sessionStorage.setItem("lastChatId", activeChatId);
    }
  }, [activeChatId]);

const [isUserNearBottom, setIsUserNearBottom] = useState(true);
const [showScrollButton, setShowScrollButton] = useState(false);

const activeChat = chats.find(c => c.id === activeChatId);

useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  const handleScroll = () => {
    const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
    const near = distance < 120;

    setIsUserNearBottom(near);
    setShowScrollButton(!near);
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  if (isUserNearBottom) {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
}, [chats, isTyping]);

useEffect(() => {
  setIsUserNearBottom(true);
  setShowScrollButton(false);
}, [activeChatId]);

useEffect(() => {
  setCurrentUser(user);
}, [user]);


useEffect(() => {
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  return () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };
}, []);

useEffect(() => {
  const pending = sessionStorage.getItem("pendingPrompt");
  if (pending) {
    setInput(pending);
    sessionStorage.removeItem("pendingPrompt");
  }
}, []);





  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node))
        setProfileOpen(false);

      if (chatMenuRef.current && !chatMenuRef.current.contains(event.target as Node))
        setOpenChatMenu(null);
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false); // mobile / tablet
    } else {
      setSidebarOpen(true);  // desktop
    }
  };

  // run once on mount
  handleResize();

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);



useEffect(() => {
  if (user === null) {
    window.location.href = "/login";
  }
}, [user]);

  
{/* text area */}
useEffect(() => {
  if (!textareaRef.current) return;

  const ta = textareaRef.current;
  ta.style.height = "auto";

  const maxHeight = 200;
  if (ta.scrollHeight > maxHeight) {
    ta.style.height = maxHeight + "px";
    ta.style.overflowY = "auto";
  } else {
    ta.style.height = ta.scrollHeight + "px";
    ta.style.overflowY = "hidden";
  }
}, [input]);





const isBlockingModalOpen =
  settingsOpen ||
  editProfileOpen ||
  assignmentOpen ||
  researchOpen ||
  pptOpen;


/* ================= delete chat from setting (SAME TAB) ================= */

useEffect(() => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);

  const unsub = onSnapshot(userRef, async snap => {
    if (!snap.exists()) return;

    const settings = snap.data().settings;
    if (!settings) return;

    const chatsRef = collection(db, "users", user.uid, "chats");
    const chatsSnap = await getDocs(chatsRef);

    // 🔥 DELETE ALL (except pinned)
    if (settings.clearChatsAt) {
  await Promise.all(
    chatsSnap.docs
      .filter(d => !d.data().pinned)
      .map(d => deleteDoc(d.ref))
  );

  await updateDoc(userRef, {
    "settings.clearChatsAt": null,
  });

  // ✅ ONLY reset active chat
  setActiveChatId("new-chat");
  sessionStorage.removeItem("lastChatId");
}


    // 🔥 DELETE OLDER THAN 30 DAYS
    if (settings.deleteOlderThanDays && settings.deleteTriggeredAt) {
      const cutoff =
        Date.now() - settings.deleteOlderThanDays * 86400000;

      await Promise.all(
        chatsSnap.docs
          .filter(d => {
            const t = d.data().updatedAt?.toMillis?.();
            return !d.data().pinned && t && t < cutoff;
          })
          .map(d => deleteDoc(d.ref))
      );

      await updateDoc(userRef, {
        "settings.deleteTriggeredAt": null,
      });
    }
  });

  return () => unsub();
}, [user]);

   
  /* ================= NEW CHAT ================= */

 const newChat = useCallback(() => {
  setActiveChat("new-chat", false); // do NOT broadcast new chat
}, []);


/* ================= SEND MESSAGE ================= */
const sendMessage = useCallback(
  async (text: string) => {
    if (!user || !activeChatId) return;
    if (!text.trim()) return;
    if (isTyping) return;

    // 🔒 REAL BACKEND LIMIT CHECK
    const usage = await canSendMessage(user.uid);

    if (usage.allowed) {
  setLimitReached(false);
}

if (!usage.allowed) {
  if (!limitReached) {
    setLimitReached(true);
    alert("Daily chat limit reached. Upgrade to continue 🚀");
  }
  return;
}

    // 👇 continue normal send logic below


    if (!settings.chatHistory && activeChatId === "new-chat") {
    alert("Chat history is disabled. Enable it in Settings to start a new chat.");
    return;
}

    let chatId = activeChatId;
    const chat = chats.find((c) => c.id === chatId);

    if (chatId === "new-chat") {
      const chatRef = await addDoc(collection(db, "users", user.uid, "chats"), {
        title: text.slice(0, 24),
        pinned: false,
        messages: [],
        updatedAt: serverTimestamp(),
      });

      chatId = chatRef.id;


      setActiveChat(chatId);
    }

    const previousMessages = chat?.messages ?? [];
    const newMessages = [...previousMessages, { role: "user" as const, text }];

    
    // 🚫 Do not save if chat history is OFF
if (!settings.chatHistory) {
  setInput("");
  setIsTyping(false);
  return;
}

    await updateDoc(doc(db, "users", user.uid, "chats", chatId), {
      messages: newMessages,
      updatedAt: serverTimestamp(),
    });



    setInput("");
    // 🔥 RESET textarea height like ChatGPT
requestAnimationFrame(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
  }
});
    
try {
  console.log("🟢 Calling /api/generate");
const controller = startGeneration();

const res = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  signal: controller.signal,          // 🔥 IMPORTANT
  body: JSON.stringify({
    type: "chat",
    message: text,
    chatId,
  }),
});



  console.log("🟡 Response status:", res.status);

  const data = await res.json();
  console.log("🟣 Gemini response:", data);

  if (controller.signal.aborted) return;   // 🔥 ADD THIS


  const botMsg = {
    role: "ai" as const,
    text: data.text || "AI returned empty response.",
  };
  // 🔥 Optimistic UI update
setChats(prev =>
  prev.map(c =>
    c.id === chatId
      ? { ...c, messages: [...newMessages, botMsg] }
      : c
  )
);

// 🔥 STOP TYPING IMMEDIATELY
setIsTyping(false);
abortControllerRef.current = null;

  await updateDoc(doc(db, "users", user.uid, "chats", chatId), {
    messages: [...newMessages, botMsg],
    updatedAt: serverTimestamp(),
  });

  

  await incrementMessageUsage(user.uid);
  

  } catch (err: any) {
  if (err.name === "AbortError") {
    console.log("🛑 Generation aborted by user");
    // DO NOT save any AI message
    return;
  }
  await updateDoc(doc(db, "users", user.uid, "chats", chatId), {
    messages: [
      ...newMessages,
      {
        role: "ai",
        text: "⚠️ Failed to generate response.",
      },
    ],
    updatedAt: serverTimestamp(),
  });
} finally {
  
}

  }, [
  user,
  activeChatId,
  chats,
  isTyping,
  settings.chatHistory,
  setActiveChat
]);
////////////////////////////stop bot/////////////////
const startGeneration = () => {
  // Cancel any previous running request
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  const controller = new AbortController();
  abortControllerRef.current = controller;

  setIsTyping(true);

  return controller;
};
const stopBot = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();   // 🔥 cancel backend call
    abortControllerRef.current = null;
  }

  setIsTyping(false);
};




  const togglePin = async (id: string) => {
    if (!user) return;

    const chat = chats.find((c) => c.id === id);
    if (!chat) return;

    const countPinned = chats.filter((c) => c.pinned).length;

    if (!chat.pinned && countPinned >= 3) {
      alert("You can pin only 3 chats.");
      return;
    }

    await updateDoc(doc(db, "users", user.uid, "chats", id), {
      pinned: !chat.pinned,
    });


    setOpenChatMenu(null);
  };

  const renameChat = async (id: string) => {
    if (!user) return;

    const name = prompt("Rename chat");
    if (!name) return;

    await updateDoc(doc(db, "users", user.uid, "chats", id), {
      title: name,
      updatedAt: serverTimestamp(),
    });

    
  };
/* ================= handleBlogUse ================= */
const handleBlogUse = async (payload: {
  topic: string;
  blogType: string;
  tone: string;
  audience: string;
  length: string;
  seo: string;
}) => {
  if (!user) return;

  // 🔒 Enforce daily limit (NO bypass)
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

   try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Blog: ${payload.topic.slice(0, 20)}`
    );

    // 🔥 ABORT SAFETY (before any DB reads)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Blog request: ${payload.topic}`,
    };

    // 2️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 3️⃣ Call backend
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.text) throw new Error("No blog generated");

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 4️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 Decrease daily limit
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Blog generation aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Blog generation failed:", err);
    alert("Failed to generate blog");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};

/* ================= SCRIPT HANDLER ================= */
const handleScriptUse = async (payload: {
  topic: string;
  platform: string;
  tone: string;
  duration: string;
  audience: string;
  style: string;
}) => {
  if (!user) return;

  // 🔒 REAL BACKEND LIMIT CHECK
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

  try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Script: ${payload.topic.slice(0, 20)}`
    );


    // 🔥 ABORT SAFETY (before any DB reads)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Script request for ${payload.platform}`,
    };

    // 3️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 4️⃣ Call backend (hidden prompt)
    const res = await fetch("/api/script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.text) throw new Error("No script generated");

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 5️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Script generation aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Script generation failed:", err);
    alert("Failed to generate script");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};


/* ================= RESUME HANDLER ================= */
const handleResumeUse = async (payload: {
  name: string;
  role: string;
  experience: string;
  skills: string;
  education: string;
  tone: string;
  resumeType: string;
}) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

  try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Resume: ${payload.role.slice(0, 20)}`
    );

    // 🔥 ABORT SAFETY (before any DB writes)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Resume for ${payload.role}`,
    };

    // 3️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 4️⃣ Call backend
    const res = await fetch("/api/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.text) throw new Error("No resume generated");

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 5️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Resume generation aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Resume generation failed:", err);
    alert("Failed to generate resume");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};



/* ================= EBOOK HANDLER ================= */
const handleEbookUse = async (payload: {
  title: string;
  topic: string;
  audience: string;
  tone: string;
  chapters: number;
  depth: "basic" | "detailed" | "advanced";
  bookType: string;
  includeExamples: boolean;
  includeActions: boolean;
  outlineOnly: boolean;
}) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

 try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Ebook: ${payload.title.slice(0, 20)}`
    );

    // 🔥 ABORT SAFETY (before any DB writes)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `E-book request: ${payload.title}`,
    };

    // 3️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 4️⃣ Call backend
    const res = await fetch("/api/ebook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.text) throw new Error("No ebook generated");

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 5️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Ebook generation aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Ebook generation failed:", err);
    alert("Failed to generate ebook");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};

/* ================= EMAIL HANDLER ================= */
const handleEmailUse = async (payload: EmailPayload) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

  try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Email: ${payload.purpose.slice(0, 20)}`    );

    // 🔥 ABORT SAFETY (before any DB writes)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Email request: ${payload.purpose} (${payload.tone}, ${payload.length})`,
    };

    // 3️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 4️⃣ Call backend
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data: { text?: string } = await res.json();
    if (!data.text) throw new Error("No email generated");

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 5️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Email generation aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Email generation failed:", err);
    alert("Failed to generate email");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};


/* ================= SUMMARY HANDLER ================= */
const handleSummaryUse = async (payload: SummaryPayload) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

  try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Summary: ${payload.summaryType}`  
      );

    // 🔥 ABORT SAFETY (before any DB writes)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Summary request (${payload.summaryType}, ${payload.style})`,
    };

    // 3️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 4️⃣ Call backend
    const res = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data: { text?: string } = await res.json();
    if (!data.text) throw new Error("No summary generated");

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 5️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Summary generation aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Summary generation failed:", err);
    alert("Failed to generate summary");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};



    const saveAIMessage = async (chatId: string, text: string) => {
  if (!user) return;

  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  const updated = [
    ...(chat.messages || []),
    { role: "ai" as const, text },
  ];

  await updateDoc(
    doc(db, "users", user.uid, "chats", chatId),
    {
      messages: updated,
      updatedAt: serverTimestamp(),
    }
  );
};


  

  

const deleteChat = async (id: string) => {
  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "chats", id));

  if (activeChatId === id) {
    setActiveChatId("new-chat");
  }

  setOpenChatMenu(null);
};

const deleteAllChats = async () => {
  if (!user) return;

  const q = query(collection(db, "users", user.uid, "chats"));
  const snap = await getDocs(q);

  await Promise.all(
    snap.docs.map(d =>
      deleteDoc(doc(db, "users", user.uid, "chats", d.id))
    )
  );

  // 🔥 HARD RESET
  setChats([]);
  setActiveChatId("new-chat");
  sessionStorage.removeItem("lastChatId");

  // notify same tab listeners
  window.dispatchEvent(new Event("chats-cleared"));
};

const handleLogout = async () => {
  sessionStorage.removeItem("lastChatId");
  await logout();
  window.location.href = "/";
};


  const pinned = chats.filter(c => c.pinned === true);
const normal = chats.filter(c => c.pinned !== true);

  const PROMPTS = {
  assignment:
    "Write a 1000 word assignment on Artificial Intelligence in Computer Science with introduction, body, and conclusion.",
  research:
    "Research Blockchain Technology. Provide a detailed explanation with scholarly sources, examples, and conclusion.",
  ppt:
    "Create a 10-slide PPT on Machine Learning in a professional tone with bullet points for each slide."
};

/* ================= Advanced Assignment Handler ================= */

const handleAdvancedAssignmentUse = async (payload: any) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

  try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Assignment: ${payload.topic.slice(0, 20)}`
    );

    // 🔥 ABORT SAFETY (before any DB reads)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Assignment request: ${payload.topic} (${payload.words} words)`,
    };

    // 2️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 3️⃣ Call backend (hidden prompt)
    const res = await fetch("/api/generate/assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.text) {
      throw new Error("No assignment generated");
    }

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 4️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Advanced assignment aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Advanced assignment failed:", err);
    alert("Failed to generate assignment");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};


/* ================= Advanced Research Handler ================= */

const handleAdvancedResearchUse = async (payload: any) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

  try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `Research: ${payload.subject.slice(0, 20)}`
    );

    // 🔥 ABORT SAFETY (before any DB reads)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `Research request: ${payload.subject} (${payload.depth})`,
    };

    // 2️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 3️⃣ Call backend (hidden prompt)
    const res = await fetch("/api/generate/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.text) {
      throw new Error("No research generated");
    }

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 4️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Advanced research aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Advanced research failed:", err);
    alert("Failed to generate research");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};

/* ================= Advanced PPT Handler ================= */

const handleAdvancedPptUse = async (payload: {
  topic: string;
  slides: string;
  tone: string;
  audience: string;
  visuals: boolean;
  citations: string;
  originalitySafe: boolean;
}) => {
  if (!user) return;

  // 🔒 ENFORCE DAILY LIMIT
  const usage = await canSendMessage(user.uid);
  if (!usage.allowed) {
    alert("Daily limit reached. Upgrade to continue 🚀");
    return;
  }

  const controller = startGeneration();

 try {
    const chatId = await ensureChatExists(
      user,
      activeChatId,
      setActiveChatId,
      `PPT: ${payload.topic.slice(0, 20)}`
    );

    // 🔥 ABORT SAFETY (before any DB reads)
    if (controller.signal.aborted) return;

    // 🔥 ALWAYS READ FRESH CHAT STATE
    const snap1 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages1 = snap1.data()?.messages || [];

    const userMessage = {
      role: "user" as const,
      text: `PPT request: ${payload.topic} (${payload.slides} slides, ${payload.tone})`,
    };

    // 2️⃣ SAVE USER MESSAGE FIRST
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages1, userMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 3️⃣ Call backend (hidden prompt)
    const res = await fetch("/api/generate/ppt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.text) {
      throw new Error("No PPT generated");
    }

    // 🔥 ABORT SAFETY — MUST BE BEFORE SAVING AI MESSAGE
    if (controller.signal.aborted) return;

    const aiMessage = {
      role: "ai" as const,
      text: data.text,
    };

    // 🔥 FETCH LATEST MESSAGES (AVOID RACE CONDITIONS)
    const snap2 = await getDoc(
      doc(db, "users", user.uid, "chats", chatId)
    );

    const currentMessages2 = snap2.data()?.messages || [];

    // 4️⃣ SAFE ATOMIC UPDATE
    await updateDoc(
      doc(db, "users", user.uid, "chats", chatId),
      {
        messages: [...currentMessages2, aiMessage],
        updatedAt: serverTimestamp(),
      }
    );

    // 🔥 DECREASE DAILY LIMIT
    await incrementMessageUsage(user.uid);

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.log("🛑 Advanced PPT aborted by user");
      return; // ❌ do not save anything
    }

    console.error("Advanced PPT failed:", err);
    alert("Failed to generate PPT");

  } finally {
    abortControllerRef.current = null;
    setIsTyping(false);
  }
};


  return (
    <>
      {/* Edit Profile Modal */}
{editProfileOpen && (
  <EditProfileModal
    user={currentUser}
    isOpen={editProfileOpen}
    onClose={() => setEditProfileOpen(false)}
    refreshUser={(updatedUser) => {
      setCurrentUser(updatedUser);
    }}
  />
)}

{/* ✅ Settings Modal — MOVE HERE */}
{settingsOpen && (
  <SettingsModal
    isOpen={settingsOpen}
    onClose={() => setSettingsOpen(false)}
  />
)}
<PdfExportModal
  isOpen={pdfOpen}
  onClose={() => setPdfOpen(false)}
  onDownload={handlePdfDownload}
/>
<HandwrittenExportModal
  isOpen={handwrittenOpen}
  onClose={() => setHandwrittenOpen(false)}
  defaultText={getLastAIMessage() || ""}
  onDownload={downloadHandwrittenPDF}   // ✅ ADD THIS
/>
<WritingModal
  isOpen={writingOpen}
  onClose={() => setWritingOpen(false)}
  onUseEmail={handleEmailUse}
  onUseBlog={handleBlogUse}
  onUseScript={handleScriptUse}
  onUseResume={handleResumeUse}
  onUseEbook={handleEbookUse}
  onUseSummary={handleSummaryUse}   // ✅ ADD

/>


    
    {assignmentOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
<div className="relative bg-[#111] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-visible">

      {/* BASIC MODE */}
      {assignmentMode === "basic" && (
  <div
    className={`
      p-6
      transition-all duration-300 ease-in-out
      ${assignmentAnimating
        ? "-translate-x-10 opacity-0"
        : "translate-x-0 opacity-100"}
    `}
  >

          <h2 className="text-xl font-semibold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Assignment Mode
          </h2>

          <label className="text-xs text-gray-300">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full mb-3 bg-white/10 rounded-lg px-3 py-2 outline-none text-white"
          />

          <label className="text-xs text-gray-300">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full mb-3 bg-white/10 rounded-lg px-3 py-2 outline-none text-white"
          />

          <label className="text-xs text-gray-300">
  Word Count <span className="text-[10px] text-gray-400">(Max 250)</span>
</label>
<select
  value={words}
  onChange={(e) => setWords(e.target.value)}
  className="w-full mb-3 bg-white/10 rounded-lg px-3 py-2 text-white"
>
  <option className="bg-[#111] text-white" value="150">150</option>
  <option className="bg-[#111] text-white" value="200">200</option>
  <option className="bg-[#111] text-white" value="250">250</option>
</select>


          <label className="text-xs text-gray-300">Tone</label>
<select
  value={tone}
  onChange={(e) => setTone(e.target.value)}
  className="w-full mb-5 bg-white/10 rounded-lg px-3 py-2 text-white"
>
  <option className="bg-[#111] text-white" value="Simple Academic">Simple Academic</option>
  <option className="bg-[#111] text-white" value="Easy & Clear">Easy & Clear</option>
  <option className="bg-[#111] text-white" value="Exam-Oriented Short">Exam-Oriented Short</option>
</select>


          <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <button
  onClick={() => {
   if (!canUseAdvanced) {
  alert("Advanced mode is for Student+ and Pro users 🚀");
  return;
}

    setAssignmentAnimating(true);
    setTimeout(() => {
      setAssignmentMode("advanced");
      setAssignmentAnimating(false);
    }, 250);
  }}
  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
>
  🔒 Try Advanced →
</button>

            <div className="flex gap-3">
              <button
                onClick={() => setAssignmentOpen(false)}
                className="px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                Cancel
              </button>

              <button
                onClick={generateAssignmentPrompt}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED MODE */}
     {assignmentMode === "advanced" && (
  <div
    className="
      p-6
      animate-advancedSlideInoverflow-visible
    "
  >
   <AssignmentAdvancedForm
  onBack={() => {
    setAssignmentAnimating(true);
    setTimeout(() => {
      setAssignmentMode("basic");
      setAssignmentAnimating(false);
    }, 250);
  }}
  onGenerate={(data) => {
    handleAdvancedAssignmentUse(data);
    setAssignmentOpen(false);
    setAssignmentMode("basic");
  }}
/>

  </div>
)}


    </div>
  </div>
)}





      {/* RESEARCH MODE MODAL */}
{researchOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="relative bg-[#111] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-visible">

      {/* ================= BASIC MODE ================= */}
      {researchMode === "basic" && (
        <div
          className={`
            p-6
            transition-all duration-300 ease-in-out
            ${researchAnimating
              ? "-translate-x-10 opacity-0"
              : "translate-x-0 opacity-100"}
          `}
        >
          <h2 className="text-xl font-semibold text-center mb-4
            bg-gradient-to-r from-blue-400 to-cyan-400
            bg-clip-text text-transparent">
            Research Mode
          </h2>

          <label className="text-xs text-gray-300">Research Topic</label>
          <input
            value={researchTopic}
            onChange={(e) => setResearchTopic(e.target.value)}
            className="w-full mb-3 bg-white/10 rounded-lg text-white px-3 py-2 outline-none"
          />

         <label className="text-xs text-gray-300">
  Depth <span className="text-[10px] text-gray-400">(Basic only)</span>
</label>
<select
  value={researchDepth}
  onChange={(e) => setResearchDepth(e.target.value)}
  className="w-full mb-3 bg-white/10 rounded-lg px-3 py-2 text-white"
>
  <option className="bg-[#111] text-white" value="Overview">Short Overview</option>
  <option className="bg-[#111] text-white" value="Student Level">Student Level</option>
</select>


         <label className="text-xs text-gray-300">Sources</label>
<select
  value={researchSources}
  onChange={(e) => setResearchSources(e.target.value)}
  className="w-full mb-5 bg-white/10 rounded-lg px-3 py-2 text-white"
>
 <option className="bg-[#111] text-white"  value="General">General Web</option>
 <option className="bg-[#111] text-white"  value="Student Notes">Student Notes</option>
</select>

          <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <button
  onClick={() => {
    if (!canUseAdvanced) {
  alert("Advanced mode is for Student+ and Pro users 🚀");
  return;
}

    setResearchAnimating(true);
    setTimeout(() => {
      setResearchMode("advanced");
      setResearchAnimating(false);
    }, 250);
  }}
  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
>
  🔒 Try Advanced →
</button>


            <div className="flex gap-3">
              <button
                onClick={() => setResearchOpen(false)}
                className="px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                Cancel
              </button>

            <button
  onClick={generateBasicResearchPrompt}
  disabled={!researchTopic.trim()}
  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg disabled:opacity-40"
>
  Generate
</button>

            </div>
          </div>
        </div>
      )}

      {/* ================= ADVANCED MODE ================= */}
      {researchMode === "advanced" && (
        <div className="p-6 animate-advancedSlideIn overflow-visible">
         <AdvancedResearchForm
  onBack={() => {
    setResearchAnimating(true);
    setTimeout(() => {
      setResearchMode("basic");
      setResearchAnimating(false);
    }, 250);
  }}
  onGenerate={(data) => {
    handleAdvancedResearchUse(data);
    setResearchOpen(false);
    setResearchMode("basic");
  }}
/>

        </div>
      )}
    </div>
  </div>
)}

{/* PPT MODE MODAL */}
{pptOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="relative bg-[#111] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-visible">

      {/* ================= BASIC MODE ================= */}
      {pptMode === "basic" && (
        <div
          className={`
            p-6
            transition-all duration-300 ease-in-out
            ${pptAnimating ? "-translate-x-10 opacity-0" : "translate-x-0 opacity-100"}
          `}
        >
          <h2
            className="
              text-xl font-semibold text-center mb-4
              bg-gradient-to-r from-yellow-400 to-orange-400
              bg-clip-text text-transparent
            "
          >
            PPT Mode
          </h2>

          <label className="text-xs text-gray-300">Topic</label>
          <input
            value={pptTopic}
            onChange={(e) => setPptTopic(e.target.value)}
            className="w-full mb-3 bg-white/10 rounded-lg px-3 py-2 outline-none text-white"
          />

          <label className="text-xs text-gray-300">
  Slides <span className="text-[10px] text-gray-400">(Max 6)</span>
</label>
<select
  value={pptSlides}
  onChange={(e) => setPptSlides(e.target.value)}
  className="w-full mb-3 bg-white/10 rounded-lg px-3 py-2 text-white"
>
  <option className="bg-[#111] text-white" value="4">4 Slides</option>
 <option className="bg-[#111] text-white" value="5">5 Slides</option>
  <option className="bg-[#111] text-white" value="6">6 Slides</option>
</select>


         <label className="text-xs text-gray-300">Tone</label>
<select
  value={pptTone}
  onChange={(e) => setPptTone(e.target.value)}
  className="w-full mb-5 bg-white/10 rounded-lg px-3 py-2 text-white"
>
  <option className="bg-[#111] text-white" value="Simple">Simple</option>
  <option className="bg-[#111] text-white" value="Student Friendly">Student Friendly</option>
  <option className="bg-[#111] text-white" value="Clean Bullet Points">Clean Bullet Points</option>
</select>


          <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <button
  onClick={() => {
   if (!canUseAdvanced) {
  alert("Advanced mode is for Student+ and Pro users 🚀");
  return;
}


    setPptAnimating(true);
    setTimeout(() => {
      setPptMode("advanced");
      setPptAnimating(false);
    }, 250);
  }}
  className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
>
  🔒 Try Advanced →
</button>


            <div className="flex gap-3">
              <button
                onClick={() => setPptOpen(false)}
                className="px-4 py-2 bg-white/10 rounded-lg text-white"
              >
                Cancel
              </button>

             <button
  onClick={generateBasicPptPrompt}
disabled={!pptTopic.trim()}
  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg disabled:opacity-40"
>
  Generate
</button>

            </div>
          </div>
        </div>
      )}

      {/* ================= ADVANCED MODE ================= */}
      {pptMode === "advanced" && (
        <div className="p-6 animate-advancedSlideIn overflow-visible">
         <AdvancedPptForm
  onBack={() => {
    setPptAnimating(true);
    setTimeout(() => {
      setPptMode("basic");
      setPptAnimating(false);
    }, 250);
  }}
  onGenerate={(data) => {
    handleAdvancedPptUse(data);
    setPptOpen(false);
    setPptMode("basic");
  }}
/>

        </div>
      )}
    </div>
  </div>
)}





{/* MAIN LAYOUT */}
<div className="flex h-screen w-full bg-[#0E0E0F] text-white overflow-hidden blur-fix">

  {/* MAIN CHAT AREA */}
<main className="relative flex flex-col flex-1 min-h-0 min-w-0">

    {/* Header */}
<div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/10 blur-fix">
     <button
  onClick={() => setSidebarOpen(prev => !prev)}
  className="
    px-3 py-2 rounded-lg bg-white/10
    hover:bg-white/20 transition
  "
>
  <span
    className={`inline-block transition-transform duration-200 ${
      sidebarOpen ? "rotate-90" : ""
    }`}
  >
    {sidebarOpen ? "✕" : "☰"}
  </span>
</button>


      
            <h1 className="font-semibold text-lg cursor-pointer">AI Videxa</h1>
   {isFree && messagesLeft !== null && (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div
      className={`
        px-4 py-1.5 rounded-full text-xs font-medium border
        backdrop-blur-md
        transition-colors duration-300
        ${counterAnim}
        ${
          messagesLeft <= 0
            ? "bg-red-500/25 text-red-300 border-red-400/30"
            : "bg-white/10 text-gray-300 border-white/10"
        }
      `}
    >
      {messagesLeft} / {messageLimit} messages left
    </div>
  </div>
)}



 

            {isTyping && (
              <button
                onClick={stopBot}
                className="ml-auto bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Stop
              </button>
            )}
          </div>

      {/* Messages + Auto Scroll */} 
<div
  ref={messagesContainerRef}
  className="flex-1 min-h-0 overflow-y-scroll px-6 py-6 custom-scroll scrollbar-stable blur-fix"
>

<div className="w-full max-w-[680px] mx-auto px-4 space-y-8">

    {/* Welcome Screen */}
    {(!activeChatId ||
      activeChatId === "new-chat" ||
      (chats.find((c) => c.id === activeChatId)?.messages.length ?? 0) === 0
    ) && (
<div className="relative flex flex-col items-center justify-center py-24 w-full text-center">

        {/* Sparkle glow */}
        <div className="absolute animate-pulse opacity-40 blur-fix">
  <div className="w-48 h-48 bg-purple-500/20 blur-3xl rounded-full"></div>
  <div className="w-32 h-32 bg-pink-500/20 blur-2xl rounded-full absolute top-10 left-10"></div>
  <div className="w-24 h-24 bg-blue-500/20 blur-2xl rounded-full absolute -top-5 right-5"></div>
</div>


        {/* lowered center */}
        <div className="translate-y-10 flex flex-col items-center">

          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400
          text-transparent bg-clip-text animate-[pulse_2.5s_ease-in-out_infinite]">
            Welcome to AI Videxa ✨
          </h2>

          <p className="text-gray-400 text-xs mt-2 mb-8 max-w-sm">
            Generate Assignments, Research & PPTs with academic precision.
          </p>

          {/* Inverted Pyramid */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              
             <button
  disabled={isTyping}   // 👈 ADD HERE
  onMouseEnter={() => setPreviewPrompt(PROMPTS.assignment)}
  onMouseLeave={() => setPreviewPrompt(null)}
  onClick={() => setInput(PROMPTS.assignment)}
  className="px-3 py-2 bg-white/5 border border-white/10 text-xs rounded-lg
             hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
>
  ✎ Assignment Example
</button>

            <button
  disabled={isTyping}
  onMouseEnter={() => setPreviewPrompt(PROMPTS.research)}
  onMouseLeave={() => setPreviewPrompt(null)}
  onClick={() => setInput(PROMPTS.research)}
  className="px-3 py-2 bg-white/5 border border-white/10 text-xs rounded-lg
             hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
>
  🔍 Research Example
</button>


            </div>

          <button
  disabled={isTyping}
  onMouseEnter={() => setPreviewPrompt(PROMPTS.ppt)}
  onMouseLeave={() => setPreviewPrompt(null)}
  onClick={() => setInput(PROMPTS.ppt)}
  className="px-3 py-2 bg-white/5 border border-white/10 text-xs rounded-lg
             hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
>
  📊 PPT Example
</button>


          </div>

        </div>
      </div>
    )}

    {previewPrompt && (
  <div
    className="
      mt-4 max-w-md text-left
      bg-[#0F0F11]/90
      border border-white/10
      rounded-xl
      p-4
      text-xs text-gray-300
      shadow-xl
      backdrop-blur
      animate-fadeIn
    "
  >
    <p className="text-[11px] text-gray-400 mb-1">Preview</p>
    <p className="leading-relaxed">{previewPrompt}</p>
  </div>
)}


    {/* Chat Messages */}
{activeChatId &&
  chats.find((c) => c.id === activeChatId)?.messages.map((msg, i) => (
    <div key={i} className="w-full max-w-[680px] mx-auto py-2">

      {/* USER MESSAGE — bubble */}
      {msg.role === "user" ? (
        <div
          className="
            ml-auto
            max-w-[75%]
            rounded-2xl
            bg-[#F4F4F5]
            text-[#0A0A0A]
            px-4 py-2.5
            text-[15px]
            leading-[1.6]
            whitespace-pre-wrap
            break-words
          "
        >
          {msg.text}
        </div>
      ) : (

        /* AI MESSAGE — flat like ChatGPT */
        <div
  className="
    text-[#E5E5E7]
    text-[15px]
    leading-[1.75]
    whitespace-pre-wrap
    break-words
    px-0
    tracking-[0.01em]
  "
>


          {msg.text}

          {/* Actions row (ChatGPT placement) */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <MessageActions
              text={msg.text}
              onRegenerate={regenerateLast}
            />
          </div>

        </div>
      )}
    </div>
))}


   {isTyping && (
  <div className="flex items-center gap-3 text-[#E5E5E7] text-sm leading-[1.75]">
    {/* Avatar pulse */}
    <div className="relative">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
      <div className="absolute inset-0 rounded-full blur-md bg-purple-500/40"></div>
    </div>

    {/* Typing bubble */}
<div className="bg-[#1A1A1D] border border-white/10 px-5 py-3 rounded-2xl shadow-lg backdrop-blur-md blur-fix">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-white/70 rounded-full animate-typingDot"></span>
        <span className="w-2.5 h-2.5 bg-white/70 rounded-full animate-typingDot delay-150"></span>
        <span className="w-2.5 h-2.5 bg-white/70 rounded-full animate-typingDot delay-300"></span>
      </div>
    </div>
  </div>
)}



    {/* Auto scroll anchor */}
    <div ref={messagesEndRef} />
  </div>
</div>



{showScrollButton &&
  activeChatId &&
  activeChatId !== "new-chat" &&
  activeChat &&
  activeChat.messages &&
  activeChat.messages.length > 0 && (
    <button
      onClick={() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setIsUserNearBottom(true);
      }}
      className="
        fixed bottom-32 left-1/2 -translate-x-1/2
        px-5 py-2 rounded-full
        bg-gradient-to-r from-purple-600 to-pink-500
        text-white text-sm font-semibold
        shadow-[0_0_20px_rgba(236,72,153,0.5)]
        border border-white/10
        backdrop-blur-lg
        hover:scale-105 transition-all
        z-[500]
      "
    >
      ↓ 
    </button>
)}


      {/* INPUT BAR */}
{/* INPUT BAR */}
<div className="border-t border-white/10 px-3 pt-2 pb-2 sm:px-4 sm:pt-2 sm:pb-2 w-full">

  <div className="flex w-full max-w-3xl mx-auto gap-2 sm:gap-3 items-center">
    <textarea
      ref={textareaRef}
      value={input}
      disabled={isTyping || limitReached}
      placeholder={
        limitReached
          ? "Free limit reached. Upgrade to continue."
          : isTyping
          ? "AI Videxa is generating..."
          : "Message AI Videxa..."
      }
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (isTyping) return;
          if (input.trim()) sendMessage(input);
        }
      }}
      rows={1}
      className="
        flex-1 bg-white/10 rounded-2xl px-4 py-2.5   /* 👈 lowered */
        focus:outline-none resize-none text-sm sm:text-base
        transition-[height] duration-150 ease-out
      "
    />

    <button
      onClick={() => sendMessage(input)}
      disabled={isTyping || limitReached || !input.trim()}
      className={`
        px-4 sm:px-6 py-2.5 rounded-2xl font-semibold   /* 👈 lowered */
        ${
          isTyping || limitReached || !input.trim()
            ? "bg-white/20 text-black/40 cursor-not-allowed"
            : "bg-white text-black"
        }
      `}
    >
      Send
    </button>
  </div>

  {/* 🔒 INLINE ChatGPT-style disclaimer */}
  <DisclaimerBar />

</div>


        </main>

{/* HELP MODAL — ROOT LEVEL */}
<HelpModal
  isOpen={helpOpen}
  onClose={() => setHelpOpen(false)}
/>

 {/* SIDEBAR */}
<aside
  className={`
    fixed top-0 right-0 z-[999]
    h-screen w-64
    bg-black/40 backdrop-blur-xl blur-fix
    border-l border-white/10
    flex flex-col overflow-hidden
    transition-transform duration-300 ease-out
    ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
  <div className="flex justify-between px-4 py-4 border-b border-white/10">
    <span className="font-semibold">Chats</span>
    <button onClick={() => setSidebarOpen(false)}>✕</button>
  </div>

  {/* TOOLS SECTION */}
<div className="px-4 py-4 space-y-4 border-b border-white/5">

  <button
    onClick={newChat}
    className="w-full bg-white text-black py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-white/20 transition"
  >
    + New Chat
  </button>

  <button
    onClick={() => setAssignmentOpen(true)}
    className="w-full py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
  >
    ✎ Assignment
  </button>

  <button
    onClick={() => setResearchOpen(true)}
    className="w-full py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg"
  >
    🔍 Research
  </button>

  <button
    onClick={() => setPptOpen(true)}
    className="w-full py-2.5 rounded-xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg"
  >
    📊 PPT Mode
  </button>

  <button
  onClick={() => setWritingOpen(true)}
  className="
    w-full py-2.5 rounded-xl font-semibold
    bg-gradient-to-r from-green-600 to-emerald-500
    shadow-lg
  "
>
  ✍ Writing Mode
</button>




  {/* EXTRA SEPARATION BEFORE EXPORT */}
  <div className="pt-2">
    <div className="grid grid-cols-2 gap-3">
      <button
  onClick={() => {
    if (exportLimitReached) {
      alert("Daily export limit reached. Upgrade to continue 🚀");
      return;
    }
    setHandwrittenOpen(true);
  }}

        className="py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
      >
        ✍ Handwritten
      </button>

    <button
  onClick={() => {
    if (exportLimitReached) {
      alert("Daily export limit reached. Upgrade to continue 🚀");
      return;
    }
    setPdfOpen(true);
  }}
        className="py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 transition"
      >
        📄 Normal PDF
      </button>
    </div>
  </div>

</div>

  



  {/* CHAT LIST */}
  <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scroll">
    {pinned.length > 0 && (
      <div>
        <p className="px-3 text-xs uppercase tracking-wider text-gray-400">Pinned</p>

        {pinned.map((chat) => (
          <MemoChatRow
            key={chat.id}
            chat={chat}
            activeChatId={activeChatId}
            setActiveChat={setActiveChat}
            openChatMenu={openChatMenu}
            setOpenChatMenu={setOpenChatMenu}
            chatMenuRef={chatMenuRef}
            togglePin={togglePin}
            renameChat={renameChat}
            deleteChat={deleteChat}
          />
        ))}
      </div>
    )}

    {normal.map((chat) => (
      <MemoChatRow
        key={chat.id}
        chat={chat}
        activeChatId={activeChatId}
        setActiveChat={setActiveChat}
        openChatMenu={openChatMenu}
        setOpenChatMenu={setOpenChatMenu}
        chatMenuRef={chatMenuRef}
        togglePin={togglePin}
        renameChat={renameChat}
        deleteChat={deleteChat}
      />
    ))}
  </div>

  {/* bottom padding for non-congested look */}
  <div className="h-12"></div>
        {/* PROFILE SECTION */}
        <div ref={profileRef} className="border-t border-white/10 p-4 relative">
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex gap-3 p-2 rounded-xl hover:bg-white/10 cursor-pointer"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-xl">
              {currentUser?.displayName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="text-sm font-medium">{currentUser?.displayName || "User"}</p>
<p className="text-xs text-gray-400">{label} Plan</p>
            </div>
          </div>

          {profileOpen && (
            
  <div
    className="
      absolute bottom-24 left-3 w-64 
      rounded-2xl 
      bg-[#0F0F11]/90
      border border-white/10 
      shadow-[0_0_35px_rgba(168,85,247,0.25)]
      p-4 
      backdrop-blur-xl 
      z-50
      transform origin-bottom-left
      animate-profilePopup
    "
  >

              <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)] flex items-center justify-center text-lg font-semibold bg-purple-600/80">

                  {currentUser?.displayName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{currentUser?.displayName || "User"}</span>
                  <span className="text-[11px] text-gray-400">Free Plan</span>
                </div>
              </div>

             


              <button
                onClick={() => {
                  setEditProfileOpen(true);
                  setProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-all duration-200 rounded-lg hover:translate-x-1"

              >
                Edit Profile
              </button>

              <button
  onClick={() => {
    setSettingsOpen(true);
    setProfileOpen(false);
  }}
  className="w-full text-left px-4 py-2 hover:bg-[#252528] rounded-md transition"
>
  Settings
</button>

<button
  onClick={() => {
    setProfileOpen(false);

    // 👉 Redirect to Home pricing section
    router.push("/#pricing");
  }}
  className="
    w-full text-left
    px-4 py-2
    bg-gradient-to-r from-purple-600/20 to-pink-600/20
    hover:from-purple-600/30 hover:to-pink-600/30
    text-purple-300
    rounded-lg
    mt-1
    transition-all duration-200
    hover:translate-x-1
  "
>
  Upgrade Plan
</button>



              <button
                 onClick={handleLogout}
                 className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all duration-200 hover:translate-x-1"
>
                    Logout
                </button>

                
 
<button
  onClick={() => {
    setHelpOpen(true);
    setProfileOpen(false);
  }}
  className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:translate-x-1"
>
  Help
</button>

                

            </div>
          )}
        </div>

      </aside>
    </div>
    
  </>
);
}
