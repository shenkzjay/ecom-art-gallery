import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});

export type CategoryType = mongoose.InferSchemaType<typeof CategorySchema> & { _id: string };

const Category = mongoose.model("Category", CategorySchema);

export default Category;
