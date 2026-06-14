import { defineStore } from 'pinia'
import { type UserSettings, defaultSettings } from '~/types/userSettings'

export const useSettingsStore = defineStore('store', {
  state: (): UserSettings => structuredClone(defaultSettings),
  persist: true
})
