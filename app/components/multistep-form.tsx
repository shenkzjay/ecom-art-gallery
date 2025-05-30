import React, { useState, useEffect } from "react";
import ShippingForm from "./shipping-form";
import PaymentForm from "./payment-form";
import ReviewForm from "./review-form";

const MultiStepForm = ({
  qtyCount,
  priceAtPurchase,
  totalPrice,
  productId,
}: {
  qtyCount: number;
  priceAtPurchase: number;
  totalPrice: number;
  productId: string;
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    street: "",
    state: "",
    zip: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiration: "",
    cvv: "",
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [isShippingComplete, setIsShippingComplete] = useState(false);

  useEffect(() => {
    // Load form data from localStorage on mount
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Check if the parsed data has all required fields
      if (
        parsedData.fullname &&
        parsedData.street &&
        parsedData.state &&
        parsedData.zip &&
        parsedData.country
      ) {
        setFormData(parsedData);
      }
    } else {
      const defaultData = {
        fullname: "",
        street: "",
        state: "",
        zip: "",
        country: "",
      };
      localStorage.setItem("formData", JSON.stringify(defaultData));
      setFormData(defaultData);
    }

    // Save form data to localStorage whenever it changes
    return () => {
      localStorage.setItem("formData", JSON.stringify(formData));
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingSubmit = () => {
    if (
      formData.fullname &&
      formData.street &&
      formData.state &&
      formData.zip &&
      formData.country
    ) {
      localStorage.setItem("formData", JSON.stringify(formData));
      setIsShippingComplete(true);
      setStep(2);
    } else {
      alert("Please fill out all shipping fields before continuing.");
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="my-16 text-4xl">
        {step === 1 ? (
          <h3>Shipping details</h3>
        ) : step === 2 ? (
          <h3>Payment details</h3>
        ) : (
          <h3>Review</h3>
        )}
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex w-full justify-between">
          <button
            className={`cursor-pointer w-full text-left ${
              step === 1 ? " border-b-4 border-blue-500" : "border-b border-b-slate-200"
            }`}
            onClick={() => setStep(1)}
          >
            Shipping
          </button>
          <button
            className={`cursor-pointer w-full text-left   ${
              step === 2
                ? "w-1/3 border-b-4 border-blue-500"
                : isShippingComplete
                ? " text-slate-600 hover:border-b-slate-500 border-b border-b-slate-400"
                : "text-slate-600 hover:border-b-slate-500 border-b border-b-slate-400 opacity-50 cursor-not-allowed"
            }`}
            onClick={() => setStep(2)}
            disabled={!isShippingComplete}
          >
            Payment
          </button>
          <button
            className={`cursor-pointer w-full text-left  ${
              step === 3
                ? "w-1/3 border-b-4 border-blue-500"
                : isShippingComplete
                ? "text-slate-600 hover:border-b-slate-500 border-b border-b-slate-400"
                : "text-slate-600 hover:border-b-slate-500 border-b border-b-slate-400 opacity-50 cursor-not-allowed"
            }`}
            onClick={() => setStep(3)}
            disabled={!isShippingComplete}
          >
            Review
          </button>
        </div>
      </div>

      {step === 1 && (
        <div className="mt-20">
          <ShippingForm
            fullname={formData.fullname}
            street={formData.street}
            state={formData.state}
            zip={formData.zip}
            country={formData.country}
            onChange={handleChange}
          />
          <div className="flex flex-row justify-between mt-4">
            <button
              type="button"
              onClick={handleShippingSubmit}
              className="cursor-pointer p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Save and continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-20">
          <PaymentForm
            onPaymentMethodChange={handlePaymentMethodChange}
            onCardChange={handleCardChange}
            onBankChange={handleBankChange}
          />
          <div className="flex flex-row justify-between mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="cursor-pointer p-4 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="cursor-pointer p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Save and continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-20">
          <ReviewForm
            formData={formData}
            paymentMethod={paymentMethod}
            cardDetails={cardDetails}
            bankDetails={bankDetails}
            qtyCount={qtyCount}
            priceAtPurchase={priceAtPurchase}
            totalPrice={totalPrice}
            productId={productId}
          />
          <div className="flex flex-row justify-between mt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="cursor-pointer p-4 rounded-full  text-slate-600 "
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
