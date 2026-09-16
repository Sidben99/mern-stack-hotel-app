import { z } from "zod";
import ACCEPTED_IMG_TYPE from "../../consts/acceptedImgType";

function isAdult(dateOfBirth: Date): boolean {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 18);
  return dateOfBirth < currentDate;
}

export const ownerApplicationFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "first name must be at least 2 characters long")
    .max(50, "first name must be at most 50 characters long"),
  lastName: z
    .string()
    .min(2, "last name must be at least 2 characters long")
    .max(50, "last name must be at most 50 characters long"),

  nationalNumber: z
    .string("national number is required")
    .min(6, "national number must be at least 6 characters long")
    .max(20, "national number must be at most 20 characters long"),

  dateOfBirth: z.coerce.date("date of birth is required").refine(isAdult, {
    error: "you must be at least 18 years old",
  }),
  address: z.string("address is required"),
  cardImg: z
    .custom<File>((img) => img instanceof File)
    .refine(
      (img) => img.size <= 5 * 1024 * 1024,
      "card image must be less than 5MB",
    )
    .refine(
      (img) => ACCEPTED_IMG_TYPE.includes(img.type),
      "unsupported image format",
    ),
});

export type OwnerApplicationFormType = z.infer<
  typeof ownerApplicationFormSchema
>;
