import type { PuzzleKey } from '~/types/puzzles'
import puzzles from '~/types/puzzles'
import type { Average, Solve } from '~/types/solve'

/*

  Timer

*/

export const getPB = (solves: Solve[]): Solve | null => {
  const valid = solves.filter((s) => !s.DNF)
  if (valid.length === 0) return null

  return valid.reduce((best, current) => {
    const currentTime = current.plusTwo ? current.time + 2000 : current.time
    const bestTime = best.plusTwo ? best.time + 2000 : best.time
    return currentTime < bestTime ? current : best
  })
}

export const getWorst = (solves: Solve[]): Solve | null => {
  const valid = solves.filter((s) => !s.DNF)
  if (valid.length === 0) return null

  return valid.reduce((worst, current) => {
    const currentTime = current.plusTwo ? current.time + 2000 : current.time
    const bestTime = worst.plusTwo ? worst.time + 2000 : worst.time
    return currentTime > bestTime ? current : worst
  })
}

// Get Average Of - excludes the best and worst solve
export const getAO = (solves: Solve[]): Average | null => {
  if (solves.length === 0) return null

  const solvesLeft = [...solves].sort((a, b) => a.time - b.time).slice(1, -1)
  return getMO(solvesLeft)
}

// Get Mean Of - includes all solves
export const getMO = (solves: Solve[]): Average | null => {
  if (solves.length === 0) return null

  const sum = solves.reduce((a, b) => a + b.time, 0)
  return { time: sum / solves.length, solves }
}

/*

  Stats Page

*/

const allSolves = computed(() => {
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

export const bestSolve = computed(() => {
  const valid = allSolves.value.filter((s) => !s.DNF)
  if (!valid.length) return null
  return Math.min(...valid.map((s) => s.time))
})

export const firstSolve = computed(() => {
  return (
    allSolves.value.slice().sort((a, b) => a.date - b.date)[0]?.time ?? null
  )
})

export const dnfCount = computed(() => {
  return allSolves.value.filter((s) => s.DNF).length
})

export const plusTwoCount = computed(() => {
  return allSolves.value.filter((s) => s.plusTwo).length
})

export const totalTime = () => {
  const { sessions } = useSessionsStore()
  return sessions.reduce((sessionSum, session) => {
    const sessionTime = Object.values(session.solves)
      .flat()
      .reduce((solveSum, solve) => solveSum + solve.time, 0)

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

      const times = solves.map((s) => s.time)
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
