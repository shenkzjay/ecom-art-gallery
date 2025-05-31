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
import { UpArrowheadIcon } from "public/icons/up-arrowhead";

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
      <section className="mt-12 ">
        <div className="flex gap-6 items-center bg-[url('/images/hero.png')] bg-center w-full h-[500px] relative  ">
          <div className="h-full w-full bg-black/40 absolute top-0"></div>
          <div className="w-full flex flex-col gap-10  z-10  items-center justify-center mx-6 md:mx-0">
            <div className="flex items-center  justify-center">
              <h2 className="md:w-[70%] md:text-6xl text-4xl font-bold text-white text-center">
                Explore curated collection of original art
              </h2>
            </div>
            <div>
              <button className="py-3 px-6 rounded-full bg-blue-500 text-white">Start tour</button>
            </div>
          </div>
          {/* <div className="w-1/2"> <img src="/images/hero.png" /> </div> */}
        </div>
      </section>

      {/* featured art type section */}
      <section className="mx-6 mt-[150px] md:container md:mx-auto grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
        <article className="grid">
          <figure className="grid gap-6 grid-rows-subgrid row-span-3">
            <figcaption className="flex justify-between items-center mb">
              <h3 className="text-2xl">Emerging art</h3>
              <span className="block w-8 h-8 [transform:rotate(90deg)] p-1.5 bg-slate-200 text-white rounded-full">
                <UpArrowheadIcon />
              </span>
            </figcaption>

            <img
              src="/images/art5.webp"
              width={400}
              height={400}
              className="object-cover w-[400px] h-[200px]"
              alt=""
            />
            <p className=" text-slate-500  ">
              In the art world, the word “emerging” is used to describe young artists whose careers
              are on the rise, but also includes artists who are relatively under-recognized but for
              the most part
            </p>
          </figure>
        </article>

        <article className="grid">
          <figure className="grid grid-rows-subgrid row-span-3 gap-6">
            <figcaption className="flex justify-between items-center mb">
              <h3 className="text-2xl">Contemporary art</h3>
              <span className="block w-8 h-8 [transform:rotate(90deg)] p-1.5 bg-slate-200 text-white rounded-full">
                <UpArrowheadIcon />
              </span>
            </figcaption>

            <img
              src="/images/art2.webp"
              width={400}
              height={400}
              className="object-cover w-[400px] h-[200px]"
              alt=""
            />
            <p className=" text-slate-500  ">
              Spanning from 1970 to the present day, the contemporary period of art history
              represents the most diverse and widely-collected era of artistic production
            </p>
          </figure>
        </article>

        <article className="grid">
          <figure className="grid gap-6 grid-rows-subgrid row-span-3">
            <figcaption className="flex justify-between items-center mb">
              <h3 className="text-2xl">Modern art</h3>
              <span className="block w-8 h-8 [transform:rotate(90deg)] p-1.5 bg-slate-200 text-white rounded-full">
                <UpArrowheadIcon />
              </span>
            </figcaption>

            <img
              src="/images/art10.webp"
              width={400}
              height={400}
              className="object-cover w-[400px] h-[200px]"
              alt=""
            />
            <p className=" text-slate-500  ">
              All works / Movement The Impressionists radically challenged the conventions of
              artmaking, rejecting the established academic style in favor of loose brushstrokes to
              capture atmospheric landscapes.
            </p>
          </figure>
        </article>
      </section>

      <section className="flex md:flex-row flex-col mt-[150px]">
        <div className="md:w-1/2 flex justify-center items-center flex-col bg-[#f7f7f7]">
          <div className=" md:w-1/2 text-balance text-center grid gap-6 p-6 md:p-0 ">
            <h3 className="text-4xl ">Welcome to the Art and History Museum, Ozeunma</h3>
            <p className="text-sm text-slate-400">
              Not only the outstanding quality of the collections, but also our high level of
              acitvity in the areas of reaserch, exhibitions and education guarantee the Ozeumma
              prominent position in the international museums landscape
            </p>
          </div>
        </div>

        <div className="md:w-1/2 relative">
          <img
            src="/images/sculp.png"
            width={400}
            height={400}
            alt="picture of white sculpture sitting in a museum"
            className="w-full h-full"
          />
          <span className="w-full h-full bg-black/20 absolute top-0"></span>
        </div>
      </section>

      {/* art collection */}
      <section className="mt-[150px] container mx-auto w-[90vw]">
        <div>
          <h3 className="text-4xl mb-12">Collections</h3>
        </div>
        <ul className="md:columns-4 gap-8 space-y-8">
          {allProducts.map((product, index) => {
            const isSaved = savedProductIds?.includes(product.id);
            return (
              <li
                key={index}
                className="break-inside-avoid mb-8 bg-white rounded-lg overflow-hidden"
              >
                <Link to={`/artwork/${product.id}`}>
                  <div className="mb-2">
                    <img
                      src={product.product_image[0]}
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </Link>

                <div className="py-4">
                  <div className="flex justify-between items-start">
                    <div className="w-full">
                      <p className="capitalize font-semibold text-lg mb-1">
                        {product.product_title}
                      </p>
                      <p className="text-gray-500 italic text-sm text-wrap mb-2">
                        {product.product_about.slice(0, 100)}
                      </p>
                      <p className="font-bold text-lg">${product.product_price.toLocaleString()}</p>
                    </div>

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
      px-4 py-0  transition-all duration-200 
      disabled:opacity-50 disabled:cursor-not-allowed
      ${
        isOptimisticSaved
          ? " hover:text-red-600 text-red-500"
          : " hover:text-slate-600 text-slate-500"
      }
      ${isLoading ? "animate-pulse" : ""}
    `}
    >
      {isLoading ? (
        <span className="flex items-center text-xs gap-2">
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
            <span className="flex flex-col items-center  gap-0">
              <p className="text-xl">❤️ </p> <p className="text-xs">Save</p>
            </span>
          ) : (
            <span className="flex flex-col items-center  gap-0">
              <p className="text-xl">🤍 </p> <p className="text-xs">Save</p>
            </span>
          )}
        </>
      )}
    </button>
  );
};
