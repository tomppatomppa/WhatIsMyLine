import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    assetsDir: 'static',
  },
  preview: {
    port: 5002,
    strictPort: true,
  },
  server: {
    watch: {
      usePolling: true,
    },
    port: 5002,
    strictPort: true,
    host: true,
    proxy: {
      '/api': 'http://localhost:5002',
    },
  },
  
});
