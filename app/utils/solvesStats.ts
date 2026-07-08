import type { PuzzleKey } from '~/types/puzzles'
import puzzles from '~/types/puzzles'
import type { Average, Solve } from '~/types/solve'

export const getDNFOrSolveTime = (solve: Solve): number | 'DNF' => {
  if (solve.DNF) return 'DNF'
  return solve.plusTwo ? solve.time + 2000 : solve.time
}

export const getSolveTime = (solve: Solve): number => {
  return solve.plusTwo ? solve.time + 2000 : solve.time
}
const normalizeTime = (solve: Solve): number => {
  const t = getDNFOrSolveTime(solve)
  return t === 'DNF' ? Infinity : t
}

/*

  Timer

*/

export const getPB = (solves: Solve[]): Solve | null => {
  const valid = solves.filter((s) => !s.DNF)
  if (valid.length === 0) return null

  return valid.reduce((best, current) =>
    normalizeTime(current) < normalizeTime(best) ? current : best
  )
}

export const getWorst = (solves: Solve[]): Solve | null => {
  const valid = solves.filter((s) => !s.DNF)
  if (valid.length === 0) return null

  return valid.reduce((worst, current) =>
    normalizeTime(current) > normalizeTime(worst) ? current : worst
  )
}

// Get Average Of - excludes the best and worst solve
export const getAO = (solves: Solve[]): Average | null => {
  if (solves.length < 3) return null

  const sorted = [...solves].sort((a, b) => normalizeTime(a) - normalizeTime(b))

  const middle = sorted.slice(1, -1)

  if (middle.some((s) => s.DNF)) {
    return {
      time: Infinity,
      solves,
      date: solves.at(-1)!.date
    }
  }

  const sum = middle.reduce((acc, s) => acc + getSolveTime(s), 0)

  return { time: sum / middle.length, solves, date: solves.at(-1)!.date }
}

// Get Mean Of - includes all solves
export const getMO = (solves: Solve[]): Average | null => {
  if (solves.length === 0) return null

  if (solves.some((s) => s.DNF)) {
    return {
      time: Infinity,
      solves,
      date: solves.at(-1)!.date
    }
  }

  const sum = solves.reduce((acc, s) => acc + getSolveTime(s), 0)

  return {
    time: sum / solves.length,
    solves,
    date: solves.at(-1)!.date
  }
}

/*

  Stats Page

*/

export const allSolves = computed(() => {
  const { sessions } = useSessionsStore()
  return sessions.flatMap((s) => Object.values(s.solves)).flat()
})

export const allPuzzles = computed(() => {
  const { sessions } = useSessionsStore()

  const result = {} as Record<PuzzleKey, Solve[]>

  for (const session of sessions) {
    for (const [puzzle, solves] of Object.entries(session.solves)) {
      if (!solves.length) continue

      const key = puzzle as PuzzleKey
      result[key] ??= []
      result[key].push(...solves)
    }
  }

  return Object.fromEntries(
    Object.entries(result)
      .filter(([, solves]) => solves.length > 0)
      .sort((a, b) => b[1].length - a[1].length)
  ) as Record<PuzzleKey, Solve[]>
})

export const sortedPuzzleKeys = computed(() => {
  const puzzles = allPuzzles.value

  return Object.entries(puzzles)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key]) => key as PuzzleKey)
})

export const getBestSolve = (solves: Solve[]) => {
  const valid = solves.filter((s) => !s.DNF)
  if (!valid.length) return null

  return valid.reduce((best, current) =>
    normalizeTime(current) < normalizeTime(best) ? current : best
  )
}

export const getFirstSolve = (solves: Solve[]) => {
  return solves.slice().sort((a, b) => a.date - b.date)[0] ?? null
}

export const getDNFCount = (solves: Solve[]) => {
  return solves.filter((s) => s.DNF).length
}

export const getPlusTwoCount = (solves: Solve[]) => {
  return solves.filter((s) => s.plusTwo).length
}

export const totalTime = () => {
  const { sessions } = useSessionsStore()
  return sessions.reduce((sessionSum, session) => {
    const sessionTime = Object.values(session.solves)
      .flat()
      .reduce((solveSum, solve) => solveSum + getSolveTime(solve), 0)

    return sessionSum + sessionTime
  }, 0)
}

export const totalSolves = () => {
  const { sessions } = useSessionsStore()
  return sessions.reduce(
    (sum, session) =>
      sum +
      Object.values(session.solves).reduce(
        (eventSum, solves) => eventSum + solves.length,
        0
      ),
    0
  )
}
export const totalEvents = (): number => {
  const { sessions } = useSessionsStore()
  const uniqueEvents = new Set<PuzzleKey>()

  for (const session of sessions) {
    for (const [event, solves] of Object.entries(session.solves)) {
      if (solves.length > 0) {
        uniqueEvents.add(event as PuzzleKey)
      }
    }
  }

  return uniqueEvents.size
}

export const bestEvent = (): PuzzleKey | null => {
  const { sessions } = useSessionsStore()
  const eventStats = new Map<PuzzleKey, number[]>()

  for (const session of sessions) {
    for (const [event, solves] of Object.entries(session.solves)) {
      const key = event as PuzzleKey

      const times = solves.map((s) => getSolveTime(s))
      if (times.length === 0) continue

      if (!eventStats.has(key)) {
        eventStats.set(key, [])
      }

      eventStats.get(key)!.push(...times)
    }
  }

  const valid = [...eventStats.entries()].filter(
    ([, times]) => times.length > 0
  )

  if (valid.length === 0) return null

  const best = valid.reduce<{ event: PuzzleKey; average: number } | null>(
    (best, [event, times]) => {
      const average = times.reduce((a, b) => a + b, 0) / times.length

      if (!best || average < best.average) return { event, average }
      return best
    },
    null
  )

  return best?.event ?? null
}

export const eventDistribution = computed<Record<string, number>>(() => {
  const { sessions } = useSessionsStore()
  const eventCounts = new Map<string, number>()

  for (const session of sessions) {
    for (const [event, solves] of Object.entries(session.solves)) {
      if (!solves.length) continue

      const key = puzzles[event as PuzzleKey] ?? event

      eventCounts.set(key, (eventCounts.get(key) ?? 0) + solves.length)
    }
  }

  const total = [...eventCounts.values()].reduce((a, b) => a + b, 0)

  if (total === 0) return {}

  // % udziału
  return Object.fromEntries(
    [...eventCounts.entries()].map(([event, count]) => [
      event,
      +((count / total) * 100).toFixed(1)
    ])
  )
})

export const getMainSession = (puzzle: PuzzleKey) => {
  const { sessions } = useSessionsStore()
  const sessionCounts = new Map<string, number>()

  for (const session of sessions) {
    const solves = session.solves[puzzle].length ?? 0
    sessionCounts.set(session.name, solves)
  }

  const maxSolves = Math.max(...sessionCounts.values())
  const mainSession = [...sessionCounts.entries()]
    .filter(([, count]) => count === maxSolves)
    .map(([name]) => name)

  return mainSession[0] || null
}
