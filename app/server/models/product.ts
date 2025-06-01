import mongoose from "mongoose";
import { Document } from "mongoose";
import type { UserType } from "./user";
import type { CategoryType } from "./category";

interface ProductDoc extends Document {
  product_title: string;
  product_about: string;
  product_image: string[];
  product_date: Date;
  medium: string;
  style?: string;
  dimensions: {
    height: number;
    width: number;
    depth?: number;
    unit?: string;
  };
  product_price: number;
  product_category: mongoose.Types.ObjectId;
  product_author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema({
  isSold: {
    type: Boolean,
    default: false,
    index: true,
  },

  product_title: {
    type: String,
    required: true,
  },

  product_about: {
    type: String,
    required: true,
  },

  product_image: {
    type: [String],
    required: true,
  },

  product_date: {
    type: Date,
  },

  medium: {
    type: String,
    trim: true,
    required: true,
  },

  style: {
    type: String,
    trim: true,
  },

  dimensions: {
    height: { type: Number, required: true },
    width: { type: Number, required: true },
    depth: { type: Number, default: 0 },
    unit: { type: String, enum: ["cm", "inch"], default: "cm" },
  },

  product_price: {
    type: Number,
    required: true,
  },

  product_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  product_author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  licenseType: {
    type: String,
    enum: [
      "all_rights_reserved",
      "personal_use_only",
      "commercial_use_allowed",
      "creative_commons",
    ],
    default: "all_rights_reserved",
  },

  saleDetails: {
    type: [
      {
        buyer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false, // Allow guest orders
        },
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        soldAt: {
          type: Date,
        },
        priceSoldAt: {
          type: Number,
        },
        shippingStatus: {
          type: String,
          enum: ["processing", "shipped", "delivered", "cancelled"],
          default: "processing",
        },
      },
    ],
  },
});

export type ProductType = mongoose.InferSchemaType<typeof ProductSchema> & {
  _id: string;
  product_category: CategoryType;
  product_author: UserType;
  productId?: {
    _id: string;
    product_title: string;
    product_about: string;
    product_image: string[];
  };
};

const Product = mongoose.model("Product", ProductSchema);

export default Product;
