import { Form, NavLink, useNavigate } from "react-router";
import { setSession, comparePassword } from "~/utils/session";
import { ROLE_LIST } from "~/server/configs/role";
import type { Route } from "./+types/login";
import User from "~/server/models/user";
import { redirect } from "react-router";
import { ConnectToDatabase } from "~/db/db.server";
import { clearCache } from "~/utils/cache.server";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();
  const formdata = await request.formData();

  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  const user = await User.findOne({
    email: email,
  }).select("+passwordHash");

  if (!user) {
    return {
      message: "No user found. Please sign up to continue",
      success: false,
    };
  }

  if (!user?.passwordHash || !user.email) {
    return {
      message: "Invalid username and password",
      success: false,
    };
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    return {
      message: "Invalid username and password",
      success: false,
    };
  }

  await clearCache("user");

  const userObj = user.toObject();

  const userForSession = {
    _id: userObj._id.toString(),
    email: userObj.email,
    passwordHash: userObj.passwordHash,
    roles: userObj.roles || [ROLE_LIST.buyer],
  };

  const cookiesession = await setSession(userForSession);

  return redirect("/", {
    headers: {
      "Set-Cookie": cookiesession,
    },
  });
}

export default function Login() {
  return (
    <section className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg w-full md:max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              className="w-full px-3 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="password"
              id="password"
              className="w-full px-3 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
          >
            Sign Up
          </button>
        </Form>

        <div className="mt-4 text-center">
          Not yet signed up?{" "}
          <NavLink to={"/signup"} className="text-blue-600 hover:text-blue-500">
            Sign up
          </NavLink>
        </div>
      </div>
    </section>
  );
}
