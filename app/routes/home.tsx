import type { Route } from "./+types/home";
import { Welcome } from "../pages/welcome";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home page" }, { name: "description", content: "Artwork homepage!" }];
}

export default function Home() {
  return <Welcome />;
}
