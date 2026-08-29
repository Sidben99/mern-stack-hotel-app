import { model, Schema } from "mongoose";
import { type PropertyType } from "@lankaStay/shared/schemes/property/schema";

const propertySchema = new Schema<PropertyType>(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    specs: [
      {
        type: String,
        required: true,
      },
    ],

    images: [
      {
        type: String,
        required: true,
      },
    ],
  },

  { timestamps: true },
);

export const PropertyModel = model("Property", propertySchema);
