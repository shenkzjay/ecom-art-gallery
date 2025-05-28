import { ConnectToDatabase } from "~/db/db.server";
import { clearSession } from "~/utils/session";
import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { clearCache } from "~/utils/cache.server";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();

  await clearCache("user");
  await clearCache("product");
  await clearCache("category");

  return redirect("/", {
    headers: {
      "Set-Cookie": await clearSession(),
    },
  });
}

export default function Logout() {
  return <></>;
}
