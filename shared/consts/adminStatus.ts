export const ADMIN_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type ADMIN_STATUS_TYPE =
  (typeof ADMIN_STATUS)[keyof typeof ADMIN_STATUS];
