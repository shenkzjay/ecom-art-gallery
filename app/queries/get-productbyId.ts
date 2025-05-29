import Product from "~/server/models/product";
import type { ProductFrontendType } from "./get-product";

export async function getProductById(productId: string) {
  let singleProduct = null;
  const getSingleProduct = await Product.findById(productId)
    .populate("product_category")
    .populate("product_author")
    .lean<ProductFrontendType>({ virtual: true });
  if (getSingleProduct) {
    singleProduct = {
      ...getSingleProduct,
      _id: getSingleProduct._id.toString(),
      savedItems: getSingleProduct.product_author.savedItems.map((item) => ({
        ...item,
        productId: item.productId.toString(),
      })),
    };
  }
  return singleProduct;

  // const singleProduct = await Product.findById(productId)
  //   .populate("product_author")
  //   .populate("product_category");

  // if (!singleProduct) return null;

  // return singleProduct.toObject();
}
