import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['13ea-125-62-124-27.ngrok-free.app','0b34-125-62-125-28.ngrok-free.app']
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})