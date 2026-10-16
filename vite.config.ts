import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/velora/",
  plugins: [react()],
  server: { port: 5173, strictPort: false, allowedHosts: [".trycloudflare.com"] },
  preview: { port: 5173, strictPort: false, allowedHosts: [".trycloudflare.com"] },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ["gsap", "@gsap/react"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
