import { z } from "zod";
import { ownerApplicationSchema } from "./onwerApplicationSchema";
export const ownerApplicationInfoSchema = ownerApplicationSchema
  .omit({ cardImg: true })
  .extend({
    cardImgInfo: z.object({
      img_url: z.url("invalid url"),
      img_id: z.string("invalid public id"),
    }),
  });

export type OwnerApplicationInfoType = z.infer<
  typeof ownerApplicationInfoSchema
>;
