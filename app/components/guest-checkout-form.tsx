import React, { useState } from "react";
import { Form, useNavigate } from "react-router";

interface GuestCheckoutFormProps {
  productId: string;
  priceAtPurchase: number;
}

const GuestCheckoutForm: React.FC<GuestCheckoutFormProps> = ({ productId, priceAtPurchase }) => {
  const [qtyCount, setQtyCount] = useState(1);
  const navigate = useNavigate();

  const decreaseQuantity = () => {
    if (qtyCount <= 0) {
      setQtyCount(0);
    }
    setQtyCount((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQtyCount((prev) => prev + 1);
  };

  const totalPrice = qtyCount * priceAtPurchase;

  return (
    <Form method="post" action={`/order/shipping/${productId}`}>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-4">Guest Checkout</h2>

        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Shipping Information</h3>
          <div>
            <label htmlFor="fullname" className="sr-only"></label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <label htmlFor="street" className="sr-only"></label>
            <input
              type="text"
              name="street"
              id="street"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Street"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="sr-only"></label>
            <input
              type="text"
              name="state"
              id="state"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="State"
              required
            />
          </div>

          <div>
            <label htmlFor="zip" className="sr-only"></label>
            <input
              type="text"
              name="zip"
              id="zip"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="ZIP"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="sr-only"></label>
            <input
              type="text"
              name="country"
              id="country"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Country"
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">Quantity</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={increaseQuantity}
                className="cursor-pointer w-5 h-5 bg-slate-200 flex items-center justify-center rounded-full"
              >
                +
              </button>
              <p className="font-bold">{qtyCount}</p>
              <button
                type="button"
                onClick={decreaseQuantity}
                className="cursor-pointer w-5 h-5 bg-slate-200 flex items-center justify-center rounded-full"
              >
                -
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl">
            <p className="text-slate-400">Total</p>
            <p className="font-bold">{`$${totalPrice.toLocaleString()}`}</p>
          </div>
        </div>

        <input type="hidden" name="qtyCount" value={qtyCount} />
        <input type="hidden" name="priceAtPurchase" value={priceAtPurchase} />
        <input type="hidden" name="totalPrice" value={totalPrice} />

        <button
          type="submit"
          className="bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          Continue to Payment
        </button>
      </div>
    </Form>
  );
};

export default GuestCheckoutForm;
