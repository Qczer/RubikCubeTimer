import { defineStore } from 'pinia'
import type { PuzzleKey } from '~/types/puzzles'
import type { Session } from '~/types/session'
import type { Solve } from '~/types/solve'

const createDefaultSession = (): Session => ({
  name: 'New Session',
  date: Date.now(),
  solves: createEmptySolves()
})

const ensureSessionSolves = (session: Session) => {
  const emptySolves = createEmptySolves()

  session.solves ??= emptySolves

  for (const puzzle of Object.keys(emptySolves) as Array<
    keyof Session['solves']
  >) {
    session.solves[puzzle] ??= []
  }
}

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [createDefaultSession()] as Session[]
  }),

  getters: {
    currentSession(state): Session {
      const settings = useSettingsStore()
      const fallback = state.sessions[0] ?? createDefaultSession()

      const found = state.sessions.find(
        (s) => s.name === settings.timer.session
      )

      const session = found ?? fallback
      ensureSessionSolves(session)

      return session
    }
  },

  actions: {
    ensureCurrentSession() {
      if (this.sessions.length === 0) {
        this.sessions.push(createDefaultSession())
      }

      const settings = useSettingsStore()
      const session =
        this.sessions.find((s) => s.name === settings.timer.session) ??
        this.sessions[0]!

      ensureSessionSolves(session)

      return session
    },

    createSession(name: string) {
      this.sessions.push({
        name,
        date: Date.now(),
        solves: createEmptySolves()
      })
    },

    mergeSession(session: Session) {
      const current = this.ensureCurrentSession()

      const result: Record<PuzzleKey, Solve[]> = { ...current.solves }

      for (const [puzzle, solves] of Object.entries(session.solves)) {
        const key = puzzle as PuzzleKey
        result[key] = [...(result[key] ?? []), ...solves]
      }

      current.solves = result
      this.deleteSession(session)
    },

    deleteSessionByName(name: string) {
      if (this.sessions.length === 1) return

      const remaining = this.sessions.filter((s) => s.name !== name)
      this.sessions =
        remaining.length > 0 ? remaining : [createDefaultSession()]
    },
    deleteSession(session: Session) {
      if (this.sessions.length === 1) return

      const remaining = this.sessions.filter((s) => s !== session)
      this.sessions =
        remaining.length > 0 ? remaining : [createDefaultSession()]
    }
  },

  persist: true
})
