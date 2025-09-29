import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import vue from '@vitejs/plugin-vue'
const env = loadEnv("development", process.cwd(), "");
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    host: env.VITE_HOST,
    port: parseInt(env.VITE_PORT),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
