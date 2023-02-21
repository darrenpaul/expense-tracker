// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  target: 'static',
  generate: { fallback: true },
  ssr: true,
  css: ['~/assets/css/global.scss'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    // Private keys are only available on the server
    pocketBaseUrl: process.env.POCKET_BASE_URL,
    public: {
      pocketBaseUrl: process.env.POCKET_BASE_URL,
    },
  },
})
