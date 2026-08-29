import { z } from "zod";
import { userResponseSchema } from "../user/userResponseSchema";
import { ROLES } from "../../consts/roles";
import { ownerSchema } from "./schema";
const ownerResponseSchema = ownerSchema
  .extend({
    id: z.string(),
  })
  .omit({
    password: true,
  });

export type OwnerResponseType = z.infer<typeof ownerResponseSchema>;
