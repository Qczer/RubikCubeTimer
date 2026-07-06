<script setup lang="ts">
import puzzles, { twistyPlayerPuzzles } from '~/types/puzzles'
import type { Solve } from '~/types/solve'
import 'cubing/twisty'
import SolveCard from '../Timer/StatsPanel/Solves/Card/solveCard.vue'

const props = defineProps<{
  solve: Solve
}>()

const {
  isOpen: isSolveOpen,
  open: showSolve,
  close: closeSolve,
  clearAfterLeave: clearSolve
} = useTransitionedSelection<Solve>()
</script>
<template>
  <SolveCard
    :open="isSolveOpen"
    :solve="solve"
    @close="closeSolve"
    @after-leave="clearSolve"
  />
  <div
    class="bg-surface flex cursor-pointer justify-between rounded-lg p-4"
    @click="showSolve(solve)"
  >
    <div class="flex flex-1 flex-col gap-1">
      <p class="text-3xl font-semibold">{{ formatSolveTime(solve) }}</p>
      <p class="text-sm opacity-60">{{ formatDate(solve.date, true) }}</p>
    </div>
    <div class="flex flex-1 items-center justify-center">
      <div class="mb-1 w-fit rounded-full bg-zinc-700 px-2.5 py-1 text-base">
        {{ puzzles[solve.puzzle] }}
      </div>
    </div>
    <div class="flex flex-1 justify-end">
      <twisty-player
        class="h-full w-15"
        :puzzle="twistyPlayerPuzzles[solve.puzzle]"
        :alg="solve.scramble"
        hintFacelets="none"
        background="none"
        visualization="experimental-2D-LL-face"
        controlPanel="none"
      />
    </div>
  </div>
</template>
