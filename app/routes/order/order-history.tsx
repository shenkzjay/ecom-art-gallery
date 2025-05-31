import React, { useState } from "react";
import type { Route } from "./+types/order-history";
import { getSession } from "~/utils/session";
import { getUser } from "~/queries/get-user";
import { getOrderById } from "~/queries/get-orderbyId";
import { ConnectToDatabase } from "~/db/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  await ConnectToDatabase();
  const session = await getSession(request);

  const sessionid = session?._id;

  const user = await getUser(sessionid || "");

  const userId = user?._id;

  const allOrders = await getOrderById(userId || "");

  return { allOrders };
}

const OrderHistory = ({ loaderData }: Route.ComponentProps) => {
  const [activeTab, setActiveTab] = useState("processing");

  const { allOrders } = loaderData;

  const filterOrdersByStatus = (status: string) => {
    return allOrders.filter((order) => order.shippingStatus.toLowerCase() === status);
  };

  const renderOrders = (status: string) => {
    const orders = filterOrdersByStatus(status);

    return (
      <div className="mt-4">
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Order #{order.id.slice(0, 5)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.purchasedAt).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${order.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{order.paymentStatus}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {order.products.map((item, index) => (
                    <div key={index} className="text-sm text-gray-800">
                      {item.product.product_title} ({item.quantity} x $
                      {item.priceAtPurchase.toLocaleString()})
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No orders found for this status.</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-20">Order History</h1>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 cursor-pointer" aria-label="Tabs">
            {["processing", "shipped", "delivered"].map((status) => (
              <a
                key={status}
                onClick={() => setActiveTab(status)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === status
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={activeTab === status ? "page" : undefined}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </a>
            ))}
          </nav>
        </div>
        {renderOrders(activeTab)}
      </div>
    </div>
  );
};

export default OrderHistory;
