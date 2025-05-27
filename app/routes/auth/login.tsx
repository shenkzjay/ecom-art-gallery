import { Form, NavLink, useNavigate } from "react-router";
import { setSession, comparePassword } from "~/utils/session";
import { ROLE_LIST } from "~/server/configs/role";
import type { Route } from "./+types/login";
import User from "~/server/models/user";
import { redirect } from "react-router";
import { ConnectToDatabase } from "~/db/db.server";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();
  const formdata = await request.formData();

  const email = formdata.get("email") as string;
  const password = formdata.get("password") as string;

  const user = await User.findOne({
    email: email,
  }).select("+passwordHash");

  console.log(user);

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

  console.log({ isPasswordValid });

  if (!isPasswordValid) {
    return {
      message: "Invalid username and password",
      success: false,
    };
  }

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
    <section className="flex flex-col justify-center items-center h-screen">
      <Form method="post" className="">
        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="email"
            className="border py-2 px-4 rounded-xl"
            required
          />
        </div>

        <div>
          <label htmlFor="Password" className="sr-only">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="password"
            id="password"
            className="border py-2 px-4 rounded-xl"
            required
          />
        </div>
        <button type="submit">Login</button>
      </Form>

      <div>
        Not yet Signed up? <NavLink to={"/signup"}>Sign up</NavLink>
      </div>
    </section>
  );
}
