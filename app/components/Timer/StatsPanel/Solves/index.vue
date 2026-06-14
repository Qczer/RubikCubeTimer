<script setup lang="ts">
import { X } from '@lucide/vue'
import type { Solve } from '~/types/solve'
import SolveCard from './Card/index.vue'

const { solves, removeSolve, plusTwoSolve, DNFSolve } = useSolves()

const reversedSolves = computed(() => {
  return [...solves.value].reverse()
})

const solveRef = ref<Solve | null>(null)

const showSolve = (solve: Solve) => (solveRef.value = solve)
const closeSolve = () => (solveRef.value = null)

const colors = {
  dnf: 'text-red-500',
  plusTwo: 'text-orange-500',
  green: 'text-green-500'
}

const getColor = (solve: Solve) => {
  if (solve.DNF) return colors.dnf
  if (solve.plusTwo) return colors.plusTwo
  return colors.green
}
</script>
<template>
  <SolveCard v-if="solveRef" :solve="solveRef" @close="closeSolve" />
  <p
    v-if="solves.length === 0"
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
  >
    No solves yet
  </p>
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
        :class="solve.plusTwo ? `${colors.plusTwo} opacity-100` : 'opacity-60'"
        @click="plusTwoSolve(solve)"
      >
        +2
      </span>
      <span
        class="cursor-pointer text-sm font-bold hover:opacity-100"
        :class="solve.DNF ? `${colors.dnf} opacity-100` : 'opacity-60'"
        @click="DNFSolve(solve)"
      >
        DNF
      </span>
      <X
        class="cursor-pointer opacity-60 hover:opacity-100"
        :size="20"
        @click="removeSolve(solve)"
      />
    </div>
  </div>
</template>
