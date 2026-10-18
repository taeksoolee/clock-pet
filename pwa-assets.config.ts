import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // iOS 홈 화면 아이콘은 투명 배경이 검게 보이므로 배경색을 채운다
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#fff8ee' } },
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#fff8ee' } },
  },
  images: ['public/pet.svg'],
})
