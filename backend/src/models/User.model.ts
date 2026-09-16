import mongoose, { model, Schema } from "mongoose";
import { ROLES } from "@lankaStay/shared/consts/roles";
import { countriesCodes } from "@lankaStay/shared/consts/countries";
import { type UserType } from "@lankaStay/shared/schemes/user/schema";
import { OwnerInfoType } from "@lankaStay/shared/schemes/user/ownerInfoSchema";
import { APPLICATION_STATUS } from "@lankaStay/shared/consts/applicationStatus";
import type { HydratedDocument } from "mongoose";
type Tokens = Array<{
  _id: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}>;
export type UserFields = UserType & {
  tokens: Tokens;
  resetPasswordToken?: string;
};
export type UserDoc = HydratedDocument<UserFields>;
const ownerInfoSchema = new Schema<OwnerInfoType>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    nationalNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    cardImgInfo: {
      img_url: {
        type: String,
        required: true,
      },
      img_id: {
        type: String,
        required: true,
      },
    },

    applicationStatus: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: "pending",
    },
    adminReviewedAt: {
      type: Date,
    },
    rejectionNote: {
      type: String,
    },
    payoutsEnabled: {
      type: Boolean,
      default: false,
    },
    stripeAccountId: {
      type: String,
    },
  },
  { _id: false, timestamps: true },
);
const userSchema = new Schema<UserFields>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: "user",
    },
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      uppercase: true,
      validate: {
        validator: (value: string) =>
          countriesCodes.includes(value.toUpperCase()),
        message: "invalid country code",
      },
    },
    avatar: {
      type: String,
      required: true,
      default: function (): string {
        return `https://api.dicebear.com/10.x/initials/svg?seed=${this.username}`;
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        expiresAt: { type: Date, required: true },
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    ownerInfo: {
      type: ownerInfoSchema,
    },
  },

  { timestamps: true },
);

export const UserModel = model("User", userSchema);
