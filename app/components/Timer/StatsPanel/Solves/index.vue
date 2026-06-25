<script setup lang="ts">
import { X } from '@lucide/vue'
import type { Solve } from '~/types/solve'
import SolveCard from './Card/solveCard.vue'

const solves = useSolvesStore()

const reversedSolves = computed(() => {
  return [...solves.solves].reverse()
})

const solveRef = ref<Solve | null>(null)

const showSolve = (solve: Solve) => (solveRef.value = solve)
const closeSolve = () => (solveRef.value = null)

const colors = {
  dnf: 'text-dnf',
  plusTwo: 'text-plusTwo',
  green: 'text-green'
}

const getColor = (solve: Solve) => {
  if (solve.DNF) return colors.dnf
  if (solve.plusTwo) return colors.plusTwo
  return colors.green
}
</script>
<template>
  <SolveCard v-if="solveRef" :solve="solveRef" @close="closeSolve" />
  <div class="h-full overflow-auto">
    <p
      v-if="solves.solves.length === 0"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
    >
      No solves yet
    </p>
    <div
      v-for="(solve, i) in reversedSolves"
      :key="i"
      class="flex h-9 shrink-0 flex-row items-center justify-center pr-1.5"
    >
      <span class="min-w-10 pr-1.5">{{ solves.solves.length - i }}.</span>
      <span
        class="w-37.5 shrink-0 cursor-pointer transition hover:underline"
        :class="getColor(solve)"
        @click="showSolve(solve)"
        >{{ formatTime(solve.time, undefined, solve.plusTwo, solve.DNF) }}</span
      >
      <div class="flex w-full flex-row justify-end gap-2">
        <span
          class="cursor-pointer text-sm font-bold transition hover:opacity-100"
          :class="
            solve.plusTwo ? `${colors.plusTwo} opacity-100` : 'opacity-60'
          "
          @click="solves.togglePlusTwo(solve)"
        >
          +2
        </span>
        <span
          class="cursor-pointer text-sm font-bold transition hover:opacity-100"
          :class="solve.DNF ? `${colors.dnf} opacity-100` : 'opacity-60'"
          @click="solves.toggleDNF(solve)"
        >
          DNF
        </span>
        <X
          class="cursor-pointer opacity-60 transition hover:opacity-100"
          :size="20"
          @click="solves.removeSolve(solve)"
        />
      </div>
    </div>
  </div>
</template>
