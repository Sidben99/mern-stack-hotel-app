import { z } from "zod";
import { userResponseSchema } from "../user/userResponseSchema";
import { ROLES } from "../../consts/roles";

export const accountResponseSchema = userResponseSchema.extend({
  role: z.enum([ROLES.USER, ROLES.OWNER]),
  phoneNumber: z.string(),
});

export type AccountResponseType = z.infer<typeof accountResponseSchema>;
