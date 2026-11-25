import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // Keep build output separate from the /assets folder served by server.js
    assetsDir: "bundle",
  },
});
