import { Form, Link, NavLink, redirect } from "react-router";
import { type SessionData } from "~/utils/session";
import type { UserType } from "~/server/models/user";
import type { Route } from "../../layouts/+types/mainlayout";
import Dropdown from "../dropdown/dropdown";
import { getRoleName } from "~/utils/roleMap";
import { ROLE_LIST } from "~/server/configs/role";

interface NavbarProps {
  user: UserType | null;
}

export function Navbar({ user }: NavbarProps) {
  console.log(user, "nav");

  const role = user?.roles[0];

  const roleName = getRoleName(role);

  return (
    <nav className="flex flex-row justify-between">
      <ul className="flex flex-row gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/artist">Artist</Link>
        </li>
        <li>
          <Link to="/buy">Buy</Link>
        </li>
        <li>event</li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>

      {user ? (
        <ul className="flex flex-row gap-4">
          {user.roles[0] === ROLE_LIST.Admin ? (
            <li>
              <Dropdown label={user.profile?.name || ""}>
                <p>{roleName}</p>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <p></p>
                </div>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>

                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </Form>
              </Dropdown>
            </li>
          ) : user.roles[0] === ROLE_LIST.artist ? (
            <li>
              <Dropdown label={user.profile?.name || ""}>
                <p>{roleName}</p>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <NavLink
                  to="/artwork"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Artwork
                </NavLink>
                <div className="flex justify-between items-center px-4">
                  <a
                    href="/settings"
                    className="block py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Saved
                  </a>
                  {user.savedItems.length > 0 && (
                    <span className="w-5 h-5 bg-orange-200 rounded-full flex items-center justify-center">
                      <p className="text-[10px] text-orange-600 font-bold ">
                        {user.savedItems.length || ""}
                      </p>
                    </span>
                  )}
                </div>

                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </Form>
              </Dropdown>
            </li>
          ) : (
            <li>
              <Dropdown label={user.profile?.name || ""}>
                <p>{roleName}</p>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>

                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>

                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </Form>
              </Dropdown>
            </li>
          )}
        </ul>
      ) : (
        <ul className="flex flex-row gap-4">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign up</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
