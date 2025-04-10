/** @file Vite configuration. */
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
// eslint-disable-next-line import/no-unresolved
import tailwindcss from "@tailwindcss/vite"
import svgLoader from "vite-svg-loader"

export default defineConfig({
  plugins: [vue(), vueDevTools(), svgLoader(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
