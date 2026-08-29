export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  OWNER: "owner",
} as const;

export type ROLES = (typeof ROLES)[keyof typeof ROLES];
