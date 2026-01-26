// hooks/usePlan.ts

type PlanKey = "free" | "student_plus" | "student_pro";

const PLAN_CONFIG: Record<
  PlanKey,
  {
    label: string;
    messagesPerDay: number;
    exportsPerDay: number;
    advanced: boolean;
  }
> = {
  free: {
    label: "Free",
    messagesPerDay: 5,     // ✅ FIXED
    exportsPerDay: 2,
    advanced: false,
  },
  student_plus: {
    label: "Student+",
    messagesPerDay: 100,    // ✅ FIXED
    exportsPerDay: 20,
    advanced: true,
  },
  student_pro: {
    label: "Student Pro",
    messagesPerDay: 100,    // ✅ FIXED (NO Infinity)
    exportsPerDay: Infinity, // ✅ exports CAN be unlimited
    advanced: true,
  },
};

export function usePlan(user: any) {
  const current: PlanKey =
    user?.plan && user.plan in PLAN_CONFIG ? user.plan : "free";

  const config = PLAN_CONFIG[current];

  return {
    // Plan flags
    isFree: current === "free",
    isStudentPlus: current === "student_plus",
    isPro: current === "student_pro",

    // Capabilities
    canUseAdvanced: config.advanced,

    // ✅ ADD THIS BACK (exports only)
    hasUnlimited: config.exportsPerDay === Infinity,


    // Limits (UI only – backend is enforced separately)
    messageLimit: config.messagesPerDay,
    exportLimit: config.exportsPerDay,

    // Labels
    label: config.label,
  };
}
