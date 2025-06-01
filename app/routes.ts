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
    route("artwork", "routes/artists.tsx"),
    route("artwork/:artworkId", "routes/artists/artwork-details.tsx"),
    route("orders/:artworkId/shipping", "routes/order/shipping.tsx"),
    route("order/success", "routes/order/success.tsx"),
    route("order/order-history", "routes/order/order-history.tsx"),
    route("logout", "routes/auth/logout.tsx"),
    route("artist", "routes/artists/artwork.tsx"),
    route("artist/upload-artwork", "routes/artists/upload-artwork.tsx"),
    route("collection", "routes/user/collection.tsx"),
    route("guest-checkout", "routes/guest-checkout.tsx"),
  ]),

  route("login", "routes/auth/login.tsx"),
  route("signup", "routes/auth/signup.tsx"),
] satisfies RouteConfig;
