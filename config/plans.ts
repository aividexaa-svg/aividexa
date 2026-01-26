
export type PlanType =
  | "free"
  | "student_plus"
  | "student_pro";

export const PLAN_LIMITS = {
  free: {
    label: "Free",
    messagesPerDay: 5,
    exportsPerDay: 2,
    advanced: false,
    priorityAI: false,
  },

  student_plus: {
    label: "Student+",
    messagesPerDay: 100,
    exportsPerDay: 20,
    advanced: true,
    priorityAI: false,
  },

  student_pro: {
    label: "Student Pro",
    messagesPerDay: 100, // 🚨 NO Infinity
    exportsPerDay: Infinity,
    advanced: true,
    priorityAI: true,
  },
} as const;
