import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("layouts/admin-sidebar.tsx", [
    route("admin/home", "routes/admin/home.tsx"),
    route("admin/category", "routes/admin/category.tsx"),
    route("about", "routes/about.tsx"),
    route("admin/user", "routes/admin/user.tsx"),
  ]),

  layout("layouts/mainlayout.tsx", [
    index("routes/home.tsx"),
    route("artist", "routes/artists.tsx"),
    route("logout", "routes/logout.tsx"),
  ]),

  route("login", "routes/auth/login.tsx"),
  route("signup", "routes/auth/signup.tsx"),
] satisfies RouteConfig;
