<script setup lang="ts">
import type { statsCardProp } from './card.vue'

const props = defineProps<{
  header: string
  cards?: statsCardProp[]
}>()
</script>
<template>
  <div class="flex flex-col gap-2">
    <h2 class="text-3xl font-bold">{{ header }}</h2>
    <div v-if="cards" class="grid grid-cols-2 grid-rows-2 gap-4">
      <StatsCard
        v-for="card in cards"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :color="card.color"
        :row-span="card.rowSpan"
      />
    </div>
    <slot v-else />
  </div>
</template>
