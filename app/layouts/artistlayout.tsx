import { CategoryIcon } from "public/icons/category";
import { DownArrowheadIcon } from "public/icons/down-arrowhead";
import { HomeIcon } from "public/icons/homeicon";
import { ProductIcon } from "public/icons/product";
import { SearchIcon } from "public/icons/search";
import { SettingsIcon } from "public/icons/settings";
import { UpArrowheadIcon } from "public/icons/up-arrowhead";
import { NavLink, Outlet } from "react-router";
import { ArtistIcon } from "~/routes/admin/artist";
import type { Route } from "./+types/admin-sidebar";
import { getSession } from "~/utils/session";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  // const existingSession = await getSession(request);
  // if (!existingSession) {
  //   return redirect("/login");
  // }
  // return { existingSession };
}

export default function ArtistLayout({ loaderData }: Route.ComponentProps) {
  // const { existingSession } = loaderData;
  // console.log({ existingSession });

  return (
    <section className="flex flex-row">
      <nav className="w-1/5 min-h-screen border-r border-r-slate-200 flex flex-col justify-between p-4">
        <ul className="flex flex-col gap-2 text-sm">
          <li className=" relative group">
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
          </li>
          <li className="flex flex-row gap-2 mt-4 hover:bg-slate-100 px-2 rounded-xl items-center">
            <span>
              <HomeIcon />
            </span>
            <NavLink to={"admin/home"} className="w-full p-2">
              Home
            </NavLink>
          </li>

          <li className="flex flex-row gap-2 hover:bg-slate-100 px-2 rounded-xl items-center">
            <span>
              <CategoryIcon />
            </span>
            <NavLink to={"admin/category"} className="w-full p-2">
              Product
            </NavLink>
          </li>
          <li className="flex flex-row gap-2 hover:bg-slate-100 px-2 rounded-xl items-center">
            <span>
              <ArtistIcon />
            </span>
            <NavLink to={"admin/category"} className="w-full p-2">
              Artist
            </NavLink>
          </li>
          <li className="flex flex-row gap-2 hover:bg-slate-100 px-2 rounded-xl items-center">
            <span>
              <ProductIcon />
            </span>
            <NavLink to={"admin/category"} className="w-full p-2">
              Category
            </NavLink>
          </li>
          <li>
            <NavLink to={"about"} className="w-full p-2">
              Purchase
            </NavLink>
          </li>
        </ul>

        <ul className="flex flex-col gap-6 text-sm ">
          <li className="flex flex-row gap-2 hover:bg-slate-100 rounded-xl px-2 items-center">
            <span>
              <SettingsIcon />
            </span>
            <NavLink to={"admin/settings"} className="w-full p-2">
              Settings
            </NavLink>
          </li>

          <li className="flex flex-row  bg-slate-100 justify-between items-center py-4 px-4 rounded-xl gap-0">
            <div className=" flex ">
              <span className="border rounded-full min-h-11 w-11 bg-slate-100"></span>
            </div>
            <div>
              <p>ExampleName</p>
              <p className="text-xs">example@example.com</p>
            </div>
            <button className="flex flex-col justify-center">
              <span className="w-4 h-4 ">
                <UpArrowheadIcon />
              </span>
              <span className="w-4 h-4 ">
                {" "}
                <DownArrowheadIcon />
              </span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="w-full">
        <Outlet />
      </div>
    </section>
  );
}
