import { z } from "zod";
import { userSchema } from "../user/schema";
export const forgetPasswordSchema = userSchema.pick({
  email: true,
});

export type ForgetPassword = z.infer<typeof forgetPasswordSchema>;
