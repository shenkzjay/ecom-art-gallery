import type { Route } from "./+types/collection";
import { getSession } from "~/utils/session";
import { getUser } from "~/queries/get-user";
import { getPurchasedItems } from "~/queries/get-purchasedItems";
import ArtworkCard from "~/components/ArtworkCard";

import type { CategoryType } from "~/server/models/category";
import type { UserType } from "~/server/models/user";
import type { ProductType } from "~/server/models/product";

// Type for each item in purchasedItems array
export interface PurchasedItemType {
  productId: {
    _id: string;
    product_title: string;
    product_about: string;
    product_image: string[];
    product_author: UserType;
  };
  purchasedAt: Date;
  id: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  const sessionId = session?._id;

  const user = await getUser(sessionId || "");

  const userId = user?._id;

  const collections = await getPurchasedItems(userId || "");

  return { collections };
}

const UserCollections = ({ loaderData }: Route.ComponentProps) => {
  const { collections } = loaderData;

  const typedCollections = collections as unknown as PurchasedItemType[];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 md:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Art Collections</h1>
        <div className="space-y-8">
          <ul className="columns-4 gap-8 space-y-8">
            {typedCollections?.map((collection, index) => (
              <li key={`${collection.id}-${index}`} className="break-inside-avoid mb-8 rounded-lg">
                <img src={collection.productId.product_image[0]} width={300} height={300} />
                <p>{collection.productId.product_title}</p>
                <p>{collection.productId.product_about}</p>
                <p>sold on:{collection.purchasedAt.toDateString()}</p>
                <p>sold by:{collection.productId.product_author?.profile?.name || "Unknown"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserCollections;
