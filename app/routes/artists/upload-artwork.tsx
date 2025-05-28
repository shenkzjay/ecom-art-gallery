import { UploadIcon } from "public/icons/upload";
import { Form, redirect } from "react-router";
import type { Route } from "./+types/upload-artwork";
import { ConnectToDatabase } from "~/db/db.server";
import { UpArrowheadIcon } from "public/icons/up-arrowhead";
import { useNavigate } from "react-router";
import { put } from "@vercel/blob";
import type { ProductType } from "~/server/models/product";
import { getAllCategories } from "~/queries/get-all-cat";
import mongoose from "mongoose";
import { Mongoose } from "mongoose";
import { getUser } from "~/queries/get-user";
import { getSession } from "~/utils/session";
import { getAllArtist } from "~/queries/get-artist";
import Product from "~/server/models/product";
import { clearCache, setInCached } from "~/utils/cache.server";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();
  const formdata = await request.formData();

  const uploadfile = formdata.get("uploadfile") as File;

  let uploadFileUrl: string | null = null;

  try {
    if (uploadfile && uploadfile.size > 0) {
      const blob = await put(uploadfile.name, uploadfile, {
        access: "public",
        contentType: uploadfile.type,
      });

      uploadFileUrl = blob.url;

      console.log("file uploaded to vercel blobL", blob.url);
    }

    const productData = {
      product_title: formdata.get("product_title") as string,
      product_about: formdata.get("product_about") as string,
      product_price: Number(formdata.get("product_price")),
      dimensions: {
        width: Number(formdata.get("width")),
        height: Number(formdata.get("height")),
        depth: Number(formdata.get("depth")),
        unit: formdata.get("unit"),
      },
      product_date: new Date(formdata.get("product_date") as string),
      product_image: [uploadFileUrl || ""],
      product_category: new mongoose.Types.ObjectId(formdata.get("product_category") as string),
      product_author: new mongoose.Types.ObjectId(formdata.get("product_author") as string),
      medium: formdata.get("medium") as string,
    };

    console.log({ productData });

    const newProduct = new Product(productData);

    console.log({ newProduct });

    clearCache("product");
    clearCache("category");
    clearCache("user");

    await newProduct.save();

    return redirect("/artwork");
  } catch (error) {
    console.error(error);
    throw Error(`Error creating artwork: ${error}`);
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  await ConnectToDatabase();

  const session = await getSession(request);

  const [allCategories, user] = await Promise.all([
    getAllCategories(),
    getUser(session?._id || ""),
  ]);

  setInCached("category", allCategories);
  setInCached("user", user);

  return { allCategories, user };
}

export default function UploadArtwork({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const { allCategories, user } = loaderData;

  console.log({ user });

  return (
    <section>
      <div className="my-10 flex items-center gap-4">
        <button
          className=" w-5 h-5 [transform:rotate(270deg)] cursor-pointer"
          onClick={() => navigate(-1)}
          type="button"
        >
          <UpArrowheadIcon />
        </button>
        <h3 className="text-2xl ">Add Artwork details</h3>
      </div>
      <Form method="post" className="grid grid-cols-2 gap-12" encType="multipart/form-data">
        <div>
          <label htmlFor="product_title" className="sr-only"></label>
          <input
            type="text"
            name="product_title"
            id="product_title"
            className="border border-slate-300 py-2 px-4 rounded-xl w-full"
            placeholder="product_title"
          />
        </div>

        <div>
          <label htmlFor=" product_author" className="sr-only"></label>
          <input
            defaultValue={user?._id}
            type="text"
            name="product_author"
            id="product_author"
            placeholder="product_author"
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
          />
        </div>

        <div>
          <label htmlFor="product_date" className="text-slate-400 text-xs">
            {" "}
            Product date
          </label>
          <input
            type="date"
            name="product_date"
            id=" product_date"
            placeholder="product_date"
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
          />
        </div>
        <div>
          <label htmlFor=" style" className="sr-only"></label>
          <input
            type="text"
            name="style"
            id=" style"
            placeholder="style"
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
          />
        </div>
        <div>
          <label htmlFor=" medium" className="sr-only"></label>
          <input
            type="text"
            name="medium"
            id=" medium"
            placeholder="medium"
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label htmlFor=" height" className="sr-only"></label>
            <input
              type="text"
              name="height"
              id=" height"
              placeholder="height"
              className="border py-2 px-4 rounded-xl w-full border-slate-300 "
            />
          </div>
          <div>
            <label htmlFor=" width" className="sr-only"></label>
            <input
              type="text"
              name="width"
              id=" width"
              placeholder="width"
              className="border py-2 px-4 rounded-xl w-full border-slate-300 "
            />
          </div>
          <div>
            <label htmlFor=" depth" className="sr-only"></label>
            <input
              type="text"
              name="depth"
              id=" depth"
              placeholder="depth"
              className="border py-2 px-4 rounded-xl w-full border-slate-300 "
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <label htmlFor="inch" className="">
                in
              </label>
              <input type="radio" name="unit" id="inch" value="inch" />
            </div>
            <div className="flex items-center gap-1">
              <label htmlFor="centimeter" className="">
                cm
              </label>
              <input
                value="cm"
                type="radio"
                name="unit"
                id="centimeter"
                className="border py-2 px-4 rounded-xl w-full border-slate-300 "
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor=" product_price" className="sr-only"></label>
          <input
            type="number"
            name="product_price"
            id=" product_price"
            placeholder="product_price"
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
          />
        </div>

        <div>
          <label htmlFor="product_category" className="sr-only"></label>
          {/* <input
            type="text"
            name=" product_category"
            id=" product_category"
            placeholder="product_category"
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
          /> */}
          <select
            className="border py-2 px-4 rounded-xl w-full border-slate-300 "
            name="product_category"
          >
            <option value="">Select category</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
        <div className="grid col-span-2">
          <label htmlFor=" product_about" className="sr-only"></label>
          <textarea
            name="product_about"
            id=" product_about"
            rows={5}
            className="border py-2 px-4 rounded-xl w-full border-slate-300"
            placeholder="Note"
          ></textarea>
        </div>

        <div className=" upload-wrapper w-full relative col-span-2">
          <label className="sr-only">Upload file</label>
          <input
            required
            // onChange={(e) => handleFileUpload(e)}
            type="file"
            name="uploadfile"
            id="uploadfile"
            className=" absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer"
          />
          <div className="uploadzone w-full px-[30px] py-[50px] border border-dashed border-[#ccc] text-center bg-[#fff] [transition:_background-color_0.3s_ease-in-out] rounded-[10px]">
            <div className="default flex flex-col justify-center items-center gap-4">
              <figure className="w-10 h-10 bg-[#f4f4f4] flex flex-row items-center justify-center rounded-full">
                <UploadIcon />
              </figure>
              <pre className="text-[14px] text-wrap text-buttongray">
                <b className="text-primary">Click to upload</b> or drag and drop PNG,JPEG (max.
                10MB)
              </pre>
              <p className="text-buttongray text-[12px]">OR</p>
              <button
                type="button"
                className="px-8 py-2 font-semibold rounded-[10px] border-2 border-primary text-primary"
              >
                Browse Files
              </button>
            </div>
            <span className="success text-buttongray flex py-12 min-h-full ">
              Your file has been uploaded successfully
              <br />
              {/* <i className="text-primary">{}</i> */}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 px-4 py-4 w-1/3  rounded-full text-white mt-10 cursor-pointer"
        >
          Upload artwork
        </button>
      </Form>
    </section>
  );
}
