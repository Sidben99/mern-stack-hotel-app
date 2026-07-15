import { z } from "zod";
import { userSchema } from "./schema";
const registerSchema = userSchema
  .omit({ id: true, role: true })
  .extend({
    confirmPassword: z.string(),
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
export { registerSchema };
export type { RegisterType };
