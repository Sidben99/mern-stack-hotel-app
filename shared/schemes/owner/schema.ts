import { z } from "zod";
import { userSchema } from "../user/schema";
import { ownerInfoSchema } from "./ownerInfoSchema";
export const ownerSchema = userSchema.extend({
  role: z.literal("owner"),
  ownerInfo: ownerInfoSchema.required(),
});
type OwnerType = z.infer<typeof ownerSchema>;
export { OwnerType };
