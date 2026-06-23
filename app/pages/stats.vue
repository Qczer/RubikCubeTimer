<script setup lang="ts">
import puzzles, { type PuzzleKey } from '~/types/puzzles'
import Button from '~/components/Stats/button.vue'
import All from '~/components/Stats/PuzzleStats/All.vue'
import Puzzle from '~/components/Stats/PuzzleStats/Puzzle.vue'

const active = ref<'All' | PuzzleKey>('All')
</script>
<template>
  <div class="flex w-full flex-col gap-4 p-8">
    <Header title="Stats" />
    <div class="flex gap-2 p-2">
      <Button
        text="All"
        :active="active === 'All'"
        :setActive="() => (active = 'All')"
      />
      <Button
        v-for="puzzle in sortedPuzzleKeys"
        :text="puzzles[puzzle]"
        :active="active === puzzle"
        :setActive="() => (active = puzzle)"
      />
    </div>
    <div class="grid grid-cols-2 gap-12">
      <All v-if="active === 'All'" />
      <Puzzle v-else :puzzle="active" :solves="allPuzzles[active]" />
    </div>
  </div>
</template>
