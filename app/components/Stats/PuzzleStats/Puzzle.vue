<script setup lang="ts">
import type { PuzzleKey } from '~/types/puzzles'
import Section from '../section.vue'
import type { Solve } from '~/types/solve.js'
import type { statsCardProp } from '../card.vue'

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
      value: formatTime(pb.time),
      date: pb.date,
      puzzle: pb.puzzle,
      scramble: pb.scramble,
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
</template>
