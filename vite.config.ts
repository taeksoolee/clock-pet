import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://clock-pet.taeksoolee.com 루트에서 서비스된다 (GitHub Pages 커스텀 도메인)
export default defineConfig({
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
        start_url: '/',
        scope: '/',
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
