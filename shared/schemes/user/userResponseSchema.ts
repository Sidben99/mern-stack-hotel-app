import { z } from "zod";
import { userSchema } from "./schema";
const userResponseSchema = userSchema
  .omit({ password: true })
  .extend({ avatar: z.string() });
type UserResponseType = z.infer<typeof userResponseSchema>;
export { userResponseSchema };
export type { UserResponseType };
