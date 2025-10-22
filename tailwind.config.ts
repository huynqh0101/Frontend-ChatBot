import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  plugins: [typography, tailwindcssAnimate],
}
export default config
