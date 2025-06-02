import { Form, Link, NavLink, redirect } from "react-router";
import { useState } from "react";
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
  console.log(user?.savedItems, "nav");

  const [isOpen, setIsOpen] = useState(false);

  const role = user?.roles[0];

  const roleName = getRoleName(role);

  return (
    <nav className={`fixed top-0 w-full bg-white   z-50`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-0">
        <div className="flex justify-between h-12">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`block h-6 w-6 ${isOpen ? "hidden" : "block"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h10M4 18h16"
                  />
                </svg>
                <svg
                  className={`block h-6 w-6 ${isOpen ? "block" : "hidden"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                iArt
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </NavLink>
              <NavLink
                to="#collection"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Collection
              </NavLink>
              {/* <NavLink
                to="/buy"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Artist
              </NavLink>
              <NavLink
                to="/event"
                className="border-transparent pointer-events-none text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Fairs & Event
              </NavLink> */}
            </div>
          </div>
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="ml-4 flex items-center md:ml-6">
                <Dropdown label={user.profile?.name || ""}>
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p>{user.profile?.name || ""}</p>
                    <p className="text-xs text-slate-400">{roleName}</p>
                  </div>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  {user.roles[0] === ROLE_LIST.Admin && (
                    <>
                      <NavLink
                        to="/artist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Artwork
                      </NavLink>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </a>
                    </>
                  )}
                  {user.roles[0] === ROLE_LIST.artist && (
                    <>
                      <NavLink
                        to="/artist"
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
                    </>
                  )}
                  {user.roles[0] !== ROLE_LIST.Admin && user.roles[0] !== ROLE_LIST.artist && (
                    <>
                      <NavLink
                        to="/collection"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Collections
                      </NavLink>
                      <NavLink
                        to="order/order-history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Order
                      </NavLink>
                      <div className="flex justify-between items-center px-4 hover:bg-gray-100">
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
                    </>
                  )}
                  <Form method="post" action="/logout">
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log out
                    </button>
                  </Form>
                </Dropdown>
              </div>
            ) : (
              <div className="ml-4 flex items-center md:ml-6">
                <NavLink
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="ml-4 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </NavLink>
                {/* <NavLink
                  to="/guest-checkout"
                  className="ml-4 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Guest Checkout
                </NavLink> */}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/artist"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Artist
          </NavLink>
          <NavLink
            to="/buy"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Buy
          </NavLink>
          <NavLink
            to="/event"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Event
          </NavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="px-4 ">
              <Dropdown label={user.profile?.name || ""}>
                <p>{roleName}</p>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </a>
                {user.roles[0] === ROLE_LIST.Admin && (
                  <>
                    <NavLink
                      to="/artist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Artwork
                    </NavLink>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </a>
                  </>
                )}
                {user.roles[0] === ROLE_LIST.artist && (
                  <>
                    <NavLink
                      to="/artist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Artwork
                    </NavLink>
                    <div className="flex justify-between items-center px-4">
                      <a
                        href="/settings"
                        className="block py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
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
                  </>
                )}
                {user.roles[0] !== ROLE_LIST.Admin && user.roles[0] !== ROLE_LIST.artist && (
                  <>
                    <NavLink
                      to="/collection"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Collections
                    </NavLink>
                    <NavLink
                      to="/order/order-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Order
                    </NavLink>
                    <div className="flex justify-between items-center px-4 hover:bg-gray-100">
                      <a
                        href="/settings"
                        className="block py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
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
                  </>
                )}
                <Form method="post" action="/logout">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Log out
                  </button>
                </Form>
              </Dropdown>
            </div>
          ) : (
            <div className="px-4">
              <NavLink
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </NavLink>
              {/* <NavLink
                to="/guest-checkout"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Guest Checkout
              </NavLink> */}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
