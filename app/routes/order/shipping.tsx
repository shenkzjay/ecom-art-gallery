import { getProductById } from "~/queries/get-productbyId";
import type { Route } from "./+types/shipping";
import { Form, redirect } from "react-router";
import { useState } from "react";
import { getSession } from "~/utils/session";
import MultiStepForm from "~/components/multistep-form";
import Order from "~/server/models/order";
import { getUser } from "~/queries/get-user";
import type { OrderType } from "~/server/models/order";
import mongoose from "mongoose";
import Product from "~/server/models/product";
import User from "~/server/models/user";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSession(request);

  const productId = params.artworkId;

  if (!session) {
    return redirect("/login");
  }

  const sessionId = session._id;

  const userId = await getUser(sessionId);

  const formData = await request.formData();

  const fullname = formData.get("fullname") as string;
  const street = formData.get("street") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const country = formData.get("country") as string;
  const qtyCount = Number(formData.get("qtyCount"));
  const priceAtPurchase = Number(formData.get("priceAtPurchase"));
  const totalPrice = Number(formData.get("totalPrice"));

  const paymentMethod = formData.get("paymentMethod") as string;

  let cardData, bankData;

  if (paymentMethod === "credit_card") {
    cardData = {
      cardNumber: formData.get("cardNumber") as string,
      cardHolder: formData.get("cardHolder") as string,
      expiration: formData.get("expiration") as string,
      cvv: formData.get("cvv") as string,
    };
  }

  if (paymentMethod === "bank_transfer") {
    bankData = {
      bankName: formData.get("bankName") as string,
      accountNumber: formData.get("accountNumber") as string,
      accountHolder: formData.get("accountHolder") as string,
    };
  }

  const order = new Order({
    buyer: new mongoose.Types.ObjectId(userId?._id),
    products: [
      {
        product: new mongoose.Types.ObjectId(productId),
        quantity: qtyCount,
        priceAtPurchase,
      },
    ],
    totalAmount: totalPrice,
    shippingAddress: {
      name: fullname,
      street,
      state,
      zip,
      country,
    },
    paymentMethods: [
      {
        type: paymentMethod,
        details:
          paymentMethod === "credit_card"
            ? cardData
            : paymentMethod === "bank_transfer"
            ? bankData
            : {},
      },
    ],
    paymentStatus: "pending",
    shippingStatus: "processing",
    purchasedAt: new Date(),
  });

  try {
    await order.save();

    //updating the isSold and pushing sales details
    //into the product model so the artist can see who bought his art
    await Product.findByIdAndUpdate(productId, {
      isSold: true,
      $push: {
        saleDetails: {
          buyer: userId?._id,
          orderId: order._id,
          soldAt: new Date(),
          priceSoldAt: priceAtPurchase,
          shippingStatus: "processing",
        },
      },
    });

    //updating the purchased items so that the buyer
    //can have a record of his art collections
    await User.findByIdAndUpdate(userId?._id, {
      $push: {
        purchasedItems: {
          productId: productId,
          purchasedAt: new Date(),
          licenseType: "personal",
        },
      },
    });

    return redirect("/order/success");
  } catch (error) {
    console.error(error);
    throw Error("Failed to create order:" + error);
  }
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (!session) {
    return redirect("/login");
  }
  const id = params.artworkId;

  try {
    const getSingleProduct = await getProductById(id);

    if (!getSingleProduct) {
      throw new Response("Not Found", { status: 404 });
    }

    return { singleProducts: getSingleProduct, id };
  } catch (error) {
    console.error(`error trying to retrieve singleproduct: ${error}`);
    throw new Error("products Not Found");
  }
}

export default function Orders({ loaderData }: Route.ComponentProps) {
  const { singleProducts } = loaderData;

  const [qtyCount, setQtyCount] = useState(1);

  const decreaseQuantity = () => {
    if (qtyCount <= 0) {
      setQtyCount(0);
    }
    setQtyCount((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQtyCount((prev) => prev + 1);
  };

  const totalPrice = qtyCount * singleProducts.product_price;

  return (
    <section className="container mx-auto mt-10">
      <div className="flex gap-20">
        <div className="w-[55%]">
          <MultiStepForm
            qtyCount={qtyCount}
            totalPrice={totalPrice}
            productId={singleProducts._id}
            priceAtPurchase={singleProducts.product_price}
          />
        </div>
        <div className="w-1/2 flex flex-col items-center mt-20">
          <div className="w-1/2 flex-col flex gap-2">
            <img
              src={singleProducts.product_image[0]}
              width={100}
              height={100}
              alt="painting artwork"
            />
            <div className="w-full flex flex-col gap-2">
              <p>{singleProducts.product_title}</p>
              <p className="text-sm italic">{singleProducts.product_about}</p>
              <p>{singleProducts.product_author.profile?.name}</p>
              <div className="flex justify-between">
                <p className="text-sm text-slate-400">Price</p>
                <p className="font-bold">{`$${singleProducts.product_price.toLocaleString()}`}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-400">Quantity</p>
                <div className="flex gap-2">
                  <button
                    onClick={increaseQuantity}
                    className="cursor-pointer w-5 h-5 bg-slate-200 flex items-center justify-center rounded-full"
                  >
                    +
                  </button>
                  <p className="font-bold">{qtyCount}</p>
                  <button
                    onClick={decreaseQuantity}
                    className="cursor-pointer w-5 h-5 bg-slate-200 flex items-center justify-center rounded-full"
                  >
                    -
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl mt-2">
                <p className=" text-slate-400">Total</p>
                <p className="font-bold">{`$${totalPrice.toLocaleString()}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
