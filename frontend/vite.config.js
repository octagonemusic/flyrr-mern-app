import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["prismjs", "prismjs/themes/prism-tomorrow.css"],
  },
  build: {
    rollupOptions: {
      external: [
        /^prismjs\/.*/, // This tells Vite to externalize all Prism.js imports
      ],
    },
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
