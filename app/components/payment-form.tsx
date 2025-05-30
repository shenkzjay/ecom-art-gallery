import React, { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";

interface PaymentFormProps {
  onPaymentMethodChange: (method: string) => void;
  onCardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBankChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onPaymentMethodChange,
  onCardChange,
  onBankChange,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const stripe = useRef<any>(null);
  const elements = useRef<any>(null);
  const cardElement = useRef<any>(null);

  useEffect(() => {
    // Load Stripe when the component mounts
    const loadStripeInstance = async () => {
      const stripeInstance = await loadStripe(process.env.STRIPE_PUBLIC_KEY!);
      stripe.current = stripeInstance;

      if (stripeInstance) {
        elements.current = stripeInstance.elements();
        cardElement.current = elements.current.create("card");
        cardElement.current.mount("#card-element");
      }
    };
    loadStripeInstance();
  }, []);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const method = e.target.value;
    setPaymentMethod(method);
    onPaymentMethodChange(method);
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    onBankChange(e);
  };

  const handleStripePayment = async () => {
    if (!stripe.current || !elements.current || !cardElement.current) return;

    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1000 }), // Amount in cents
    });

    const { clientSecret } = await response.json();

    const result = await stripe.current.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement.current,
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        window.location.href = "/success"; // Redirect after payment success
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-bold">Select Payment Method</label>
        <div className="flex w-2/3">
          <button
            className={`cursor-pointer w-full ${
              paymentMethod === "stripe"
                ? "border-b-4 border-blue-500"
                : "border-b border-b-slate-200"
            }`}
            onClick={() => {
              setPaymentMethod("stripe");
              onPaymentMethodChange("stripe");
            }}
          >
            Stripe
          </button>
          <button
            className={`cursor-pointer  w-full ${
              paymentMethod === "credit_card"
                ? "border-b-4 border-blue-500"
                : "border-b border-b-slate-200"
            }`}
            onClick={() => {
              setPaymentMethod("credit_card");
              onPaymentMethodChange("credit_card");
            }}
          >
            Credit Card
          </button>
          <button
            className={`cursor-pointer  w-full ${
              paymentMethod === "bank_transfer"
                ? "border-b-4 border-blue-500"
                : "border-b border-b-slate-200"
            }`}
            onClick={() => {
              setPaymentMethod("bank_transfer");
              onPaymentMethodChange("bank_transfer");
            }}
          >
            Bank Transfer
          </button>
        </div>
      </div>

      {paymentMethod === "stripe" && (
        <div className="flex flex-col gap-4">
          {/* <div id="card-element" className="border border-slate-300 py-2 px-4 rounded-xl"></div> */}
          <button
            // onClick={handleStripePayment}
            className="cursor-pointer p-4 rounded-xl border-dotted border-4 border-gray-300 bg-gray-100 text-gray-500 "
          >
            Continue to setup Payment with Stripe
          </button>
        </div>
      )}

      {paymentMethod === "credit_card" && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="cardNumber" className="sr-only"></label>
            <input
              type="text"
              name="cardNumber"
              id="cardNumber"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Card Number"
              onChange={onCardChange}
            />
          </div>
          <div>
            <label htmlFor="cardHolder" className="sr-only"></label>
            <input
              type="text"
              name="cardHolder"
              id="cardHolder"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Card Holder"
              onChange={onCardChange}
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="expiration" className="sr-only"></label>
              <input
                type="text"
                name="expiration"
                id="expiration"
                className="border border-slate-300 py-2 px-4 rounded-xl w-full"
                placeholder="Expiration (MM/YY)"
                onChange={onCardChange}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="sr-only"></label>
              <input
                type="text"
                name="cvv"
                id="cvv"
                className="border border-slate-300 py-2 px-4 rounded-xl w-full"
                placeholder="CVV"
                onChange={onCardChange}
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "bank_transfer" && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="bankName" className="sr-only"></label>
            <input
              type="text"
              name="bankName"
              id="bankName"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Bank Name"
              value={bankDetails.bankName}
              onChange={handleBankChange}
            />
          </div>
          <div>
            <label htmlFor="accountNumber" className="sr-only"></label>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Account Number"
              value={bankDetails.accountNumber}
              onChange={handleBankChange}
            />
          </div>
          <div>
            <label htmlFor="accountHolder" className="sr-only"></label>
            <input
              type="text"
              name="accountHolder"
              id="accountHolder"
              className="border border-slate-300 py-2 px-4 rounded-xl w-full"
              placeholder="Account Holder"
              value={bankDetails.accountHolder}
              onChange={handleBankChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
