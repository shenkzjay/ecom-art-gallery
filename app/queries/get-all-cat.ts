import Category from "~/server/models/category";

export async function getAllCategories() {
  const allCategories = await Category.find({});

  if (!allCategories) {
    throw Error("Categories Not Found on db");
  }

  const serialized = allCategories.map((cat) => ({
    id: cat._id.toString(),
    categoryName: cat.categoryName,
  }));

  return serialized;
}
