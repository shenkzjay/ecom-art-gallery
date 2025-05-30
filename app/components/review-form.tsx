import { Form, redirect } from "react-router";
import type { Route } from "../routes/order/+types/shipping";

interface ReviewFormProps {
  formData: {
    fullname: string;
    street: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  cardDetails?: {
    cardNumber: string;
    cardHolder: string;
    expiration: string;
    cvv: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  qtyCount: number;
  priceAtPurchase: number;
  totalPrice: number;
  productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  formData,
  paymentMethod,
  cardDetails,
  bankDetails,
  qtyCount,
  priceAtPurchase,
  totalPrice,
  productId,
}) => {
  console.log(formData);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Review Your Order</h2>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Shipping Information</h3>
        <p>
          <strong>Name:</strong> {formData.fullname}
        </p>
        <p>
          <strong>Address:</strong> {formData.street}, {formData.state}, {formData.zip},{" "}
          {formData.country}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Payment Information</h3>
        <p>
          <strong>Method:</strong> {paymentMethod}
        </p>

        {paymentMethod === "credit_card" && cardDetails && (
          <div className="flex flex-col gap-1">
            <p>
              <strong>Card Number:</strong> {cardDetails.cardNumber}
            </p>
            <p>
              <strong>Card Holder:</strong> {cardDetails.cardHolder}
            </p>
            <p>
              <strong>Expiration:</strong> {cardDetails.expiration}
            </p>
            <p>
              <strong>CVV:</strong> {cardDetails.cvv}
            </p>
          </div>
        )}

        {paymentMethod === "bank_transfer" && bankDetails && (
          <div className="flex flex-col gap-1">
            <p>
              <strong>Bank Name:</strong> {bankDetails.bankName}
            </p>
            <p>
              <strong>Account Number:</strong> {bankDetails.accountNumber}
            </p>
            <p>
              <strong>Account Holder:</strong> {bankDetails.accountHolder}
            </p>
          </div>
        )}
      </div>
      <Form method="post">
        {/* shipping values */}
        <input type="hidden" name="qtyCount" value={qtyCount} />
        <input type="hidden" name="priceAtPurchase" value={priceAtPurchase} />
        <input type="hidden" name="totalPrice" value={totalPrice} />
        <input type="hidden" name="productId" value={productId} />

        <input type="hidden" name="fullname" value={formData.fullname} />
        <input type="hidden" name="street" value={formData.street} />
        <input type="hidden" name="state" value={formData.state} />
        <input type="hidden" name="zip" value={formData.zip} />
        <input type="hidden" name="country" value={formData.country} />

        {/* payment vlaues */}
        <input type="hidden" name="paymentMethod" value={paymentMethod} />

        {/* card values */}
        {cardDetails && (
          <>
            <input type="hidden" name="cardNumber" value={cardDetails.cardNumber} />
            <input type="hidden" name="cardHolder" value={cardDetails.cardHolder} />
            <input type="hidden" name="expiration" value={cardDetails.expiration} />
            <input type="hidden" name="cvv" value={cardDetails.cvv} />
          </>
        )}

        {/* bank values */}
        {bankDetails && (
          <>
            <input type="hidden" name="bankName" value={bankDetails.bankName} />
            <input type="hidden" name="accountNumber" value={bankDetails.accountNumber} />
            <input type="hidden" name="accountHolder" value={bankDetails.accountHolder} />
          </>
        )}

        <button
          type="submit"
          className="cursor-pointer p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          Place Order
        </button>
      </Form>
    </div>
  );
};

export default ReviewForm;
