import Order from "~/server/models/order";

export async function getOrderById(userId: string) {
  //   const orders = await Order.find({ buyer: userId })
  //     .sort({ purchasedAt: -1 })
  //     .populate("buyer")
  //     .populate("products.product");

  //   return orders.map((order) => {
  //     const obj = order.toObject();

  //     obj._id = obj._id.toString();
  //     obj.buyer._id = obj.buyer._id.toString();
  //     obj.products = obj.products.map((item: any) => ({
  //       ...item,
  //       _id: item._id?.toString?.(),
  //       product: {
  //         ...item.product,
  //         _id: item.product?._id?.toString?.(),
  //       },
  //     }));

  //     return obj;
  //   });

  const orders = await Order.find({ buyer: userId })
    .sort({ purchasedAt: -1 })
    .populate("buyer")
    .populate("products.product")
    .lean();

  const serialized = orders.map((order) => ({
    ...order,
    id: order._id.toString(),
  }));

  return serialized;
}
