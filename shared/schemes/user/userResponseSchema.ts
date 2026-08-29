import { z } from "zod";
import { userSchema } from "./schema";
export const userResponseSchema = userSchema.omit({ password: true }).extend({
  id: z.string(),
});
type UserResponseType = z.infer<typeof userResponseSchema>;
export type { UserResponseType };
