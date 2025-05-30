import mongoose from "mongoose";
import { ROLE_LIST } from "../configs/role";
import type { OrderType } from "./order";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    roles: {
      type: [Number],
      enum: [ROLE_LIST.Admin, ROLE_LIST.artist, ROLE_LIST.buyer],
      default: [ROLE_LIST.buyer],
      required: true,
    },

    activeRole: {
      type: Number,
      enum: [ROLE_LIST.Admin, ROLE_LIST.artist, ROLE_LIST.buyer],
      default: ROLE_LIST.buyer,
    },

    refreshToken: { type: String, select: false },

    profile: {
      name: { type: String, required: true, trim: true },
      bio: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "an artist bio is an insight to the soul of the artwork",
      },
      avatar: { type: String, default: "/default-avatar.jpg" },
      location: {
        city: { type: String, trim: true },
        country: { type: String, trim: true },
      },
    },

    artistProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", select: false },

    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    signupDate: { type: Date, default: Date.now },
    lastActive: Date,
    isVerified: { type: Boolean, default: false },

    savedItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    purchasedItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
        licenseType: {
          type: String,
          enum: ["personal", "commercial", "all_rights_reserved"],
          default: "personal",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// UserSchema.pre("validate", function (next) {
//   if (this.roles.includes(ROLE_LIST.artist) && !this.artistProfile?.statement) {
//     this.invalidate("artistProfile.statement", "Artist statement is required for artists");
//   }
//   next();
// });

UserSchema.methods.toJSONSanitized = function () {
  const obj = this.toObject({ virtuals: true });
  if (obj.activeRole && obj.roles === ROLE_LIST.buyer) {
    delete obj.artistProfile;
  }
  return obj;
};

UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "buyer",
  options: { sort: { purchasedAt: -1 } }, // newest first
});

export type UserType = mongoose.InferSchemaType<typeof UserSchema> & {
  _id: string;
  orders?: OrderType[];
  savedItems: Array<{
    productId: string;
    savedAt: Date;
  }>;
  purchasedItems: Array<{
    productId: string;
    purchasedAt: Date;
    licenseType: string;
  }>;
};

const User = mongoose.model("User", UserSchema);

export default User;
