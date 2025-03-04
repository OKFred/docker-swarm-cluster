import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { loadEnv } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import path from "path";
import type { ConfigEnv, UserConfig } from "vite";
const pathSrc = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any;
  if (command === "build") {
    const { SERVER_URL } = process.env;
    env = { SERVER_URL };
  }
  env = { ...env, ...loadEnv(mode, process.cwd()) };
  const result = {
    resolve: {
      alias: {
        "@": pathSrc,
      },
    },
    server: { proxy: {} },
    plugins: [
      vue(),
      vueDevTools(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
    ],
  };
  if (mode === "development") {
    if (env.SERVER_URL|| env.VITE_SERVER_URL) {
      result.server.proxy = {
        "/api": {
          target: env.SERVER_URL || env.VITE_SERVER_URL,
          ws: false,
          changeOrigin: true,
          // rewrite: (path: string) => path.replace(new RegExp(`^/api`), ""),
        },
      };
    }
  }
  console.log(result.server)
  return result;
});
