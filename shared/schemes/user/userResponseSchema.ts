import { z } from "zod";
import { userSchema } from "./schema";
import { ownerInfoSchema } from "./ownerInfoSchema";

const ownerInfoResponseSchema = ownerInfoSchema
  .omit({ stripeAccountId: true })
  .extend({
    cardImgInfo: z.object({
      img_url: z.string(),
    }),
  });

export const userResponseSchema = userSchema.omit({ password: true }).extend({
  id: z.string(),
  ownerInfo: ownerInfoResponseSchema.optional(),
});

type UserResponseType = z.infer<typeof userResponseSchema>;
export type { UserResponseType };
