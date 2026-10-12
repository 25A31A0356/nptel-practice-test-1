import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import express from "express";
import { createApiRouter } from "./server/api";

function vitePluginContestApi(): Plugin {
  return {
    name: "contest-api-server",
    configureServer(server: ViteDevServer) {
      const app = express();
      app.use(express.json());
      app.use("/api", createApiRouter());
      server.middlewares.use(app);
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), vitePluginContestApi()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
});
