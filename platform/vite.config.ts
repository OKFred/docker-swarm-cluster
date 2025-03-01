import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import path from "path";

const pathSrc = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    server: {
      host: "0.0.0.0",
    },
    plugins: [vue(), vueDevTools()],
  };
});
