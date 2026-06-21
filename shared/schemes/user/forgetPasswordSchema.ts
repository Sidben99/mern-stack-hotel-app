import { z } from "zod";
import { userSchema } from "./schema";
export const forgetPasswordSchema = userSchema.pick({
  email: true,
});

export type ForgetPassword = z.infer<typeof forgetPasswordSchema>;
