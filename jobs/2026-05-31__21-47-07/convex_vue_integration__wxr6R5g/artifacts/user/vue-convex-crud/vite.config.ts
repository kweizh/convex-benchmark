import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.ZEALT_RUN_ID': JSON.stringify(process.env.ZEALT_RUN_ID)
  }
})
