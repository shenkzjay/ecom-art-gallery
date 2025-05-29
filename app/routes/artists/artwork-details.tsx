import { ConnectToDatabase } from "~/db/db.server";
import type { Route } from "./+types/artwork-details";
import { getProductById } from "~/queries/get-productbyId";
// import { getCached, setInCached } from "~/utils/cache.server";
import type { ProductFrontendType } from "~/queries/get-product";
import { UpArrowheadIcon } from "public/icons/up-arrowhead";
import { useNavigate } from "react-router";
import mongoose from "mongoose";
import { getSession } from "~/utils/session";
import { getUser } from "~/queries/get-user";
import { useState } from "react";
import { SavedItems } from "../home";
import { DownArrowheadIcon } from "public/icons/down-arrowhead";

export async function loader({ params, request }: Route.LoaderArgs) {
  await ConnectToDatabase();
  const id = params.artworkId;

  // const cachedSingleProduct = getCached<ProductFrontendType>("singleProduct");

  // if (cachedSingleProduct) {
  //   return {
  //     singleProducts: cachedSingleProduct,
  //   };
  // }

  try {
    const getSingleProduct = await getProductById(id);

    if (!getSingleProduct) {
      throw new Response("Not Found", { status: 404 });
    }

    // setInCached("singleProduct", getSingleProduct);

    return { singleProducts: getSingleProduct, id };
  } catch (error) {
    console.error(`error trying to retrieve singleproduct: ${error}`);
    throw new Error("products Not Found");
  }
}

export default function ArtworkDetails({ loaderData }: Route.ComponentProps) {
  const { singleProducts, id } = loaderData;

  const isSaved = singleProducts.savedItems?.some((item) => {
    return item.productId === id;
  });

  const [isImageselected, setIsImageSelected] = useState<string>();

  console.log({ singleProducts });

  const navigate = useNavigate();

  const handleSelectImage = (image: string) => {
    setIsImageSelected(image);
  };

  return (
    <section className="bg-[#f7f7f7]  h-[600px]">
      <div className="container mx-auto">
        <div className="flex">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer w-5 h-5 [transform:rotate(270deg)]"
          >
            <UpArrowheadIcon />
          </button>
        </div>
        <div className="flex flex-col items-center">
          <div>
            <p className="text-sm text-slate-400 mb-4">
              {`${singleProducts.product_author.profile?.name}`}
            </p>
          </div>
          <div className="flex flex-row items-end gap-2">
            <h2 className="text-6xl capitalize">{`${singleProducts.product_title}`}</h2>
            <p className="text-slate-400 italic">{`s.p.${new Date(
              singleProducts.product_date || ""
            ).getFullYear()}`}</p>
          </div>
        </div>

        <section className="grid mt-12  grid-cols-4 items-center gap-8">
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-xs text-slate-400">Price</p>
              <p className="font-bold text-xl">{`$${singleProducts.product_price.toLocaleString()}`}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">About</p>
              <p className="text-sm">{singleProducts.product_about}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Dimension</p>
              <p>{`${singleProducts.dimensions?.height} X ${singleProducts.dimensions?.width} ${
                singleProducts.dimensions?.unit || "cm"
              } `}</p>
            </div>
            <div className="">
              <button className=" bg-blue-600 hover:bg-blue-800 px-6 text-white flex justify-between items-center  rounded-full cursor-pointer py-4 w-full  ">
                <p>Purchase</p>
                <span className="w-5 h-5 flex [transform:rotate(270deg)]">
                  <DownArrowheadIcon />
                </span>
              </button>
            </div>
          </div>
          <div className="relative group col-span-2">
            <div className="w-full h-[500px] ">
              <img
                src={isImageselected ? isImageselected : singleProducts?.product_image[0]}
                width={200}
                height={200}
                alt="poster"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="hidden group-hover:flex h-full w-full absolute top-0 bg-black/30"></div>
          </div>
          <div className="flex flex-col gap-4">
            {/* <div>
            <p className="text-xs text-slate-400">Medium</p>
            <p>{singleProducts.medium}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Style</p>
            <p>{singleProducts.style || "style"}</p>
          </div> */}

            {singleProducts.product_image.length > 1 ? (
              <ul className="flex flex-col gap-4 justify-center items-center">
                {singleProducts.product_image.map((image, index) => (
                  <li
                    key={index}
                    role="button"
                    onClick={() => handleSelectImage(image)}
                    className={`cursor-pointer ${
                      isImageselected === image ? "ring-2 ring-offset-4 ring-gray-300" : ""
                    }`}
                  >
                    <img src={image} width={120} height={120} alt={`artwork painting-${index}`} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <button className="cursor-pointer px-6 py-3 bg-black rounded-full w-full text-white">
                  Purchase
                </button>
                {!isSaved && (
                  <button className="cursor-pointer px-6 py-3 border border-black rounded-full w-full text-black">
                    Save for later
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
