import { z } from "zod";
import { userSchema } from "./schema";
export const updateMyProfile = userSchema.omit({
  password: true,
  avatar: true,
  role: true,
});
export type UpdateMyProfileType = z.infer<typeof updateMyProfile>;
