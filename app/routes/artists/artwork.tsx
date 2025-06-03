import { InsightIcon } from "public/icons/insight";
import { MarketplaceIcon } from "public/icons/market";
import { TelegramArrow } from "public/icons/telegram-arrow";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/artwork";
import { ConnectToDatabase } from "~/db/db.server";
// import { getCached, setInCached } from "~/utils/cache.server";
import type { ProductType } from "~/server/models/product";
import { getAllProducts, type ProductFrontendType } from "~/queries/get-product";
import { getSession } from "~/utils/session";
import { getUser } from "~/queries/get-user";
import { ROLE_LIST } from "~/server/configs/role";
import { redirect } from "react-router";
import { SearchIcon } from "public/icons/search";
import { useRef, useState } from "react";
import { Modals } from "~/components/modals";
import Product from "~/server/models/product";
import { ProfileIcon } from "public/icons/profile";

export async function action({ request }: Route.ActionArgs) {
  const formdata = await request.formData();

  const query = formdata.get("_query");

  try {
    if (query === "admindelete") {
      const productId = formdata.get("delete-product") as string;

      const findProduct = await Product.findById(productId).lean();

      if (!findProduct) {
        throw new Error("Product not found");
      }

      if (findProduct.isSold || (findProduct.saleDetails && findProduct.saleDetails.length > 0)) {
        throw new Error("Cannot delete a sold product");
      }

      await Product.findByIdAndDelete(productId);

      return {
        message: "Delete successfull",
        success: true,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error trying to delete product");
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  await ConnectToDatabase();

  // const cachedProduct = getCached<ProductType[]>("product");

  // if (cachedProduct) {
  //   return {
  //     allProducts: cachedProduct,
  //   };
  // }

  const session = await getSession(request);

  if (
    !session ||
    (!session.roles?.includes(ROLE_LIST.Admin) && !session.roles?.includes(ROLE_LIST.artist))
  ) {
    throw redirect("/");
  }

  const sessionId = session?._id;

  const user = await getUser(sessionId || "");

  try {
    const products = await getAllProducts();

    // setInCached("product", products);

    return { allProducts: products, user };
  } catch (error) {
    console.error(`error trying to retrieve products: ${error}`);
    throw new Error("products Not Found");
  }
}

export default function artwork({ loaderData }: Route.ComponentProps) {
  const { allProducts, user } = loaderData;

  const filteredProduct = allProducts.filter(
    (product, _) => product.product_author.email === user?.email
  );

  const deletefetcher = useFetcher();

  const deleteRef = useRef<HTMLDialogElement | null>(null);

  const [isSelectProduct, setIsSelectProduct] = useState<ProductFrontendType | null>(null);

  const handleCloseDeleteModal = () => {
    deleteRef.current?.close();
  };

  const handleOpenDeleteModal = (index: number) => {
    if (deleteRef.current) {
      deleteRef.current.showModal();
    }

    if (user?.roles.includes(ROLE_LIST.Admin)) {
      const selectedProduct = allProducts[index];

      //@ts-ignore
      setIsSelectProduct(selectedProduct);
    }

    if (user?.roles.includes(ROLE_LIST.artist)) {
      const selectedProduct = filteredProduct[index];

      //@ts-ignore
      setIsSelectProduct(selectedProduct);
    }
  };

  return (
    <section className="mb-20">
      <div className="flex md:flex-row flex-col md:justify-between md:container md:mx-auto mt-10">
        <div className="flex items-center gap-6 mx-6 md:mx-0  ">
          <div className="border rounded-full flex md:w-24 md:h-24 w-12 h-12 justify-center items-center ">
            <span className="block text-black w-10 h-10">
              <ProfileIcon />
            </span>
          </div>
          <div>
            <p className="text-2xl ">{user?.profile?.name}</p>
            <p className="text-slate-500">{user?.profile?.bio}</p>
          </div>
        </div>
        <div className="flex gap-4 mx-6 md:mx-0 mt-4 w-full md:w-auto">
          <p>Profile</p>
          <p>settings</p>
        </div>
      </div>
      <div>
        <div className="flex md:flex-row flex-col  rounded-xl my-12 bg-[#f7f7f7]">
          <div className="md:w-1/2 min-h-full p-6 flex flex-col justify-center items-center gap-6">
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
          <div className="md:w-1/2 flex justify-end">
            <img
              src="images/art9.webp"
              width={600}
              height={600}
              className=" w-full"
              alt="canvas painting of a white woman in the 80s sitting down"
            />
          </div>
        </div>
      </div>

      <section className="container mx-auto w-[90vw]">
        <h3 className="text-2xl font-bold my-12">Art Collections</h3>

        <div>
          <div className="mb-10">
            <label htmlFor="search" aria-label="searchbox" className="sr-only "></label>
            <span className="absolute w-4 h-4 [transform:translate(50%,70%)] text-slate-400 group-focus-within:text-slate-500">
              <SearchIcon />
            </span>
            <input
              type="search"
              name="search"
              id="search"
              className=" border border-slate-200 py-2 pl-8 rounded-xl focus:border-slate-400 focus:outline-0"
              placeholder="Search..."
            />
          </div>

          <div></div>
        </div>

        <div className="overflow-x-scroll w-full">
          {user?.roles.includes(ROLE_LIST.Admin) ? (
            <table className="md:w-full text-sm">
              <thead className="bg-slate-100 ">
                <tr className="text-sm font-semibold text-slate-500">
                  <td className="p-4">S/N</td>
                  <td className="p-4">TITLE</td>
                  <td className="p-4">ARTWORK</td>
                  <td className="p-4">PRICE</td>
                  <td className="p-4">#</td>
                  <td className="p-4">#</td>
                </tr>
              </thead>
              <tbody>
                {allProducts.map((product, index) => (
                  <tr key={`${product._id}-${index}`} className="border-b border-slate-200">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">
                      <img
                        src={product.product_image[0]}
                        width={80}
                        height={80}
                        alt={`poster-${index}`}
                        className="h-12 w-12"
                      />
                    </td>
                    <td className="p-4">
                      {" "}
                      <p>{product.product_title}</p>
                      <p className="text-sm text-slate-400">
                        art by {product.product_author.profile?.name}
                      </p>
                    </td>

                    <td className="p-4">
                      {" "}
                      <p>{`$${product.product_price.toLocaleString()}`}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <button onClick={() => handleOpenDeleteModal(index)}>delete</button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <button></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="md:w-full text-sm">
              <thead className="bg-slate-100 ">
                <tr className="text-sm font-semibold text-slate-500">
                  <td className="p-4">S/N</td>
                  <td className="p-4">TITLE</td>
                  <td className="p-4">ARTWORK</td>
                  <td className="p-4">PRICE</td>
                  <td className="p-4">#</td>
                  <td className="p-4">#</td>
                </tr>
              </thead>
              <tbody>
                {filteredProduct.map((product, idx) => (
                  <tr key={`${product._id}-${idx}`} className="border-b border-slate-200">
                    <td className="p-4">{idx + 1}</td>
                    <td className="p-4">
                      <img
                        src={product.product_image[0]}
                        width={80}
                        height={80}
                        alt={`poster-${idx}`}
                        className="h-12 w-12"
                      />
                    </td>
                    <td className="p-4">
                      {" "}
                      <p>{product.product_title}</p>
                      <p className="text-sm text-slate-400">
                        art by {product.product_author.profile?.name}
                      </p>
                    </td>

                    <td className="p-4">
                      {" "}
                      <p>{`$${product.product_price.toLocaleString()}`}</p>
                    </td>
                    <td className="p-4">
                      <div>
                        <button onClick={() => handleOpenDeleteModal(idx)}>delete</button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <button></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Modals ref={deleteRef} handleCloseModal={handleCloseDeleteModal}>
          <p>
            Do you want to delete the this product?{" "}
            <i className="text-red-400">{isSelectProduct?.product_title}</i>
          </p>
          <div>
            <button onClick={() => handleCloseDeleteModal()}>No</button>

            <deletefetcher.Form method="post">
              <input type="hidden" name="_query" id="_query" value="admindelete" />
              <input
                type="hidden"
                name="delete-product"
                id="delete-product"
                defaultValue={isSelectProduct?.id}
              />
              <button type="submit" onClick={() => handleCloseDeleteModal()}>
                Yes
              </button>
            </deletefetcher.Form>
          </div>
        </Modals>
      </section>
    </section>
  );
}
