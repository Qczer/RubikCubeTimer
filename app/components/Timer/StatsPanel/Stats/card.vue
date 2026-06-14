<script setup lang="ts">
import type { Average, Solve } from '~/types/solve'
import Card from '~/components/Timer/StatsPanel/Solves/Card/index.vue'

const { solves } = useSolves()
const showSolveCard = ref(false)
const props = defineProps<{
  type: 'pb' | 'worst' | 'avg' | 'ao' | 'mo'
  solvesCount?: number
  isPb?: true
  height?: number
}>()

const isSolve = (value: Solve | Average): value is Solve => {
  return 'scramble' in value
}

const getValue = (): null | Solve | Average => {
  if (props.solvesCount && props.solvesCount > solves.value.length) return null

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
const lastSolve = computed(() => solves.value.at(-1))

const displayValue = computed(() => {
  if (!value.value) return '-'

  if (isSolve(value.value)) {
    return formatTime(
      value.value.time,
      undefined,
      value.value.plusTwo,
      value.value.DNF
    )
  }

  return formatTime(value.value.time)
})

const filteredSolves = computed(() => {
  let newSolves = [...solves.value]

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
  <div
    v-if="showSolveCard"
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
  >
    <p v-for="(solve, i) in filteredSolves" :key="i">
      {{ i + 1 }}.
      {{ formatTime(solve.time, undefined, solve.plusTwo, solve.DNF) }}
    </p>
  </div>
  <Card
    v-if="
      showSolveCard &&
      lastSolve &&
      (props.type === 'pb' || props.type === 'worst')
    "
    :solve="lastSolve"
    @close="closeSolveCard"
  />

  <div
    class="bg-secondary relative flex min-h-[50px] rounded-lg p-1.5"
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
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-2xl font-bold"
      :class="props.height && props.height >= 2 ? 'text-4xl' : ''"
      @click="toggleSolveCard"
    >
      {{ displayValue }}
    </span>
  </div>
</template>
