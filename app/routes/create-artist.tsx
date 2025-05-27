import { Form } from "react-router";
import { ROLE_LIST } from "~/server/configs/role";

export default function CreateArtist() {
  return (
    <Form method="post">
      <div>
        <label htmlFor="username">Fulllname</label>
        <input type="text" name="username" id="username" placeholder="username" />
      </div>

      <div>
        <label htmlFor="email">email</label>
        <input type="email" name="email" id="email" placeholder="email" />
      </div>

      <div>
        <label htmlFor="password">password</label>
        <input type="password" name="password" id="password" placeholder="Statement" />
      </div>

      <div>
        <label htmlFor="bio">Statement</label>
        <input type="hidden" name="role" id="role" value={ROLE_LIST.artist} />
      </div>

      <button type="submit">Create Artist</button>
    </Form>
  );
}
