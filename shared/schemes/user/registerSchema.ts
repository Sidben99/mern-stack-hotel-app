import { z } from "zod";
import { userSchema } from "./schema";
const registerSchema = userSchema
  .omit({ id: true, role: true })
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
type RegisterType = z.infer<typeof registerSchema>;
export { registerSchema, RegisterType };
