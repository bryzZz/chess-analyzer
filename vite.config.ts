/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react";

const serverConfig = (server: any) => {
  server.middlewares.use((_req: any, res: any, next: any) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
  });
};

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ["lila-stockfish-web/sf17-79.js"],
    },
  },
  plugins: [
    react(),
    {
      name: "configure-response-headers",
      configureServer: serverConfig,
      configurePreviewServer: serverConfig,
    },
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/lila-stockfish-web/sf17-79*",
          dest: "assets/stockfish/",
        },
      ],
    }),
  ],
  optimizeDeps: { exclude: ["lila-stockfish-web"] },
});
