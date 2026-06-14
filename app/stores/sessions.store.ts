import { defineStore } from 'pinia'
import type { Session } from '~/types/session'

const createDefaultSession = (): Session => ({
  name: 'New Session',
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
        solves: createEmptySolves()
      })
    },

    deleteSession(name: string) {
      if (this.sessions.length === 1) return

      const remaining = this.sessions.filter((s) => s.name !== name)
      this.sessions =
        remaining.length > 0 ? remaining : [createDefaultSession()]
    }
  },

  persist: true
})
