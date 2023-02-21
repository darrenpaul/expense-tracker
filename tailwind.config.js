/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `components/**/*.{vue,js,ts}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `app.vue`,
    `plugins/**/*.{js,ts}`,
    `nuxt.config.{js,ts}`,
  ],
  theme: {
    extend: {
      colors: {
        'theme-background': 'var(--background)',
        'theme-text': 'var(--text)',
        'theme-text-information': 'var(--text-information)',
        'theme-button-primary': 'var(--button-primary)',
        'theme-table-head': 'var(--table-head)',
        'theme-table-body': 'var(--table-body)',
        'theme-navigation': 'var(--navigation)',
      },
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
