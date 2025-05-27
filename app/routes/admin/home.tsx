import { Form } from "react-router";

export default function AdminHome() {
  return (
    <section className="">
      <h2>Welcome</h2>
      <span className="border-t w-full flex border-slate-200"></span>

      <section className="grid grid-cols-[repeat(minmax(autofit,300px))]">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </section>

      <span className="border-t w-full flex border-slate-200"></span>

      <section>
        <Form action="admin/user" method="post">
          <button type="submit">Create User</button>
        </Form>
      </section>

      <section>
        <h3>Users table</h3>
        <div>
          <table className="w-full">
            <thead>
              <tr>
                <td>S/N</td>
                <td>Name</td>
                <td>Role</td>
                <td>Date created</td>
                <td>purchases</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Bella shurmda</td>
                <td>Benin boys</td>
                <td>Today</td>
                <td>12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
