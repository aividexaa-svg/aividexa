"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contextAuth/AuthContext";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue , useSpring} from "framer-motion";


/* =========================================================
   HOME
========================================================= */
export default function Home() {
  const { user, logout } = useAuth();
  const startHref = user ? "/chat" : "/login";
  
  const bgRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);


  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
const [hasSwitchedBilling, setHasSwitchedBilling] = useState(false);

/* ===== FOOTER HORIZON INTERACTION ===== */
const { scrollYProgress } = useScroll();

const horizonScale = useTransform(
  scrollYProgress,
  [0.6, 1],
  isTouch ? [1, 1] : [0.9, 1.08]
);

const horizonOpacity = useTransform(
  scrollYProgress,
  [0.6, 1],
  isTouch ? [0.22, 0.22] : [0.18, 0.32]
);

// Mouse movement (VERY subtle)
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

const horizonX = useTransform(mouseX, [-0.5, 0.5], ["-3%", "3%"]);
const horizonY = useTransform(mouseY, [-0.5, 0.5], ["-2%", "2%"]);

const onFooterMouseMove = (e: React.MouseEvent) => {
  if (isTouch) return; // 🔥 prevent mobile lag

  const rect = e.currentTarget.getBoundingClientRect();
  mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
  mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
};




  /* ===== DETECT TOUCH DEVICE (SAFE) ===== */
useEffect(() => {
  const isMobile =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches);

  setIsTouch(isMobile);
}, []);

  useEffect(() => {
  if (!isTouch) return;

  // Lock scroll motion values on mobile
  mouseX.set(0);
  mouseY.set(0);

}, [isTouch]);


  /* ===== SCROLL DEPTH PARALLAX ===== */
  

  return (
<main className="relative min-h-[100dvh] text-white">

      {/* =====================================================
         PREMIUM ANIMATED BACKGROUND
      ===================================================== */}
<div
  ref={bgRef}
  className="fixed inset-0 -z-10 overflow-hidden noise"
  style={{ pointerEvents: "none" }}
>


        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0A0D12, #10162A, #05070C)",
            backgroundSize: "400% 400%",
            animation: isTouch ? "none" : "gradientMove 30s ease infinite",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            animation: isTouch ? "none" : "gridMove 45s linear infinite",
          }}
        />

        <div
          className="absolute w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[140px] -top-40 -left-40"
          style={{animation: isTouch ? "none" : "floatSlow 35s ease-in-out infinite" }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] -bottom-40 -right-40"
          style={{animation: isTouch ? "none" : "floatSlow 40s ease-in-out infinite" }}
        />
      </div>

      {/* =====================================================
         NAVBAR
      ===================================================== */}
<header className="fixed top-6 left-0 right-0 z-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex justify-between items-center">
      
      <Link href="/" className="flex items-center gap-3">
        <img src="/logo-acadify.png" alt="AI Videxa logo" className="w-8 h-8" />
        <span className="text-lg font-semibold tracking-wide">AI Videxa</span>
      </Link>

      {!user ? (
        <Link href="/login" className="text-sm text-white/80 hover:text-white">
          Login
        </Link>
      ) : (
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      )}
    </div>
  </div>
</header>


      {/* =====================================================
         HERO
      ===================================================== */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 md:pt-32 text-center">

        {/* 🌌 LIVING ACADEMIC CANVAS */}
        <LivingAcademicCanvas />

        <h2 className="text-4xl md:text-6xl font-semibold leading-tight">
          The future of <br />
          <span className="hero-underline bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            academic productivity
          </span>
        </h2>

        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
          AI Videxa helps students generate structured assignments, research,
          and presentations — responsibly and securely.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <MagneticButton href={startHref} isTouch={isTouch}>
            {user ? "Open Dashboard" : "Start Free"}
          </MagneticButton>

          <a
            href="#pricing"
            className="px-8 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 transition active:scale-95"
          >
            Pricing
          </a>
        </div>

        <p className="mt-4 text-sm text-white/50">
          No credit card • Privacy-first • Student safe
        </p>
      </section>
{/* HERO FEATURE STRIP */}
<div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
  <HeroFeature
    icon="⚡"
    title="Fast drafts"
    description="Generate well-structured academic drafts in minutes instead of hours, without compromising clarity."
    isTouch={isTouch}
  />
  <HeroFeature
    icon="🔒"
    title="Privacy-first"
    description="Your inputs and generated content are never sold, shared, or used for training third-party models."
    isTouch={isTouch}
  />
  <HeroFeature
    icon="📘"
    title="Exam-ready structure"
    description="Answers are formatted with introductions, headings, and conclusions that align with exam evaluation patterns."
    isTouch={isTouch}
  />
</div>


      {/* =====================================================
         HOW IT WORKS
      ===================================================== */}
      <Section title="How AI Videxa Works">
        {[
          ["01", "Enter your task", "Topic, subject, and requirements."],
          ["02", "AI structures it", "Clean, academic, exam-ready output."],
          ["03", "Learn & submit", "Edit, understand, finalize confidently."]
        ].map(([step, title, desc]) => (
          <TiltCard key={title} isTouch={isTouch}>
            <div className="text-cyan-400 text-sm font-medium">
              STEP {step}
            </div>
            <h4 className="mt-2 font-semibold">{title}</h4>
            <p className="mt-2 text-sm text-white/70">{desc}</p>
          </TiltCard>
        ))}
      </Section>

     {/* =====================================================
     FEATURES
===================================================== */}

<Section title="What Works Quietly in the Background">


  

  {/* ───────── TOP ROW ───────── */}
  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    {[
      {
        title: "Academic Structuring Engine",
        desc:
          "Automatically applies exam-oriented structure with proper introductions, logical subheadings, and clean conclusions — aligned with real academic evaluation patterns.",
      },
      {
        title: "Ethical Safeguards",
        desc:
          "Designed to support understanding and revision, not blind submission. Encourages learning, review, and personal refinement before final use.",
      },
    ].map((item, i) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <TiltCard isTouch={isTouch}>

          {/* GLOW */}
          <span
            className="
              glow pointer-events-none
              absolute inset-0 rounded-2xl
              opacity-0 transition-opacity duration-300
              bg-gradient-to-br
              from-cyan-400/25
              via-transparent
              to-indigo-500/25
            "
          />

          <div className="relative min-h-[190px] flex flex-col justify-between">
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>

        </TiltCard>
      </motion.div>
    ))}
  </div>

  {/* ───────── CENTER HERO ───────── */}
  <motion.div
    className="md:col-span-3"
    initial={{ opacity: 0, scale: 0.99 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    <div
      className="
        relative
        backdrop-blur-xl bg-white/5 border border-white/10
        rounded-2xl p-8
        transition-all duration-300 ease-out

        hover:border-cyan-400/60
        hover:bg-white/[0.12]
        hover:shadow-[0_0_70px_rgba(56,189,248,0.35)]

        hover:[&_.glow]:opacity-100
      "
    >
      {/* CENTER GLOW */}
      <span
        className="
          glow pointer-events-none
          absolute inset-0 rounded-2xl
          opacity-0 transition-opacity duration-300
          bg-gradient-to-br
          from-cyan-400/20
          via-transparent
          to-indigo-500/20
        "
      />

      <h4 className="font-medium text-center mb-8 tracking-wide">
        Quality Validation Layer
      </h4>

      <ul className="space-y-3 text-sm text-white/70">
        <li className="flex justify-start">
          <span className="flex items-center gap-2">
            <span className="text-cyan-300/80">✓</span>
            <span>Proper academic introduction</span>
          </span>
        </li>

        <li className="flex justify-end text-right">
          <span className="flex items-center gap-2">
            <span>Clear and logical subheadings</span>
            <span className="text-cyan-300/80">✓</span>
          </span>
        </li>

        <li className="flex justify-start">
          <span className="flex items-center gap-2">
            <span className="text-cyan-300/80">✓</span>
            <span>Exam-appropriate answer length</span>
          </span>
        </li>

        <li className="flex justify-end text-right">
          <span className="flex items-center gap-2">
            <span>Consistent academic tone</span>
            <span className="text-cyan-300/80">✓</span>
          </span>
        </li>

        <li className="flex justify-start">
          <span className="flex items-center gap-2">
            <span className="text-cyan-300/80">✓</span>
            <span>Ethical and plagiarism-safe structure</span>
          </span>
        </li>

        <li className="flex justify-end text-right">
          <span className="flex items-center gap-2">
            <span>Submission-ready formatting</span>
            <span className="text-cyan-300/80">✓</span>
          </span>
        </li>
      </ul>

      <p className="mt-8 text-xs text-white/50 text-center">
        Final review always stays in the student’s control.
      </p>
    </div>
  </motion.div>

  {/* ───────── BOTTOM ROW ───────── */}
  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
    {[
      {
        title: "Clarity Optimization",
        desc:
          "Refines language, spacing, and academic tone so answers remain calm, readable, and submission-ready.",
      },
      {
        title: "Submission Readiness",
        desc:
          "Ensures formatting and presentation meet real academic submission expectations across assignments and exams.",
      },
    ].map((item, i) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: i * 0.1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <TiltCard isTouch={isTouch}>

          {/* GLOW */}
          <span
            className="
              glow pointer-events-none
              absolute inset-0 rounded-2xl
              opacity-0 transition-opacity duration-300
              bg-gradient-to-br
              from-cyan-400/25
              via-transparent
              to-indigo-500/25
            "
          />

          <div className="relative min-h-[190px] flex flex-col justify-between">
            <div>
              <h4 className="font-medium">{item.title}</h4>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>

        </TiltCard>
      </motion.div>
    ))}
  </div>

</Section>




      {/* =====================================================
         TRUST
      ===================================================== */}
      <section className="mt-28 md:mt-36 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          {[
            ["Privacy protected", "Your data is never sold or shared"],
            ["Secure by default", "Modern auth & encryption"],
            ["Student focused", "Designed for real academic needs"]
          ].map(([title, desc]) => (
            <div key={title}>
              <h4 className="font-semibold">{title}</h4>
              <p className="mt-2 text-sm text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
   PRICING
===================================================== */}
<section id="pricing" className="mt-32 md:mt-40 max-w-6xl mx-auto px-6">
  <h3 className="text-2xl font-semibold text-center">
    Simple Pricing
  </h3>

  {/* BILLING TOGGLE */}
  <div className="mt-6 flex justify-center">
  <div className="relative grid grid-cols-2 w-[220px] p-1 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
    
    {/* SLIDING PILL */}
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={`
        absolute top-1 bottom-1 w-[calc(50%-4px)]
        rounded-lg bg-white
        ${billing === "monthly" ? "left-1" : "left-[calc(50%+1px)]"}
      `}
    />

    {/* MONTHLY */}
    <button
      onClick={() => {
        setBilling("monthly");
        setHasSwitchedBilling(true);
      }}
      className={`relative z-10 py-2 text-sm font-medium transition-colors ${
        billing === "monthly"
          ? "text-black"
          : "text-white/70 hover:text-white"
      }`}
    >
      Monthly
    </button>

    {/* YEARLY */}
    <button
      onClick={() => {
        setBilling("yearly");
        setHasSwitchedBilling(true);
      }}
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


  {/* PRICING CARDS */}
  <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

    <PriceCard
  title="Free"
  price="₹0"
  features={[
    "5 chats per day",
    "Basic Assignment tool",
    "Basic Research tool",
    "Basic PPT generator (up to 6 slides)",
    "PDF export with watermark",
    "Handwritten notes with watermark",
    "Limited daily exports",
  ]}
  action="Start Free"
  href={startHref}
/>

  <PriceCard
  title="Student+"
  highlight
  price={billing === "monthly" ? "₹299 / month" : "₹2,499 / year"}
  badge={billing === "yearly" ? "Save 30%" : undefined}
  hasSwitchedBilling={hasSwitchedBilling}
  currentPlan={user?.plan} // 🔥 ADD THIS
  planKey="student_plus"   // 🔥 ADD THIS
  features={[
    "100 chats per day",
    "Advanced Assignment tool",
    "Advanced Research mode",
    "Advanced PPT generator",
    "PDF export without watermark",
    "Handwritten notes (clean export)",
    "Higher daily export limits",
    "Faster AI responses",
  ]}
  action="Upgrade"
  href={
    user
      ? `/checkout?plan=student_plus`
      : `/login`
  }
/>





 <PriceCard
  title="Pro"
  price={billing === "monthly" ? "₹599 / month" : "₹4,999 / year"}
  badge={billing === "yearly" ? "Best value" : undefined}
  hasSwitchedBilling={hasSwitchedBilling}
  currentPlan={user?.plan} // 🔥 ADD THIS
  planKey="pro"            // 🔥 ADD THIS
  features={[
    "Unlimited chats",
    "Unlimited Assignment generation",
    "Unlimited Research & PPT tools",
    "Priority AI processing",
    "Unlimited PDF & handwritten exports",
    "No watermark on any export",
    "Early access to new tools",
  ]}
  action="Upgrade"
  href={
    user
      ? `/checkout?plan=pro`
      : `/login`
  }
/>

  </div>
</section>

{/* =====================================================
   AI Videxa FEATURES ENGINE
===================================================== */}
<section className="mt-40 max-w-7xl mx-auto px-6">
  <h3 className="text-3xl font-semibold text-center mb-20">
    Everything You Need for Academics
  </h3>

<div className="relative flex flex-col lg:flex-row items-center justify-center gap-20">

  
{/* LEFT CONNECTOR RAIL */}
<div className="hidden lg:block absolute left-1/2 -translate-x-[130px] top-0 h-full w-px overflow-hidden">
  {/* static rail */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

  {/* vertical energy */}
<span
  className="
    absolute top-1/2 left-0
    w-px h-24
    bg-cyan-300/80 blur-[2px]
    animate-rail-down
    -translate-y-1/2
  "
/>

  {/* center-bound pulse */}
<span className="
  absolute top-1/2 left-0
  h-px w-24
  bg-gradient-to-r from-cyan-300 via-cyan-300/80 to-transparent
  blur-sm
  animate-to-center-left
  delay-[1200ms]
" />
  {/* CARD HIT BURST */}
<span className="
  absolute top-1/2 left-0
  w-2 h-2 rounded-full
  bg-cyan-300 blur-md
  animate-rail-hit
" />

</div>

  {/* RIGHT CONNECTOR RAIL */}
<div className="hidden lg:block absolute left-1/2 translate-x-[130px] top-0 h-full w-px overflow-hidden">
  {/* static rail */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

  {/* vertical energy */}
<span
  className="
    absolute top-1/2 left-0
    w-px h-24
    bg-cyan-300/80 blur-[2px]
    animate-rail-down
    -translate-y-1/2
  "
/>

  {/* center-bound pulse */}
<span className="
  absolute top-1/2 right-0
  h-px w-24
  bg-gradient-to-l from-cyan-300 via-cyan-300/80 to-transparent
  blur-sm
  animate-to-center-right
  delay-[1200ms]
" />

  <span className="
  absolute top-1/2 right-0
  w-2 h-2 rounded-full
  bg-cyan-300 blur-md
  animate-rail-hit
" />

</div>

    {/* LEFT FEATURES */}
    <div className="flex flex-col gap-6">
      <EngineCard
  side="left"
  title="Assignments"
  tag="Core Feature"
  desc="Generate structured, exam-ready assignments with proper introductions, headings, and conclusions."
/>

<EngineCard
  side="left"
  title="Deep Research"
  tag="In-depth"
  desc="Detailed research with concepts, explanations, and examples for serious academic work."
/>

<EngineCard
  side="left"
  title="Handwritten Notes"
  tag="Unique"
  desc="Convert content into realistic handwritten-style notes for submissions."
/>

    </div>

    {/* CENTER CORE */}
<div className="relative flex items-center justify-center">

  {/* CENTER ABSORPTION RIPPLE */}
  <span
    className="
      absolute
      w-44 h-44
      rounded-full
      border border-cyan-400/40
      animate-center-ripple
      pointer-events-none
    "
  />

  {/* CENTER GLOW PULSE */}
  <span
    className="
      absolute
      w-52 h-52
      rounded-full
      bg-cyan-400/20
      blur-2xl
      animate-center-glow
      pointer-events-none
    "
  />
<div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/40 to-indigo-500/40 blur-[90px] absolute animate-pulse" />
      <div className="w-44 h-44 rounded-full bg-[#0E1320] border border-white/20 flex items-center justify-center text-center z-10">
        <div>
          <p className="text-lg font-semibold">AI Videxa</p>
          <p className="text-sm text-white/60 mt-1">Academic Engine</p>
        </div>
      </div>
    </div>

    {/* RIGHT FEATURES */}
    <div className="flex flex-col gap-6">
      <EngineCard
  side="right"
  title="PPT Generator"
  tag="Presentations"
  desc="Create clean, topic-wise presentation slides with proper flow."
/>

<EngineCard
  side="right"
  title="Text to PDF"
  tag="Export"
  desc="Convert generated content into clean, submission-ready PDFs."
/>

<EngineCard
  side="right"
  title="Smart Formatting"
  tag="Automatic"
  desc="Automatically applies academic formatting, spacing, and readability standards."
/>

    </div>

  </div>
</section>

{/* =====================================================
   FAQ
===================================================== */}
<section className="mt-40 max-w-5xl mx-auto px-6">
  <h3 className="text-3xl font-semibold text-center mb-16">
    Frequently Asked Questions
  </h3>

  <div className="space-y-4">
    <FAQItem
      q="Is AI Videxa safe for students?"
      a="Yes. AI Videxa is designed to support learning, not replace it. All outputs are structured for understanding and revision, not direct submission."
    />

    <FAQItem
      q="Does AI Videxa store or sell my data?"
      a="No. Your inputs and generated content are private. We do not sell, share, or use your data to train third-party models."
    />

    <FAQItem
      q="Can I use AI Videxa for exams and assignments?"
      a="AI Videxa helps you prepare drafts, structure answers, and understand topics. Always review and personalize before submission."
    />

    <FAQItem
      q="What formats does AI Videxa support?"
      a="Assignments, research content, PPT outlines, and PDF-ready structured text — all optimized for academic use."
    />

    <FAQItem
      q="Is there a free plan?"
      a="Yes. You can start for free with limited daily usage. Paid plans unlock higher limits and advanced tools."
    />
  </div>
</section>



{/* =====================================================
   GLOBAL ACADEMIC EXPLAINER
===================================================== */}
<section className="mt-40 max-w-6xl mx-auto px-6">
  <h3 className="text-3xl font-semibold text-center mb-6">
    AI Videxa for Students Worldwide
  </h3>

  <p className="text-center text-white/60 max-w-3xl mx-auto mb-16">
    Designed to support modern academic systems across countries,
    syllabi, and learning styles.
  </p>

  <MultilingualVidexaInfo />

</section>





{/* =====================================================
   PREMIUM CTA FOOTER (AI Videxa STYLE)
===================================================== */}
<footer
  className="relative mt-40 overflow-hidden"
  onMouseMove={onFooterMouseMove}
>

  {/* HORIZON GLOW (SCROLL + MOUSE REACTIVE) */}
  <motion.div
    style={{
      scale: horizonScale,
      opacity: horizonOpacity,
      x: horizonX,
      y: horizonY,
    }}
    className="
      absolute inset-x-0 top-0 h-[420px]
      pointer-events-none
      bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.25),transparent_70%)]
    "
  />

  {/* HORIZON LINE */}
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

  {/* MAIN CTA */}
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
    viewport={{ once: true }}
    className="relative max-w-4xl mx-auto px-6 py-32 text-center"
  >
    {/* PREMIUM LIGHT SWEEP */}
<motion.span
  className="
    pointer-events-none
    absolute inset-0
    bg-gradient-to-br
    from-cyan-400/25
    via-transparent
    to-indigo-500/25
    opacity-0
  "
  whileHover={{ opacity: 1 }}
  transition={{ duration: 0.35, ease: "easeOut" }}
/>

    <h3 className="text-3xl md:text-4xl font-semibold leading-tight">
      Ready to study <br />
      <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
        smarter & more confidently?
      </span>
    </h3>

    <p className="mt-6 text-white/70 max-w-xl mx-auto">
      AI Videxa helps you structure assignments, research, and presentations
      with clarity — while keeping learning in your control.
    </p>

   {/* BUTTON */}
<motion.div
  initial={{ opacity: 0, y: 14 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
  viewport={{ once: true }}
  className="relative mt-10 flex justify-center"
>
  {/* MICRO GLOW PULSE */}
  <motion.span
    className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-xl -z-10"
    animate={{
      opacity: [0, 0.35, 0],
      scale: [0.85, 1.15, 0.85],
    }}
    transition={{
      duration: 2.2,
      repeat: Infinity,
      repeatDelay: 6,
      ease: "easeInOut",
    }}
  />

  {/* MAGNETIC BUTTON */}
  <MagneticCTA href={startHref}>
    Get Started
  </MagneticCTA>
</motion.div>
   

    <p className="mt-4 text-sm text-white/50">
      Privacy-first • Student-safe • Ethical AI
    </p>
  </motion.div>

  {/* BOTTOM BAR */}
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
    viewport={{ once: true }}
    className="relative border-t border-white/10"
  >
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
     <div className="flex items-center gap-2">
  <img
    src="/logo-acadify.png"
    alt="AI Videxa logo"
    className="w-8 h-8"
  />
  <span>AI Videxa</span>
</div>


      <div className="flex gap-6">
        <Link href="/privacy" className="hover:text-white">Privacy</Link>
        <Link href="/terms" className="hover:text-white">Terms</Link>
        <Link href="/contact" className="hover:text-white">Contact</Link>
      </div>

      <div className="text-xs">
        © {new Date().getFullYear()} AI Videxa. All rights reserved.
      </div>
    </div>
  </motion.div>
</footer>


    </main>
  );
}

/* =========================================================
   LIVING ACADEMIC CANVAS
========================================================= */
function LivingAcademicCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute left-[12%] top-0 h-full w-px bg-white/10" />

      <div className="absolute top-[20%] left-[18%] w-[60%] h-16 academic-block delay-1" />
      <div className="absolute top-[34%] left-[18%] w-[52%] h-14 academic-block delay-2" />
      <div className="absolute top-[48%] left-[18%] w-[58%] h-14 academic-block delay-3" />

      <div className="absolute top-[64%] left-[20%] flex flex-col gap-4">
        <div className="academic-bullet delay-2" />
        <div className="academic-bullet delay-3" />
        <div className="academic-bullet delay-4" />
      </div>
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function Section({ title, children }: any) {
  return (
    <section className="mt-28 md:mt-36 max-w-6xl mx-auto px-6">
      <h3 className="text-2xl font-semibold text-center">{title}</h3>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {children}
      </div>
    </section>
  );
}

function TiltCard({ children, isTouch }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || isTouch) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width) - 0.5) * 8;
    ref.current.style.transform =
      `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "scale(1)";
  };

 return (
  <div
    ref={ref}
    onMouseMove={onMove}
    onMouseLeave={onLeave}
    className="
      relative
      backdrop-blur-xl bg-white/5 border border-white/10
      rounded-2xl p-6
      transition-all duration-300 ease-out
      will-change-transform

      hover:border-cyan-400/60
      hover:bg-white/[0.12]
      hover:shadow-[0_0_60px_rgba(56,189,248,0.35)]

      hover:[&_.glow]:opacity-100
    "
    style={{ transformStyle: 'preserve-3d' }}
  >
    {children}
  </div>
);

}

function MagneticButton({ href, children, isTouch }: any) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || isTouch) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <Link
      href={href}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-indigo-500 text-black transition-transform duration-300 active:scale-95 active:brightness-110"
    >
      {children}
    </Link>
  );
}

function PriceCard({
  title,
  price,
  features,
  action,
  href,
  highlight,
  badge,
  hasSwitchedBilling,
  currentPlan,
  planKey,
}: any) {
const isCurrentPlan = currentPlan === planKey;
  return (
    
     <motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  whileHover={{ y: -8 }}
  className={`relative backdrop-blur-xl rounded-2xl p-6 text-center border  ${
    highlight
      ? "bg-white/15 border-cyan-400/40"
      : "bg-white/5 border-white/10"
  }`}
>

      {/* BADGE */}
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs rounded-full bg-cyan-400 text-black font-medium">
          {badge}
        </span>
      )}

      {highlight && (
  <motion.span
    className="
      absolute -inset-px rounded-2xl
      border border-cyan-400/50
      pointer-events-none
    "
    animate={{ opacity: [0.25, 0.6, 0.25] }}
    transition={{
      duration: 2.8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
)}


      <h4 className="font-semibold">{title}</h4>
<div className="mt-2 h-[36px] flex justify-center items-center overflow-hidden">
  {hasSwitchedBilling ? (
    <AnimatePresence mode="wait">
      <motion.p
        key={price}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="text-2xl font-semibold"
      >
        {price}
      </motion.p>
    </AnimatePresence>
  ) : (
    <p className="text-2xl font-semibold">{price}</p>
  )}
</div>


    <div className="my-5 h-px bg-white/10" />

     
     <div className="mt-6 text-left">
  <p className="text-sm font-semibold text-white mb-3">
    What’s included:
  </p>

  <ul className="space-y-2 text-sm text-white/70">
    {features.map((f: string, i: number) => (
  <motion.li
    key={f}
    initial={{ opacity: 0, x: -6 }}
    whileInView={{ opacity: 1, x: 0 }}
    whileHover={{ x: 4 }}
    viewport={{ once: true }}
    transition={{
      delay: 0.05 * i,
      duration: 0.35,
      ease: "easeOut",
    }}
    className="flex items-start gap-2" >

        <span className="text-orange-400 mt-[2px]">✔</span>
        <span>{f}</span>
      </motion.li>
    ))}
  </ul>
</div>


      {isCurrentPlan ? (
  <div className="mt-6 px-6 py-2 rounded-lg bg-white/10 text-white/60 text-sm font-medium cursor-default">
    Current Plan
  </div>
) : href ? (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.96 }}
    className="mt-6"
  >
    <Link
      href={href}
      className="inline-block px-6 py-2 rounded-lg bg-white text-black font-medium"
    >
      {action}
    </Link>
  </motion.div>
) : (
  <button className="mt-6 px-6 py-2 rounded-lg border border-white/20 text-white/60 cursor-not-allowed">
    {action}
  </button>
)}

    </motion.div>
  );
}

function HeroFeature({
  icon,
  title,
  description,
  isTouch,
}: {
  icon: string;
  title: string;
  description: string;
  isTouch: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside tap (mobile) */
  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => !isTouch && setOpen(true)}
      onMouseLeave={() => !isTouch && setOpen(false)}
      onClick={() => isTouch && setOpen(v => !v)}
    >
      {/* FEATURE CHIP */}
      <div
        className="
          flex items-center justify-center gap-2 text-sm text-white/70
          backdrop-blur-md bg-white/5 border border-white/10
          rounded-xl py-3 cursor-default
          transition-transform duration-200
          hover:scale-[1.03]
          active:scale-95
        "
      >
        <span>{icon}</span>
        <span>{title}</span>
      </div>

      {/* TOOLTIP */}
      {open && (
        <div
          className="
            absolute left-1/2 -translate-x-1/2 mt-3 w-72 z-50
            backdrop-blur-xl bg-[#0E1320]/90
            border border-white/10 rounded-xl p-4
            text-sm text-white/80
            shadow-xl
            animate-fadeIn
          "
        >
          {description}

          {/* Tooltip arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0E1320]/90 border-l border-t border-white/10 rotate-45" />
        </div>
      )}
    </div>
  );
}
function EngineCard({
  title,
  tag,
  desc,
  side,
}: {
  title: string;
  tag: string;
  desc: string;
  side: "left" | "right";
}) {
 return (
  <div
    className="
      relative group
      w-80 h-44
      flex flex-col justify-center
      backdrop-blur-xl bg-white/5 border border-white/10
      rounded-2xl p-6
      transition-all duration-300
      hover:scale-[1.04]
      hover:border-cyan-400/40
      hover:shadow-[0_0_35px_rgba(34,211,238,0.2)]
    "
  >
   {/* CONNECTOR LINE */}
<div
  className={`
    absolute top-1/2 hidden lg:block h-px w-24 overflow-hidden
    ${side === "left"
      ? "right-0 translate-x-full bg-gradient-to-r"
      : "left-0 -translate-x-full bg-gradient-to-l"}
    from-cyan-400/40 to-transparent
  `}
>

  

  {/* ENERGY FLOW */}
 <span
  className={`
    absolute top-0 h-px w-8
    ${side === "left" ? "left-0 animate-energy-left" : "right-0 animate-energy-right"}
    bg-gradient-to-r from-transparent via-cyan-300 to-transparent
  `}
/>


</div>



    <div className="text-sm text-cyan-400 mb-1">{tag}</div>
    <h4 className="font-semibold">{title}</h4>
    <p className="mt-2 text-sm text-white/70">{desc}</p>
  </div>
);

}
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10
        rounded-2xl p-6 cursor-pointer
        transition-all duration-300
        ${open ? "border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.15)]" : ""}
      `}
      onClick={() => setOpen(v => !v)}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-white">{q}</h4>

        <span
          className={`
            ml-4 text-cyan-300 transition-transform duration-300
            ${open ? "rotate-45" : "rotate-0"}
          `}
        >
          +
        </span>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300
          ${open ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <p className="text-sm text-white/70 leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}



function MultilingualVidexaInfo() {

const content = [
  {
    lang: "English · Global",
    region: "USA · UK · International",
    text: `
AI Videxa is an AI-powered academic productivity platform built for students.

It helps you:
• Create structured assignments with clear introductions and conclusions
• Prepare research content with proper academic flow
• Generate presentation-ready outlines
• Convert content into clean, submission-ready PDFs
• Maintain ethical academic standards

AI Videxa is designed to support learning and understanding,
not to replace genuine student effort.
    `,
  },

  {
    lang: "हिन्दी · भारत",
    region: "CBSE · ICSE · विश्वविद्यालय",
    text: `
AI Videxa छात्रों के लिए बनाया गया एक AI आधारित अकादमिक सहायक है।

इसकी मदद से आप:
• सही प्रारूप में असाइनमेंट तैयार कर सकते हैं
• विषयों को गहराई से समझ सकते हैं
• परीक्षा के लिए संरचित उत्तर बना सकते हैं
• PPT और PDF के लिए साफ़ कंटेंट तैयार कर सकते हैं

AI Videxa सीखने को मजबूत बनाता है,
न कि नकल को बढ़ावा देता है।
    `,
  },

  {
    lang: "Hinglish · India",
    region: "Colleges · Competitive Exams",
    text: `
AI Videxa ek smart academic tool hai jo students ko better padhne mein help karta hai.

Isse aap:
• Assignments ko proper exam format mein bana sakte ho
• Research topics ko clearly samajh sakte ho
• PPT aur notes ke liye structured content paa sakte ho
• Handwritten-style notes generate kar sakte ho

AI Videxa ka focus learning aur understanding pe hai,
shortcuts pe nahi.
    `,
  },

  {
    lang: "中文 · 中国",
    region: "大学 · 学术研究",
    text: `
AI Videxa 是一款为学生设计的人工智能学术辅助平台。

它可以帮助你：
• 编写结构清晰的作业
• 理解复杂的学术概念
• 准备研究型内容
• 生成适合提交的文档和演示结构
• 遵守学术诚信原则

AI Videxa 的目标是辅助学习，
而不是替代学生的思考过程。
    `,
  },

  {
    lang: "日本語 · 日本",
    region: "大学 · 専門教育",
    text: `
AI Videxa は学生向けに設計された学習支援AIツールです。

主な機能：
• 論理的で整理されたレポート作成
• 学術的な内容理解の補助
• プレゼンテーション構成の作成
• 学習用ノートや資料の整理

AI Videxa は学習の質を高めるためのツールであり、
提出の代行ではありません。
    `,
  },

  {
    lang: "Deutsch · Europa",
    region: "Universitäten · Forschung",
    text: `
AI Videxa ist eine KI-gestützte Plattform zur akademischen Unterstützung.

Sie hilft Studierenden bei:
• Strukturierter Erstellung von Hausarbeiten
• Wissenschaftlicher Recherche und Argumentation
• Vorbereitung von Präsentationen
• Einhaltung akademischer Standards

AI Videxa unterstützt den Lernprozess
und fördert eigenständiges Denken.
    `,
  },

  {
    lang: "한국어 · 대한민국",
    region: "대학교 · 시험 준비",
    text: `
AI Videxa는 학생을 위한 AI 기반 학습 지원 도구입니다.

주요 기능:
• 체계적인 과제 및 답안 구성
• 개념 이해를 돕는 설명
• 시험 및 발표 준비용 구조 제공
• 학문적 윤리와 독창성 유지

AI Videxa는 학습을 돕는 도구이며,
과제를 대신 수행하지 않습니다.
    `,
  },
];


  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % content.length);
    }, 7000); // slower = premium feel

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        key={index}
        className="
          backdrop-blur-xl bg-white/5 border border-white/10
          rounded-3xl p-8 md:p-10
          text-white/80 leading-relaxed
          animate-langSwap
        "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-cyan-300 tracking-wide">
            {content[index].lang}
          </div>
          <div className="text-xs text-white/50">
            {content[index].region}
          </div>
        </div>

        <pre className="whitespace-pre-wrap text-sm md:text-base font-sans">
          {content[index].text}
        </pre>
      </div>
    </div>
  );
}



function MagneticCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs (premium feel)
  const springX = useSpring(x, { stiffness: 160, damping: 18 });
  const springY = useSpring(y, { stiffness: 160, damping: 18 });

  const springRotateX = useSpring(rotateX, { stiffness: 160, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 160, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - (rect.left + rect.width / 2);
    const py = e.clientY - (rect.top + rect.height / 2);

    // Magnetic movement (subtle)
    x.set(px * 0.12);
    y.set(py * 0.12);

    // 3D tilt (VERY subtle)
    rotateX.set((-py / rect.height) * 6); // up/down tilt
    rotateY.set((px / rect.width) * 6);   // left/right tilt
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 900,
      }}
    >
      <Link
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="
          relative
          inline-flex
          px-10 py-3
          rounded-xl
          font-medium
          bg-gradient-to-r from-cyan-500 to-indigo-500
          text-black
          transition-all duration-300
          hover:brightness-110
          active:scale-95
          will-change-transform
        "
      >
        {children}
      </Link>
    </motion.div>
  );
}
