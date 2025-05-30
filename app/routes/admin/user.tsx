import { Form, redirect } from "react-router";
import type { Route } from "./+types/user";
import { getSession, hashPassword, setSession } from "~/utils/session";
import User from "~/server/models/user";
import { ROLE_LIST } from "~/server/configs/role";
import { ConnectToDatabase } from "~/db/db.server";

export async function action({ request }: Route.ActionArgs) {
  await ConnectToDatabase();
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const roleString = Number(formData.get("role"));

  const passwordHash = await hashPassword(password);

  try {
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
      roles: [roleString],
    });

    await createUser.save();

    const createUserObj = createUser.toObject();

    const userForSession = {
      _id: createUserObj._id.toString(),
      email: createUserObj.email,
      passwordHash: createUserObj.passwordHash,
      roles: createUserObj.roles || [ROLE_LIST.buyer],
    };

    console.log(createUser);

    const cookiesession = await setSession(userForSession);

    return redirect("/admin/home", {
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

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (!session || !session.roles?.includes(ROLE_LIST.Admin)) {
    throw redirect("/");
  }
}

export default function CreateUser() {
  return (
    <Form method="post">
      <h3>Create users</h3>
      <div>
        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <input type="username" name="username" id="username" placeholder="Username" required />
      </div>
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input type="email" name="email" id="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password" className="sr-only">
          password
        </label>
        <input type="password" name="password" id="password" placeholder="password" required />
      </div>

      <div className="flex flex-row">
        <div>
          <label htmlFor="username" className="">
            Artist
          </label>
          <input type="radio" name="role" id="Artist" value={ROLE_LIST.artist} />
        </div>
        <div>
          <label htmlFor="admin" className="">
            Admin
          </label>
          <input type="radio" name="role" id="admin" value={ROLE_LIST.Admin} />
        </div>
        <div>
          <label htmlFor="admin" className="">
            user
          </label>
          <input type="radio" name="role" id="buyer" value={ROLE_LIST.buyer} />
        </div>
      </div>

      <button type="submit">Create User</button>
    </Form>
  );
}
