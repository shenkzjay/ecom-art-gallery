import { InsightIcon } from "public/icons/insight";
import { MarketplaceIcon } from "public/icons/market";
import { TelegramArrow } from "public/icons/telegram-arrow";
import { Link } from "react-router";
import type { Route } from "./+types/artwork";
import { ConnectToDatabase } from "~/db/db.server";
import { getCached, setInCached } from "~/utils/cache.server";
import type { ProductType } from "~/server/models/product";
import { getAllProducts } from "~/queries/get-product";

export async function loader({ request }: Route.LoaderArgs) {
  await ConnectToDatabase();

  const cachedProduct = getCached<ProductType[]>("product");

  if (cachedProduct) {
    return {
      allProducts: cachedProduct,
    };
  }

  try {
    const products = await getAllProducts();

    setInCached("product", products);

    return { allProducts: products };
  } catch (error) {
    console.error(`error trying to retrieve products: ${error}`);
    throw new Error("products Not Found");
  }
}

export default function artwork({ loaderData }: Route.ComponentProps) {
  const { allProducts } = loaderData;

  console.log({ allProducts });

  return (
    <section>
      <div className="flex justify-between mt-12 bg-[#f7f7f7] p-8 rounded-2xl">
        <div className="flex items-center gap-6 ">
          <div className="border rounded-full flex w-24 h-24 justify-center items-center ">
            <span className="flex">Avatar</span>
          </div>
          <div>
            <p className="text-2xl ">Olajide seun</p>
            <p className="text-slate-500">This is my bio shit</p>
          </div>
        </div>
        <div className="flex gap-4">
          <p>Profile</p>
          <p>settings</p>
        </div>
      </div>
      <div>
        <div className="flex  rounded-xl my-12">
          <div className="w-1/2 min-h-full p-6 flex flex-col justify-center items-center gap-6">
            <div className="flex flex-col mt-0 ">
              <ul className="flex flex-col gap-6 ">
                <li>
                  {" "}
                  <h2 className="text-2xl font-bold ">Keep your inspiration alive!</h2>
                </li>
                <li className="flex items-center gap-4 text-slate-500">
                  <span className="w-10 h-10 grid text-amber-500  p-2 rounded-full bg-amber-100">
                    <TelegramArrow />
                  </span>
                  <p>Upload your artwork</p>
                </li>
                <li className="flex items-center gap-4 text-slate-500">
                  <span className="w-10 h-10 grid text-purple-500  p-2 rounded-full bg-purple-100">
                    <InsightIcon />
                  </span>
                  <p>Check for insights</p>
                </li>
                <li className="flex items-center gap-4 text-slate-500">
                  <span className="w-10 h-10 grid text-green-500  p-2 rounded-full bg-green-100">
                    <MarketplaceIcon />
                  </span>
                  <p>Sell with ease</p>
                </li>
              </ul>
              <Link to="/artist/upload-artwork">
                <button className="bg-blue-600 px-4 py-4   rounded-full text-white mt-10 cursor-pointer">
                  Upload artwork
                </button>
              </Link>
            </div>
          </div>
          <div className="w-1/2 flex justify-end">
            <img
              src="images/art9.webp"
              width={600}
              height={600}
              className="rounded-r-xl"
              alt="canvas painting of a white woman in the 80s sitting down"
            />
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-bold my-12">Collections</h3>
        <div className="flex gap-6 flex-wrap">
          {allProducts.map((product) => (
            <div key={product._id}>
              <div>
                <img src={product.product_image[0]} width={300} height={300} />
                <p>{product.product_title}</p>
                <p>{`$${product.product_price.toLocaleString()}`}</p>
              </div>
              <div>
                <button>save for later</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
