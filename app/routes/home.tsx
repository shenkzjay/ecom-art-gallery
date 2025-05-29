import { getCached, setInCached } from "~/utils/cache.server";
import type { Route } from "./+types/home";
import { Link } from "react-router";
import type { ProductType } from "~/server/models/product";
import { getAllProducts, type ProductFrontendType } from "~/queries/get-product";
import { getSession } from "~/utils/session";
import { getUser } from "~/queries/get-user";
import { useFetcher } from "react-router";
import User from "~/server/models/user";
import mongoose from "mongoose";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home page" }, { name: "description", content: "Artwork homepage!" }];
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const session = await getSession(request);
    const userId = session?._id;

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const productId = formData.get("productId") as string;
    const actionType = formData.get("action") as string;

    if (!productId || !actionType) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    let updatedUser;

    if (actionType === "add") {
      // use $addToSet to prevent duplicates
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            savedItems: {
              productId: new mongoose.Types.ObjectId(productId),
              savedAt: new Date(),
            },
          },
        },
        { new: true }
      );
    } else if (actionType === "remove") {
      // use $pull to remove the item
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            savedItems: { productId: new mongoose.Types.ObjectId(productId) },
          },
        },
        { new: true }
      );
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!updatedUser) {
      return Response.json({ error: "Failed to update user" }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: actionType === "add" ? "Item saved successfully!" : "Item removed from saved items",
      savedItems: updatedUser.savedItems,
    });
  } catch (error) {
    console.error("Error updating saved items:", error);
    return Response.json({ error: "Failed to update saved items" }, { status: 500 });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  const userId = session?._id;

  const user = await getUser(userId || "");

  const cachedProduct = getCached<ProductFrontendType[]>("product");

  if (cachedProduct) {
    const savedProductIds = user?.savedItems.map((item) => item.productId.toString());
    return {
      allProducts: cachedProduct,
      savedProductIds,
    };
  }

  try {
    const products = await getAllProducts();

    setInCached("product", products);
    const savedProductIds = user?.savedItems.map((item) => item.productId.toString());

    return { allProducts: products, savedProductIds };
  } catch (error) {
    console.error(`error trying to retrieve products: ${error}`);
    throw new Error("products Not Found");
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { allProducts, savedProductIds } = loaderData;

  console.log(savedProductIds);

  return (
    <main>
      <section className="mt-12">
        <div className="flex gap-6 items-center">
          <div className="w-1/2 flex flex-col gap-10">
            <div>
              <h2 className="w-[80%] text-6xl font-bold">
                Explore curated collection of original art
              </h2>
            </div>
            <div>
              <button className="py-3 px-6 rounded-full bg-blue-500 text-white">Start tour</button>
            </div>
          </div>
          <div className="w-1/2">
            <img src="/images/hero.png" />
          </div>
        </div>
      </section>
      <section className="mt-[150px]">
        <div>
          <h3 className="text-4xl mb-12">Explore works from artists</h3>
        </div>
        <ul className="flex flex-row gap-4">
          {allProducts.map((product) => {
            const isSaved = savedProductIds?.includes(product.id);
            return (
              <li key={product.id} className="flex flex-row">
                <div>
                  <Link to={`/artwork/${product.id}`}>
                    <div className="w-[250px] mb-2">
                      <img
                        src={product.product_image[0]}
                        width={300}
                        height={300}
                        className="w-full h-full"
                      />
                    </div>
                  </Link>

                  <div className="flex justify-between">
                    <div>
                      <p className="capitalize">{product.product_title}</p>
                      <p className="text-gray-500 italic text-sm">{product.product_about}</p>
                      <p className="font-bold">{`$${product.product_price.toLocaleString()}`}</p>
                    </div>
                  </div>
                  <div>
                    <SavedItems productId={product.id} isSaved={isSaved} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

type SavedItemsButtonProps = {
  productId: string;
  isSaved?: boolean;
};

export const SavedItems = ({
  productId,
  isSaved: initialIsSaved = false,
}: SavedItemsButtonProps) => {
  const fetcher = useFetcher();
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimisticSaved, setIsOptimisticSaved] = useState(initialIsSaved);

  useEffect(() => {
    // Sync local state if props change
    setIsOptimisticSaved(initialIsSaved);
  }, [initialIsSaved]);

  useEffect(() => {
    if (fetcher.data) {
      setIsLoading(false);
    } else {
      setIsOptimisticSaved(initialIsSaved);
    }
  }, [fetcher.data, initialIsSaved]);

  const handleToggle = () => {
    const newState = !isOptimisticSaved;

    setIsOptimisticSaved(newState);
    setIsLoading(true);

    const formdata = new FormData();
    formdata.append("productId", productId);
    formdata.append("action", newState ? "add" : "remove");

    fetcher.submit(formdata, {
      method: "POST",
    });
  };

  return (
    <button
      disabled={isLoading}
      name="savedItems"
      type="button"
      onClick={handleToggle}
      className={`
      px-4 py-2 rounded-full transition-all duration-200 
      disabled:opacity-50 disabled:cursor-not-allowed
      ${
        isOptimisticSaved
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      }
      ${isLoading ? "animate-pulse" : ""}
    `}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {isOptimisticSaved ? "Unsaving..." : "Saving..."}
        </span>
      ) : (
        <>
          {isOptimisticSaved ? (
            <span className="flex items-center gap-2">❤️ Saved</span>
          ) : (
            <span className="flex items-center gap-2">🤍 Save</span>
          )}
        </>
      )}
    </button>
  );
};
