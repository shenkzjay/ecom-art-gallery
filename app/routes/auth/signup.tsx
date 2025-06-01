import { ConnectToDatabase } from "~/db/db.server";
import User from "~/server/models/user";
import { hashPassword, setSession } from "~/utils/session";
import type { Route } from "./+types/signup";
import { ROLE_LIST } from "~/server/configs/role";
import { Form, redirect } from "react-router";
import { useState } from "react";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // const roleString = Number(formData.get("role"));
  const signup = Number(formData.get("signup"));

  try {
    const passwordHash = await hashPassword(password);

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).lean();
    if (existingUser) {
      return {
        message: "Duplicate user found",
        success: false,
      };
    }
    const createUser = new User({
      profile: {
        name: username as string,
      },
      email: email.toLowerCase(),
      passwordHash,
      roles: [signup],
    });

    await createUser.save();

    const createUserObj = createUser.toObject();

    const userForSession = {
      _id: createUserObj._id.toString(),
      email: createUserObj.email,
      passwordHash: createUserObj.passwordHash,
      roles: createUserObj.roles || [ROLE_LIST.buyer],
      activeRole: signup,
    };

    const cookiesession = await setSession(userForSession);
    return redirect("/", {
      headers: {
        "Set-Cookie": cookiesession,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      message: `Failed to create an new user: ${error}`,
      success: false,
    };
  }
}

export default function Signup() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg  w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <Form method="post">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 sr-only"
              htmlFor="username"
            >
              Name
            </label>
            <input
              autoFocus
              className="w-full px-3 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="username"
              type="text"
              name="username"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 sr-only" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-slate-200 rounded-2xl  focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 sr-only"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col gap-6 justify-between">
            <div className="flex justify-between gap-6 md:gap-0 mt-2">
              <input
                className="hidden"
                type="radio"
                name="signup"
                id="buyer"
                defaultValue={ROLE_LIST.buyer}
                onChange={handleOptionChange}
                checked={selectedOption === "buyer"}
              />
              <label
                htmlFor="buyer"
                className={`border-2 cursor-pointer ${
                  selectedOption === "buyer" ? "text-blue-500" : "text-slate-400"
                }  py-3 px-4 rounded-xl text-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedOption === "buyer" ? "border-blue-500" : "border-slate-200"
                }`}
              >
                I want to <i className="font-bold text-[sandybrown]">Buy</i> artwork
              </label>

              <input
                className="hidden"
                type="radio"
                name="signup"
                id="artist"
                defaultValue={ROLE_LIST.artist}
                onChange={handleOptionChange}
                checked={selectedOption === "artist"}
              />
              <label
                htmlFor="artist"
                className={`border-2 cursor-pointer ${
                  selectedOption === "artist" ? "text-blue-500" : "text-slate-400"
                } text-blue-500 py-3 px-4 rounded-xl text-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedOption === "artist" ? "border-blue-500" : "border-slate-200"
                }`}
              >
                I want to <i className="font-bold text-[sandybrown]">Sell</i> artwork
              </label>
            </div>
            {/* <div className="flex gap-6 items-center">
              <span className="border  border-slate-200 flex h-0 w-full"></span>
              <p>or</p>
              <span className="border h-0 border-slate-200  w-full"></span>
            </div> */}
            <button
              className=" cursor-pointer w-full border-2 bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="submit"
            >
              <p>Sign up</p>
            </button>
          </div>
        </Form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-slate-500 hover:underline">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
