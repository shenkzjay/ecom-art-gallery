// import { Navbar } from "~/components/navbar/navbar";
import { Link } from "react-router";

export function Welcome() {
  return (
    <main>
      We go live
      <Link to="/admin/category">create product</Link>
    </main>
  );
}
