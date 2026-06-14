import type { Session } from '~/types/session'
import type { Solve } from '~/types/solve'

const createDefaultSessions = (): Session[] => [
  {
    name: 'Default Session',
    solves: createEmptySolves()
  }
]

export const useSessions = () => {
  const settings = useSettingsStore()
  const sessions = useState<Session[]>('sessions', createDefaultSessions)

  const currentSession = computed(() => {
    return (
      sessions.value.find(
        (session) => session.name === settings.timer.session
      ) ?? sessions.value[0]
    )
  })

  return { sessions, currentSession }
}

export const useSolves = () => {
  const settings = useSettingsStore()
  const { sessions, currentSession } = useSessions()

  const solves: Ref<Solve[]> = computed(() => {
    if (!currentSession.value) throw new Error('No session found')

    if (!currentSession.value.solves[settings.timer.puzzle]) {
      currentSession.value.solves[settings.timer.puzzle] = []
    }

    return currentSession.value.solves[settings.timer.puzzle]
  })

  const removeSolve = (solve: Solve) => {
    if (!currentSession.value) return
    if (settings.timer.confirmDelete) {
      const ok = confirm('Na pewno chcesz usunąć ten element?')
      if (!ok) return
    }
    const arr = solves.value

    currentSession.value.solves[settings.timer.puzzle] = arr.filter(
      (s) => s !== solve
    )
  }

  const plusTwoSolve = (solve: Solve) => (solve.plusTwo = !solve.plusTwo)
  const DNFSolve = (solve: Solve) => (solve.DNF = !solve.DNF)

  return {
    sessions,
    solves,
    removeSolve,
    plusTwoSolve,
    DNFSolve
  }
}
