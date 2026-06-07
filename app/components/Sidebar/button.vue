<script setup lang="ts">
import { ChartPie, List, Rows2, Settings, Timer } from '@lucide/vue'

const route = useRoute()

const props = defineProps<{
  text: 'timer' | 'stats' | 'solves' | 'sessions' | 'settings'
}>()

const icons = {
  timer: Timer,
  stats: ChartPie,
  solves: List,
  sessions: Rows2,
  settings: Settings
} as const

const isActive = computed(() => {
  if (props.text === 'timer') return route.path === '/'
  return route.path === `/${props.text}`
})
</script>

<template>
  <NuxtLink
    :to="props.text === 'timer' ? '/' : `/${props.text}`"
    class="flex w-full items-center gap-4 rounded-lg p-2 text-lg capitalize transition-opacity"
    :class="!isActive ? 'opacity-40 hover:opacity-100' : ''"
  >
    <component :is="icons[props.text]" v-if="icons[props.text]" />
    {{ text }}
  </NuxtLink>
</template>
