import { z } from "zod";
import { userSchema } from "./schema";
const registerSchema = userSchema
  .omit({ role: true, avatar: true, ownerInfo: true })
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
type RegisterType = z.infer<typeof registerSchema>;
export { registerSchema };
export type { RegisterType };
