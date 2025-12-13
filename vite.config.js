import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Needed for Vercel (keeps correct asset paths)
  base: "/",

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",

    // Fixes common React Testing Library errors
    css: false,
  },



  coverage: {
    provider: "v8",
    reporter: ["text", "html"],
    reportsDirectory: "./coverage",
  },

  
});
