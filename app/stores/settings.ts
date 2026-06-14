import { defineStore } from 'pinia'
import { type UserSettings, defaultSettings } from '~/types/settings'

export const useSettingsStore = defineStore('store', {
  state: (): UserSettings => structuredClone(defaultSettings),
  persist: true
})
