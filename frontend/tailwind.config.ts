// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  safelist: [
    'grid-cols-[1fr_160px_140px_160px_32px]',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config