import { defineStore } from 'pinia'
import type { Solve } from '~/types/solve'
import { useSessionsStore } from './sessions.store'
import { useSettingsStore } from './settings.store'

const getCurrentPuzzleSolves = () => {
  const sessions = useSessionsStore()
  const settings = useSettingsStore()
  const session = sessions.ensureCurrentSession()
  const puzzle = settings.timer.puzzle as keyof typeof session.solves

  if (puzzle in session.solves) {
    session.solves[puzzle] ??= []
    return session.solves[puzzle]
  }

  settings.timer.puzzle = '333'
  session.solves['333'] ??= []

  return session.solves['333']
}

export const useSolvesStore = defineStore('solves', {
  getters: {
    solves: () => getCurrentPuzzleSolves()
  },

  actions: {
    addSolve(solve: Solve) {
      getCurrentPuzzleSolves().push(solve)
    },

    removeSolve(solve: Solve) {
      const solves = getCurrentPuzzleSolves()
      const settings = useSettingsStore()

      if (settings.timer.confirmDelete) {
        if (!confirm('Na pewno chcesz usunąć ten element?')) return
      }

      solves.splice(0, solves.length, ...solves.filter((s) => s !== solve))
    },

    togglePlusTwo(solve: Solve) {
      solve.plusTwo = !solve.plusTwo
    },

    toggleDNF(solve: Solve) {
      solve.DNF = !solve.DNF
    }
  },

  persist: true
})
