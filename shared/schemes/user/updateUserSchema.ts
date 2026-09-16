import { z } from "zod";
import { userSchema } from "./schema";
export const updateUserSchema = userSchema
  .omit({
    password: true,
    avatar: true,
    role: true,
    ownerInfo: true,
  })
  .partial();

export type UpdateUserType = z.infer<typeof updateUserSchema>;