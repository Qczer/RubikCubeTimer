<script setup lang="ts">
import { X } from '@lucide/vue'
import type { Solve } from '~/types/solve'

const solves = useState<Solve[]>('solves')

const reversedSolves = computed(() => {
  return [...solves.value].reverse()
})

const showSolve = (solve: Solve) => console.log('showSolve')
const plusTwo = (solve: Solve) => (solve.plusTwo = !solve.plusTwo)
const DNF = (solve: Solve) => (solve.DNF = !solve.DNF)

const getColor = (solve: Solve) => {
  if (solve.DNF) return 'text-red-500'
  if (solve.plusTwo) return 'text-orange-500'
  return 'text-green-500'
}
</script>
<template>
  <p v-if="solves.length === 0">No solves yet</p>
  <div
    v-for="(solve, i) in reversedSolves"
    :key="i"
    class="flex h-9 shrink-0 flex-row items-center justify-center pr-1.5"
  >
    <span class="min-w-10 pr-1.5">{{ solves.length - i }}.</span>
    <span
      class="w-[150px] shrink-0 cursor-pointer text-green-500 hover:underline"
      :class="getColor(solve)"
      @click="showSolve(solve)"
      >{{ formatTime(solve.time, undefined, solve.plusTwo, solve.DNF) }}</span
    >
    <div class="flex w-full flex-row justify-end gap-2">
      <span
        class="cursor-pointer text-sm font-bold hover:opacity-100"
        :class="solve.plusTwo ? 'text-orange-500 opacity-100' : 'opacity-60'"
        @click="plusTwo(solve)"
      >
        +2
      </span>
      <span
        class="cursor-pointer text-sm font-bold hover:opacity-100"
        :class="solve.DNF ? 'text-red-500 opacity-100' : 'opacity-60'"
        @click="DNF(solve)"
      >
        DNF
      </span>
      <X class="cursor-pointer opacity-60 hover:opacity-100" :size="20" />
    </div>
  </div>
</template>
