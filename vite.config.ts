// vite.config.ts
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vuetify({
      styles: { configFile: 'src/assets/styles/variables/_vuetify.scss' },
    }),
    Components({
      dirs: ['src/@core/components', 'src/components'],
      dts: true,
      resolvers: [
        name => (name === 'VueApexCharts' ? { name: 'default', from: 'vue3-apexcharts', as: 'VueApexCharts' } : undefined),
      ],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
      vueTemplate: true,
      ignore: ['useCookies', 'useStorage'],
    }),
    svgLoader(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/assets/styles/', import.meta.url)),
      '@configured-variables': fileURLToPath(new URL('./src/assets/styles/variables/_template.scss', import.meta.url)),
    },
  },
  server: {
    host: 'https://siramu-9ff58.ondigitalocean.app/siramu-api2',         // ⬅️ penting: gunakan 127.0.0.1 (bukan "localhost")
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://siramu-9ff58.ondigitalocean.app/siramu-api2', // ⬅️ URL Laravel kamu
        changeOrigin: true,
        // optional kalau backend butuh:
        // secure: false,
      },
    },
  },
  build: { chunkSizeWarningLimit: 5000 },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue'],
  },
})
