import { z } from "zod";
import { ownerApplicationSchema } from "./onwerApplicationSchema";
export const ownerInfoSchema = ownerApplicationSchema.extend({
  applicationStatus: z
    .enum(["pending", "approved", "rejected", "cancelled"])
    .default("pending"),
  adminStatus: z.enum(["pending", "approved", "rejected"]).default("pending"),
  adminReviewedAt: z.iso.datetime({ error: "invalid review date" }).optional(),
  rejectionNote: z.string().optional(),
  payoutsEnabled: z.boolean().optional(),
  stripeAccountId: z.string().optional(),
});

export type OwnerInfoType = z.infer<typeof ownerInfoSchema>;
