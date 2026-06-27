// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Rubik Cube Timer',
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'reka-ui',
    'nuxt-svgo',
    'nuxt-lucide-icons'
  ],
  piniaPersistedstate: {
    storage: 'localStorage'
  },
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
  css: ['~/assets/css/tailwind.css'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'twisty-player'
    }
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@lucide/vue',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'canvas-confetti',
        'cubing/puzzles',
        'cubing/scramble',
        'cubing/twisty',
        'reka-ui',
        'vue3-apexcharts'
      ]
    }
  }
})
