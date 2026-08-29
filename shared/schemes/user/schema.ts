import { z } from "zod";
import { ROLES } from "../../consts/roles";
import { countriesCodes } from "../../consts/countries";
import { isValidPhoneNumber } from "libphonenumber-js";
import { ownerInfoSchema } from "../owner/ownerInfoSchema";
const userSchema = z.object({
  username: z
    .string()
    .min(2, "username must be at least 2 characters long")
    .max(50, "username must be at most 50 characters long"),
  email: z.email("invalid email address"),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(20, "password must be at most 20 characters long"),
  role: z.literal(ROLES.USER),
  phoneNumber: z
    .string("phone number is required")
    .refine(isValidPhoneNumber, { error: "invalid phone number" }),
  nationality: z.enum(countriesCodes, {
    error: "invalid country code",
  }),
  avatar: z.string(),
  ownerInfo: ownerInfoSchema.optional(),
});
type UserType = z.infer<typeof userSchema>;
export { userSchema };
export type { UserType };
