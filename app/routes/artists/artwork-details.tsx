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

  console.log({ singleProducts });

  const navigate = useNavigate();

  return (
    <section className="bg-[#f7f7f7] p-6 h-[550px]">
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

      <section className="flex mt-12  items-center justify-around">
        <div className="">
          <div>
            <p className="text-xs text-slate-400">Price</p>
            <p>{singleProducts.product_price}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">About</p>
            <p>{singleProducts.product_about}</p>
          </div>

          <div>
            <p className="text-xs text-slate-400">Dimension</p>
            <p>{`${singleProducts.dimensions?.height} X ${singleProducts.dimensions?.width} ${
              singleProducts.dimensions?.unit || "cm"
            } `}</p>
          </div>
        </div>
        <div className="relative group">
          <div className="w-[500px] h-[500px]">
            <img
              src={singleProducts?.product_image[0]}
              width={250}
              height={250}
              alt="poster"
              className="w-full h-full"
            />
          </div>
          <div className="hidden group-hover:flex absolute top-0 bg-black text-white z-10 [transform:translate(5.5rem,50vh)] rounded-full py-4 px-6 gap-16">
            <button className=" text-sm cursor-pointer">Purchase</button>
            <span className="text-slate-400">|</span>
            <button className="text-sm cursor-pointer">Save for later</button>
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
        </div>
      </section>
    </section>
  );
}
