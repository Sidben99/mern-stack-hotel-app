import { z } from "zod";
import { ROLES } from "../../consts/roles";
const userSchema = z.object({
  id: z.string(),
  firstName: z
    .string()
    .min(2, "first name must be at least 2 characters long")
    .max(50, "first name must be at most 50 characters long"),

  lastName: z
    .string()
    .min(2, "last name must be at least 2 characters long")
    .max(50, "last name must be at most 50 characters long"),
  email: z.email("invalid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(20, "password must be at most 20 characters long"),
  role: z.enum(ROLES),
});
type UserType = z.infer<typeof userSchema>;
export { userSchema };
export type { UserType };
