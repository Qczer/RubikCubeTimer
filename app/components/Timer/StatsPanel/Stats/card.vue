<script setup lang="ts">
import type { Average, Solve } from '~/types/solve'
import SolveCard from '~/components/Timer/StatsPanel/Solves/Card/solveCard.vue'
import AverageCard from '~/components/Timer/StatsPanel/Solves/Card/averageCard.vue'
import type { PuzzleKey } from '~/types/puzzles'

const solves = useSolvesStore()
const showSolveCard = ref(false)
const props = defineProps<{
  type: 'pb' | 'worst' | 'avg' | 'ao' | 'mo'
  puzzle: PuzzleKey
  solvesCount?: number
  isPb?: true
  height?: number
}>()

const getValue = (): null | Solve | Average => {
  if (props.solvesCount && props.solvesCount > solves.solves.length) return null

  switch (props.type) {
    case 'pb':
      return getPB(filteredSolves.value)
    case 'worst':
      return getWorst(filteredSolves.value)
    case 'avg':
      return getAO(filteredSolves.value)
    case 'ao':
      return getAO(filteredSolves.value)
    case 'mo':
      return getMO(filteredSolves.value)
  }
}

const value = computed(() => getValue())
const lastSolve = computed(() => solves.solves.at(-1))

const displayValue = computed(() => {
  if (!value.value) return '-'

  if (isSolve(value.value)) {
    return formatSolveTime(value.value)
  }

  return formatTime(value.value.time)
})

const filteredSolves = computed(() => {
  let newSolves = [...solves.solves]

  if ('isPb' in props && props.isPb) {
    newSolves.sort((a, b) => a.time - b.time)
    return newSolves.slice(0, props.solvesCount)
  }

  if (props.solvesCount) {
    return newSolves.slice(-props.solvesCount)
  }

  return newSolves
})

const toggleSolveCard = () => (showSolveCard.value = !showSolveCard.value)
const closeSolveCard = () => (showSolveCard.value = false)
</script>
<template>
  <SolveCard
    v-if="
      showSolveCard &&
      lastSolve &&
      (props.type === 'pb' || props.type === 'worst')
    "
    :solve="lastSolve"
    @close="closeSolveCard"
  />
  <AverageCard
    v-else-if="
      showSolveCard &&
      value &&
      'solves' in value &&
      props.type !== 'pb' &&
      props.type !== 'worst'
    "
    :average="value"
    :puzzle="puzzle"
    :isPb="isPb"
    :solvesCount="solvesCount"
    @close="closeSolveCard"
  />

  <div
    class="bg-surface relative flex min-h-12.5 rounded-lg p-1.5"
    :style="
      props.height
        ? { gridRow: `span ${props.height} / span ${props.height}` }
        : {}
    "
  >
    <span class="px-0.5 text-sm opacity-60">
      {{ props.type }}{{ 'solvesCount' in props && props.solvesCount }}
      {{ 'isPb' in props && props.isPb ? 'pb' : '' }}
    </span>
    <span
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-2xl font-bold"
      :class="{
        'text-4xl': props.height && props.height >= 2,
        'hover:underline': displayValue !== '-'
      }"
      @click="toggleSolveCard"
    >
      {{ displayValue }}
    </span>
  </div>
</template>
