import User from "~/server/models/user";

export async function getPurchasedItems(userId: string) {
  const userDoc = await User.findById(userId).populate({
    path: "purchasedItems.productId",
    model: "Product",
    populate: [
      { path: "product_author", model: "User" },
      { path: "product_category", model: "Category" },
    ],
  });

  const user = userDoc?.toObject();

  const purchasedProducts = user?.purchasedItems.map((item) => ({
    ...item,
    id: item.productId?._id?.toString(),
  }));

  return purchasedProducts;
}
