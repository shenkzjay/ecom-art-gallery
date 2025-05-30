import React from "react";
import { mockCollections } from "~/utils/mockCollections";
import type { Route } from "./+types/collection";
import { getSession } from "~/utils/session";
import { getUser } from "~/queries/get-user";
import { getPurchasedItems } from "~/queries/get-purchasedItems";

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

  console.log(collections);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Art Collections</h1>
        <div className="space-y-8">
          {/* {collections?.map((collection, index) => (
            <div key={index} className=" rounded-lg  overflow-hidden">
              <div className="p-4">
                <h2 className="text-2xl font-semibold text-gray-900">{collection.licenseType}</h2>
                <p className="text-gray-500">{collection.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4">
                {collection.artworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default UserCollections;
