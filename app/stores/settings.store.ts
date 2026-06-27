import { defineStore } from 'pinia'
import { type UserSettings } from '~/types/settings'

export const useSettingsStore = defineStore('settings', {
  state: (): UserSettings => ({
    timer: {
      session: 'New Session',
      puzzle: '333',
      decimalPoints: 2,
      freezeTime: 2,
      hideTime: false,
      hideLayout: true,
      zeroOutTime: false,
      confirmDelete: false,
      personalBestConfetti: true,
      inspection: {
        enabled: true,
        time: 15,
        autoStart: false
        //playSound: false
      }
    }
  }),

  persist: true
})
