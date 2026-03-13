import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const FLUIG_URL = env.VITE_BASE_URL || "https://federacaonacional130419.fluig.cloudtotvs.com.br";

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    preview: {
      port: 5125,
      open: true,
    },
    base: "/",
    server: {
      port: 5125,
      open: true,
      proxy: {
        "/api/public": {
          target: FLUIG_URL,
          changeOrigin: true,
          secure: true,
        },
        "/collaboration": {
          target: FLUIG_URL,
          changeOrigin: true,
          secure: true,
        },
        "/ecm-forms": {
          target: FLUIG_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path,
        },
        "/process-management/api": {
          target: FLUIG_URL,
          changeOrigin: true,
          secure: true,
        },
        "/content-management/api": {
          target: FLUIG_URL,
          changeOrigin: true,
          secure: true,
        },
        "/dataset/api": {
          target: FLUIG_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});

