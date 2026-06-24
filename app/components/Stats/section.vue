<script setup lang="ts">
import type { statsCardProp } from './card.vue'

const props = defineProps<{
  header: string
  cards?: statsCardProp[]
}>()
</script>
<template>
  <div class="flex h-90 w-full flex-col gap-4">
    <div class="flex h-12 shrink-0 items-center">
      <h2 class="text-3xl font-bold leading-none">{{ header }}</h2>
    </div>
    <div
      v-if="cards"
      class="grid min-h-0 flex-1 w-full grid-cols-2 grid-rows-2 gap-4"
    >
      <StatsCard
        v-for="card in cards"
        :title="card.title"
        :value="card.value"
        :date="card.date"
        :puzzle="card.puzzle"
        :scramble="card.scramble"
        :icon="card.icon"
        :color="card.color"
        :row-span="card.rowSpan"
      />
    </div>
    <div v-else class="min-h-0 flex-1 w-full">
      <slot />
    </div>
  </div>
</template>
