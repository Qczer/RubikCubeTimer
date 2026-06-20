<script setup lang="ts">
import puzzles, { type PuzzleKey } from '~/types/puzzles'
import DonutChart from '~/components/Stats/donutChart.vue'

const { sessions } = useSessionsStore()

const allSolves = computed(() =>
  sessions.flatMap((s) => Object.values(s.solves)).flat()
)

const bestSolve = computed(() => {
  const valid = allSolves.value.filter((s) => !s.DNF)
  if (!valid.length) return null
  return Math.min(...valid.map((s) => s.time))
})

const firstSolve = computed(() => {
  return (
    allSolves.value.slice().sort((a, b) => a.date - b.date)[0]?.time ?? null
  )
})

const dnfCount = computed(() => {
  return allSolves.value.filter((s) => s.DNF).length
})

const plusTwoCount = computed(() => {
  return allSolves.value.filter((s) => s.plusTwo).length
})

const totalTime = sessions.reduce((sessionSum, session) => {
  const sessionTime = Object.values(session.solves)
    .flat()
    .reduce((solveSum, solve) => solveSum + solve.time, 0)

  return sessionSum + sessionTime
}, 0)

const totalSolves = sessions.reduce(
  (sum, session) =>
    sum +
    Object.values(session.solves).reduce(
      (eventSum, solves) => eventSum + solves.length,
      0
    ),
  0
)

const totalEvents = (): number => {
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

const bestEvent = (): PuzzleKey | null => {
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

const eventDistribution = computed<Record<string, number>>(() => {
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
</script>
<template>
  <div class="flex w-full flex-col gap-4 p-8">
    <Header title="Stats" />
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">Overview</h2>
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
          <StatsCard
            title="Time Spent Cubing"
            :value="formatTime(totalTime)"
            icon="time"
            color="green"
          />
          <StatsCard
            title="Total Solves"
            :value="totalSolves"
            icon="number"
            color="blue"
          />
          <StatsCard
            title="Number of Events"
            :value="totalEvents()"
            icon="number"
          />
          <StatsCard
            title="Top Event"
            :value="bestEvent() ? puzzles[bestEvent()!] : 'None'"
            icon="top"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">Event Distribution</h2>
        <div class="bg-secondary rounded-2xl p-2">
          <DonutChart :data="eventDistribution" />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold">More Stats</h2>
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
          <StatsCard
            title="Best Solve"
            :value="bestSolve ? formatTime(bestSolve) : null"
            icon="best"
          />
          <StatsCard
            title="First Solve"
            :value="firstSolve ? formatTime(firstSolve) : null"
            icon="time"
          />
          <StatsCard title="DNFs" :value="dnfCount" icon="DNF" />
          <StatsCard title="+2s" :value="plusTwoCount" icon="plusTwo" />
        </div>
      </div>
    </div>
  </div>
</template>
