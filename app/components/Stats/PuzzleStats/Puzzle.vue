<script setup lang="ts">
import type { PuzzleKey } from '~/types/puzzles'
import Group from '../group.vue'
import type { Solve } from '~/types/solve.js'
import type { statsCardProp } from '../card.vue'

const props = defineProps<{
  puzzle: PuzzleKey
  solves: Solve[]
}>()

console.log('Puzzle: ', props.puzzle, '\nSolves: ', props.solves)

const totalTime = computed(() =>
  props.solves.reduce((sum, solve) => sum + solve.time, 0)
)

const cards = computed((): statsCardProp[] => [
  {
    title: 'Single PB',
    value: getPB(props.solves)?.time
      ? formatTime(getPB(props.solves)!.time)
      : null,
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
])
</script>

<template>
  <Group header="Overview" :cards />
</template>
