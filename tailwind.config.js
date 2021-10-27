module.exports = {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    `./pages/**/*.vue`,
    "./plugins/**/*.{js,ts}",
    `nuxt.config.{js,ts}`
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'site-theme': {
          light: '#90A4AE',
          DEFAULT: '#546E7A',
          dark: '#263238',
        },
        'site-black': {
          DEFAULT: '#333333',
          theme: '#18191c',
          back: '#1e2023'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
