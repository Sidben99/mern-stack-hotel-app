import z from "zod";
import { userSchema } from "./schema";
export const resetPasswordTokenSchema = z.object({
  token: z.string(),
});
export const resetPasswordDataSchema = userSchema.pick({
  password: true,
});
export const resetPasswordNewPasswordSchema = userSchema
  .pick({
    password: true,
  })
  .extend({
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "passwords don't match",
      path: ["confirmPassword"],
    },
  );
export type ResetPasswordTokenType = z.infer<typeof resetPasswordTokenSchema>;
export type ResetPasswordDataType = z.infer<typeof resetPasswordDataSchema>;
export type ResetPasswordNewPasswordType = z.infer<
  typeof resetPasswordNewPasswordSchema
>;
