import { z } from "zod";
import { userSchema } from "./schema";
export const loginSchema = userSchema.pick({ email: true, password: true });
export type LoginType = z.infer<typeof loginSchema>;
