import type en from './locales/en'

export type TranslationType = typeof en

export default {
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  availableLocales: ['en', 'pl'],
  globalInjection: true
}
