import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
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
      // Este proxy já estava funcionando para /api/public
      "/api/public": {
        target: "https://federacaonacional130419.fluig.cloudtotvs.com.br",
        changeOrigin: true, // Importante para que o servidor de destino veja a origem como sendo a dele
        secure: true, // Se seu Fluig usa HTTPS
      },
      // Adicione um proxy para a API de colaboração
      "/collaboration": {
        target: "https://federacaonacional130419.fluig.cloudtotvs.com.br",
        changeOrigin: true,
        secure: true,
      },
      // Adicione um proxy para a API de formulários
      "/ecm-forms": {
        target: "https://federacaonacional130419.fluig.cloudtotvs.com.br",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
      "/process-management/api": {
        target: "https://federacaonacional130419.fluig.cloudtotvs.com.br",
        changeOrigin: true,
        secure: true,
      },
      "/content-management/api": {
        target: "https://federacaonacional130419.fluig.cloudtotvs.com.br",
        changeOrigin: true,
        secure: true,
      },
      "/dataset/api": {
        target: "https://federacaonacional130419.fluig.cloudtotvs.com.br",
        changeOrigin: true,
        secure: true,
      },
      // Se houver outros prefixes como '/resources', adicione também
    },
  },
});
