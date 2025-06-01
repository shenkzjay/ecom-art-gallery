import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow guest orders
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["credit_card", "stripe", "bank_transfer"],
          required: true,
        },
        details: mongoose.Schema.Types.Mixed,
      },
    ],

    shippingStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export type OrderType = mongoose.InferSchemaType<typeof OrderSchema> & {
  _id: string;
};

const Order = mongoose.model("Order", OrderSchema);

export default Order;
