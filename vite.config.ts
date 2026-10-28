import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Root deploy. A sub-path build is still possible with ATLAS_BASE=/words/
  base: process.env.ATLAS_BASE || "/",
  plugins: [react()],
  server: { port: 5188, strictPort: true },
  preview: { port: 5188, strictPort: true },
  build: { chunkSizeWarningLimit: 1200 },
});
