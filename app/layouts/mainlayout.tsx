import { Outlet, redirect, useLoaderData } from "react-router";
import { Navbar } from "~/components/navbar/navbar";
import type { Route } from "./+types/mainlayout";
import { getSession } from "~/utils/session";
import User from "~/server/models/user";
import { ConnectToDatabase } from "~/db/db.server";
import type { UserType } from "~/server/models/user";

interface MainLayoutLoaderData {
  user: UserType | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  await ConnectToDatabase();
  const session = await getSession(request);

  let user = null;

  if (session?._id) {
    const userData = await User.findById(session._id).lean();
    if (userData) {
      user = {
        ...userData,
        _id: userData._id.toString(),
      };
    }
  }

  return { user };
}

export default function MainLayout({ loaderData }: Route.ComponentProps) {
  const { user } = useLoaderData<MainLayoutLoaderData>();

  return (
    <section className="">
      <Navbar user={user} />

      <div className="w-full">
        <Outlet />
      </div>
    </section>
  );
}
