import { ConnectToDatabase } from "~/db/db.server";
import { clearSession } from "~/utils/session";
import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();

  return redirect("/", {
    headers: {
      "Set-Cookie": await clearSession(),
    },
  });
}

export default function Logout() {
  return <></>;
}
