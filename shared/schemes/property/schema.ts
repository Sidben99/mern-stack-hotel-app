import { z } from "zod";

export const propertySchema = z.object({
  name: z
    .string()
    .min(2, "name must be at least 2 characters long")
    .max(50, "name must be at most 50 characters long"),
  city: z
    .string()
    .min(2, "city must be at least 2 characters long")
    .max(50, "city must be at most 50 characters long"),
  country: z
    .string()
    .min(2, "country must be at least 2 characters long")
    .max(50, "country must be at most 50 characters long"),
  description: z
    .string()
    .min(2, "description must be at least 2 characters long")
    .max(50, "description must be at most 50 characters long"),
  pricePerDay: z.number(),
  numberOfGuests: z.number().max(20, "number of guests must be at most 20"),
  mainImage: z.string(),
  specs: z.array(z.string()),
  images: z.array(z.string()).length(2),
});

type PropertyType = z.infer<typeof propertySchema>;

export type { PropertyType };
