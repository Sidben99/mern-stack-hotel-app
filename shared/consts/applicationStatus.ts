export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;

export type APPLICATION_STATUS_TYPE =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];