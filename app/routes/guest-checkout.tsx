import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import GuestCheckoutForm from "~/components/guest-checkout-form";
import { getAllProducts, type ProductFrontendType } from "~/queries/get-product";

export default function GuestCheckout() {
  const [productId, setProductId] = useState("");
  const [priceAtPurchase, setPriceAtPurchase] = useState(0);
  const [products, setProducts] = useState<ProductFrontendType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      const products = await getAllProducts();
      setProducts(products);
    }
    fetchProducts();
  }, []);

  const handleProductSelect = (id: string, price: number) => {
    setProductId(id);
    setPriceAtPurchase(price);
  };

  return (
    <section className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Guest Checkout</h1>
      {productId ? (
        <GuestCheckoutForm productId={productId} priceAtPurchase={priceAtPurchase} />
      ) : (
        <div>
          <p className="mb-4">Please select a product to purchase:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => handleProductSelect(product._id, product.product_price)}
              >
                <img
                  src={product.product_image[0]}
                  alt={product.product_title}
                  className="w-full h-48 object-cover mb-4"
                />
                <h2 className="text-xl font-bold mb-2">{product.product_title}</h2>
                <p className="text-gray-700 mb-2">{product.product_about}</p>
                <p className="text-gray-900 font-bold">${product.product_price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
