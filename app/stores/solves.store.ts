import { defineStore } from 'pinia'
import type { Solve } from '~/types/solve'
import { useSessionsStore } from './sessions.store'
import { useSettingsStore } from './settings.store'

const getCurrentPuzzleSolves = () => {
  const sessions = useSessionsStore()
  const settings = useSettingsStore()
  const session = sessions.ensureCurrentSession()
  const puzzle = settings.timer.puzzle

  if (puzzle in session.solves) {
    session.solves[puzzle] ??= []
    return session.solves[puzzle]
  }

  session.solves[puzzle] = []
  return session.solves[puzzle]
}

export const useSolvesStore = defineStore('solves', {
  getters: {
    solves: () => getCurrentPuzzleSolves()
  },

  actions: {
    addSolve(solve: Solve) {
      getCurrentPuzzleSolves().push(solve)
    },

    removeSolve(solve: Solve, confirmDelete: boolean = true) {
      const sessions = useSessionsStore()
      const sessionSolves = sessions.sessions.find((solves) =>
        solves.solves[solve.puzzle].includes(solve)
      )

      if (!sessionSolves) return

      const settings = useSettingsStore()
      if (settings.timer.confirmDelete && confirmDelete) {
        if (!confirm('Na pewno chcesz usunąć ten element?')) return
      }

      const solves = sessionSolves.solves[solve.puzzle]
      solves.splice(0, solves.length, ...solves.filter((s) => s !== solve))
    },

    togglePlusTwo(solve: Solve) {
      solve.plusTwo = !solve.plusTwo
    },

    toggleDNF(solve: Solve) {
      solve.DNF = !solve.DNF
    },

    markOK(solve: Solve) {
      solve.plusTwo = false
      solve.DNF = false
    }
  }
})
