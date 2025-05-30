import type { Route } from "./+types/category";
import Category from "~/server/models/category";
import { redirect, useFetcher } from "react-router";
import { ConnectToDatabase } from "~/db/db.server";
import { Form } from "react-router";
import { clearCache, getCached, setInCached } from "~/utils/cache.server";
import { useState, useRef, useEffect } from "react";
import { Modals } from "~/components/modals";
import { SearchIcon } from "public/icons/search";
import { getSession } from "~/utils/session";
import { getAllCategories } from "~/queries/get-all-cat";
import { ROLE_LIST } from "~/server/configs/role";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();
  let formData = await request.formData();

  let category = formData.get("category");

  let query = formData.get("_query");

  if (query === "create") {
    try {
      const newCategory = new Category({
        categoryName: category,
      });

      await newCategory.save();

      await clearCache("categories");

      return {
        message: "new category successfully created",
      };
    } catch (error) {
      console.error(`Error creating new category; ${error}`);
      return;
    }
  }

  if (query === "edit") {
    const editCategory = formData.get("edit-category");
    const editCategoryId = formData.get("edit-category-id");

    await clearCache("categories");

    const updated = await Category.findByIdAndUpdate(editCategoryId, {
      categoryName: editCategory,
    });

    if (!updated) {
      return {
        message: "Failed to update category",
        success: false,
      };
    }

    return {
      message: "Category Successfully updated",
      success: true,
    };
  }

  if (query === "delete") {
    const deleteCategoryId = formData.get("delete-category-id");

    await clearCache("categories");

    const _deleteCategory = await Category.findByIdAndDelete(deleteCategoryId);

    if (!_deleteCategory) {
      return {
        message: "Failed to delete category",
        success: false,
      };
    }

    return {
      message: "Category Successfully deleted",
      success: true,
    };
  }
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (!session || !session.roles?.includes(ROLE_LIST.Admin)) {
    throw redirect("/");
  }

  await ConnectToDatabase();

  const cachedCategories = getCached<{ id: string; categoryName: string }[]>("categories");

  if (cachedCategories) {
    return {
      allCategories: cachedCategories,
    };
  }

  try {
    const serialized = await getAllCategories();
    setInCached("categories", serialized);

    return { allCategories: serialized };
  } catch (error: any) {
    console.error(`error trying to retrieve categories: ${error}`);
    throw new Error("Not Found");
  }
}

export default function CreateProduct({ loaderData }: Route.ComponentProps) {
  const createfetcher = useFetcher();
  const editfetcher = useFetcher();
  const deletefetcher = useFetcher();

  const { allCategories } = loaderData;

  console.log(allCategories, "clinet");

  const [isEditing, setIsEditing] = useState(false);
  const [isCategory, setIscategory] = useState<{ id: string; categoryName: string } | null>(null);
  const editRef = useRef<HTMLDialogElement | null>(null);
  const editFormRef = useRef<HTMLFormElement | null>(null);
  const deleteRef = useRef<HTMLDialogElement | null>(null);
  const deleteFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (editfetcher.state === "idle" && editfetcher.data?.success) {
      handleCloseEditModal();
    }

    if (deletefetcher.state === "idle" && deletefetcher.data?.success) {
      handleCloseDeleteModal();
    }
  }, [editfetcher.state, editfetcher.data, deletefetcher.state, deletefetcher.data]);

  const handleOpenEditModal = (index: number) => {
    console.log("hello");
    console.log({ index });

    const currentCategory = allCategories[index];

    setIscategory(currentCategory);

    setIsEditing(true);

    if (editRef.current) {
      editRef.current.showModal();
    }

    editFormRef.current?.reset();
  };

  const handleCloseEditModal = () => {
    editRef.current?.close();
    setIscategory(null);
    editFormRef.current?.reset();
  };

  const handleCloseDeleteModal = () => {
    deleteRef.current?.close();
    setIscategory(null);
    editFormRef.current?.reset();
  };

  const handleDeleteModal = (index: number) => {
    const deleteCategory = allCategories[index];

    setIscategory(deleteCategory);

    if (deleteRef.current) {
      deleteRef.current.showModal();
    }

    deleteFormRef.current?.reset();
  };

  console.log({ isCategory });

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold">Create product</h2>

      <section className="">
        <div className="text-sm relative flex gap-2">
          <label
            htmlFor="search_category"
            className="sr-only"
            aria-label="category searchbox"
          ></label>
          <span className="w-4 h-4 absolute flex [transform:translate(50%,60%)]">
            <SearchIcon />
          </span>
          <input
            type="text"
            name="search-category"
            id="search-category"
            placeholder="Enter text to search for category"
            className="outline outline-slate-200 rounded-xl w-1/2 pl-8 "
          />
        </div>
      </section>

      <createfetcher.Form method="post" className="mt-4">
        <label htmlFor="category">category</label>
        <input type="text" name="category" id="category" className="border" required />
        <input type="hidden" name="_query" id="_query" value="create" />
        <button type="submit">
          {" "}
          {createfetcher.state !== "idle" ? "Loading..." : "Create Category"}
        </button>
      </createfetcher.Form>

      {allCategories.length > 0 ? (
        <ul>
          {allCategories.map((category, index) => (
            <li key={index} className="grid grid-cols-6">
              <p>{category?.categoryName}</p>

              <button type="button" onClick={() => handleOpenEditModal(index)}>
                Edit
              </button>

              <button type="button" onClick={() => handleDeleteModal(index)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories found.</p>
      )}

      <Modals ref={editRef} handleCloseModal={handleCloseEditModal}>
        <div className="">
          <editfetcher.Form method="post" ref={editFormRef}>
            <label htmlFor="edit-category"></label>
            <input
              type="text"
              name="edit-category"
              id="edit-category"
              defaultValue={isCategory?.categoryName}
            />
            <input
              type="hidden"
              name="edit-category-id"
              id="edit-category-id"
              defaultValue={isCategory?.id}
            />
            <input type="hidden" name="_query" id="_query" value="edit" />
            <button type="submit">Edit category</button>
          </editfetcher.Form>
        </div>
      </Modals>

      <Modals ref={deleteRef} handleCloseModal={handleCloseDeleteModal}>
        <p>
          Do you want to delete the category <i>{isCategory?.categoryName}</i>
        </p>
        <div>
          <button onClick={() => handleCloseDeleteModal()}>No</button>

          <deletefetcher.Form method="post">
            <input type="hidden" name="_query" id="_query" value="delete" />
            <input
              type="hidden"
              name="delete-category-id"
              id="delete-category-id"
              defaultValue={isCategory?.id}
            />
            <button type="submit">Yes</button>
          </deletefetcher.Form>
        </div>
      </Modals>
    </section>
  );
}
