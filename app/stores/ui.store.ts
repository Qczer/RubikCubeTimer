import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const isModalOpen = ref(false)

  return {
    isModalOpen
  }
})
