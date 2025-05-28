import Product, { type ProductType } from "~/server/models/product";

export async function getAllProducts() {
  const productsData = await Product.find()
    .populate("product_category")
    .populate("product_author")
    .lean<ProductType[]>();

  console.log(productsData, "prod");

  if (!productsData) {
    throw Error("product Not Found on db");
  }

  const serializedProductData = productsData.map((product) => ({
    ...product,
    id: product._id.toString(),
  }));

  return serializedProductData;
}
