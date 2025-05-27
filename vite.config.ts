import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: {
    "process.env.SESSION_SECRET": JSON.stringify(process.env.SESSION_SECRET),
    "process.env.MONGODB_URI": JSON.stringify(process.env.MONGODB_URI),
  },
});
