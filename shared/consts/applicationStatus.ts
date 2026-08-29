import { ADMIN_STATUS } from "./adminStatus";
export const APPLICATION_STATUS = {
  ...ADMIN_STATUS,
  CANCELLED: "cancelled",
} as const;

export type APPLICATION_STATUS_TYPE =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];
