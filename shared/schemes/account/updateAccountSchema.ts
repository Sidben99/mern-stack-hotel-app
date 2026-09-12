import { z } from "zod";
import { userSchema } from "../user/schema";
export const updateAccount = userSchema
  .omit({
    password: true,
    avatar: true,
    role: true,
    ownerInfo: true,
  })
  .partial();

export type UpdateAccountType = z.infer<typeof updateAccount>;