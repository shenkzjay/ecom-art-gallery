import User from "~/server/models/user";

export async function getPurchasedItems(userId: string) {
  const user = await User.findById(userId)
    .populate({
      path: "purchasedItems.productId",
      model: "Product",
    })
    .lean();

  const purchasedProducts = user?.purchasedItems
    .filter((item) => item.productId)
    .map((item) => ({
      ...item,
      id: item.productId.toString(),
    }));

  return purchasedProducts;
}
