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
    confirmPassword: z
      .string()
      .min(6, "confirm password must be at least 6 characters long")
      .max(20, "confirm password must be at most 20 characters long"),
  })
  .refine(
    (data) => {
      console.log("password : ", data.password);
      console.log("confirmPassword : ", data.confirmPassword);
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
