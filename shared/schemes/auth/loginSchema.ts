import { z } from "zod";
import { userSchema } from "../user/schema";
export const loginSchema = userSchema.pick({ email: true, password: true });
export type LoginType = z.infer<typeof loginSchema>;
