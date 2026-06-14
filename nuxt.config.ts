// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'reka-ui',
    'nuxt-svgo'
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.ts', name: 'English' },
      { code: 'pl', iso: 'pl-PL', file: 'pl.ts', name: 'Polski' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },
  css: ['~/assets/css/main.css'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'twisty-player'
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        '@lucide/vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'canvas-confetti',
        'cubing/puzzles',
        'cubing/scramble',
        'cubing/twisty',
        'reka-ui'
      ]
    }
  }
})
