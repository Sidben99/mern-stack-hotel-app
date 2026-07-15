export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type ROLES = (typeof ROLES)[keyof typeof ROLES];
