import { model, Schema, InferSchemaType } from "mongoose";
import { ROLES } from "@lankaStay/shared/consts/roles";

const userSchema = new Schema(
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
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: function () {
        return `https://api.dicebear.com/10.x/initials/svg?seed=${this.firstName}`;
      },
    },
    tokens: [
      {
        _id: Schema.Types.ObjectId,
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
          default: Date.now,
        },
        expiresAt: { type: Date, required: true },
      },
    ],
    resetPasswordToken: {
      type: String,
    },
  },

  { timestamps: true },
);

export type IUser = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);
