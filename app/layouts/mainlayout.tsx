import { Outlet, redirect, useLoaderData } from "react-router";
import { Navbar } from "~/components/navbar/navbar";
import type { Route } from "./+types/mainlayout";
import { getSession } from "~/utils/session";
import User from "~/server/models/user";
import { ConnectToDatabase } from "~/db/db.server";
import type { UserType } from "~/server/models/user";
import { getUser } from "~/queries/get-user";
import { getCached } from "~/utils/cache.server";

interface MainLayoutLoaderData {
  user: UserType | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  await ConnectToDatabase();

  const cachedUser = getCached<{ id: string; categoryName: string }[]>("user");

  if (cachedUser) {
    return {
      user: cachedUser,
    };
  }
  const session = await getSession(request);

  const user = await getUser(session?._id || "");

  return { user };
}

export default function MainLayout({ loaderData }: Route.ComponentProps) {
  const { user } = useLoaderData<MainLayoutLoaderData>();

  return (
    <section className="relative">
      <Navbar user={user} />

      <div className="w-full pt-12">
        <Outlet />
      </div>
    </section>
  );
}
