import { z } from "zod";
import { ownerApplicationFormSchema } from "./ownerApplicationFormSchema";
export const ownerApplicationSchema = ownerApplicationFormSchema
  .omit({ cardImg: true })
  .extend({
    cardImgInfo: z.object({
      img_url: z.url("invalid url"),
      img_id: z.string("invalid public id"),
    }),
  });

export type OwnerApplicationType = z.infer<typeof ownerApplicationSchema>;
