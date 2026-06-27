<script setup lang="ts">
import type { PuzzleKey } from '~/types/puzzles'
import Section from '../section.vue'
import type { Solve } from '~/types/solve.js'
import type { statsCardProp } from '../card.vue'
import LineChart from '../lineChart.vue'

const props = defineProps<{
  puzzle: PuzzleKey
  solves: Solve[]
}>()

const averages = [50, 100, 500, 1000, 2000]

const totalTime = computed(() =>
  props.solves.reduce((sum, solve) => sum + solve.time, 0)
)

const getAverageFor = (count: number) => {
  if (props.solves.length < count) return null

  return getAO(props.solves.slice(-count))
}

const cards = computed((): statsCardProp[] => {
  const pb = getPB(props.solves)
  if (!pb) return []

  return [
    {
      title: 'Single PB',
      value: pb,
      icon: 'best',
      color: 'green',
      rowSpan: true
    },
    {
      title: 'Total Solves',
      value: props.solves.length,
      icon: 'number',
      color: 'blue'
    },
    {
      title: 'Time Spent Cubing',
      value: formatTime(totalTime.value),
      icon: 'time',
      color: 'gray'
    }
  ]
})

const first = computed(() => getFirstSolve(props.solves))
const dnfCount = computed(() => getDNFCount(props.solves))
const plusTwoCount = computed(() => getPlusTwoCount(props.solves))

const moreStatsCards = computed((): statsCardProp[] => [
  {
    title: 'First Solve',
    value: first.value,
    icon: 'time',
    rowSpan: true
  },
  {
    title: 'DNFs',
    value: dnfCount.value,
    icon: 'DNF'
  },
  {
    title: '+2s',
    value: plusTwoCount.value,
    icon: 'best'
  }
])
</script>

<template>
  <Section header="Overview" :cards />
  <Section header="Averages">
    <div class="bg-surface flex h-full w-full flex-col gap-2 rounded-2xl p-6">
      <div
        v-for="num in averages"
        :key="num"
        class="flex flex-1 items-center justify-between rounded-md p-2 odd:bg-white/10"
      >
        <p class="flex gap-2 text-xl">
          Average of<span class="text-blue-500">{{ num }}</span>
        </p>
        <p class="text-xl text-green-500">
          {{ getAverageFor(num) ? formatTime(getAverageFor(num)!.time) : '-' }}
        </p>
      </div>
    </div>
  </Section>
  <Section header="Solve Times">
    <div class="bg-surface h-full w-full rounded-2xl p-2">
      <LineChart :data="solves" height="100%" />
    </div>
  </Section>
  <Section header="More Stats" :cards="moreStatsCards" />
</template>
