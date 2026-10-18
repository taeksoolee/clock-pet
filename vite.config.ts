import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages는 https://<user>.github.io/clock-pet/ 하위 경로로 서비스된다
export default defineConfig({
  base: '/clock-pet/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'pet.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Clock Pet',
        short_name: 'Clock Pet',
        description: '초 단위까지 보여주는 귀여운 펫 시계',
        lang: 'ko',
        start_url: '/clock-pet/',
        scope: '/clock-pet/',
        display: 'standalone',
        background_color: '#fff8ee',
        theme_color: '#fff8ee',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})
