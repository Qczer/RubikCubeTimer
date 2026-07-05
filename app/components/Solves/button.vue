<script setup lang="ts">
import { ArrowUpWideNarrow, Funnel } from '@lucide/vue'

const props = defineProps<{
  text?: string
  icon: 'cube' | 'filter' | 'sort'
  invert?: boolean
}>()

const icons = {
  cube: null,
  filter: Funnel,
  sort: ArrowUpWideNarrow
}
</script>
<template>
  <button class="flex items-center gap-1 rounded-lg bg-zinc-800 p-2 capitalize">
    {{ text ?? icon }}
    <component v-if="icon !== 'cube'" :is="icons[props.icon]" :size="16" />
    <img v-else src="/icons/cuboid.svg" class="h-4 invert" alt="Cube" />
  </button>
</template>
