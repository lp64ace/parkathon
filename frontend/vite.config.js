import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        host: true,
        // allowedHosts: [".ngrok-free.app", ".ngrok.io"],
        port: 80,
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
    },
    preview: {
        port: 80,
    },
});
