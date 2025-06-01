import Product, { type ProductType } from "~/server/models/product";
import type { CategoryType } from "~/server/models/category";
import type { UserType } from "~/server/models/user";

export type ProductFrontendType = Omit<ProductType, "_id"> & {
  _id: string;
  id: string;
  product_category: CategoryType;
  product_author: UserType;
};

export async function getAllProducts() {
  const productsData = await Product.find()
    .populate("product_category")
    .populate("product_author")
    .lean<ProductType[]>();

  if (!productsData) {
    throw Error("product Not Found on db");
  }

  const serializedProductData = productsData.map((product) => ({
    ...product,
    id: product._id.toString(),
  }));

  return serializedProductData;
}
