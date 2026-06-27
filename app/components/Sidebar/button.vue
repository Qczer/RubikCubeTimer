<script setup lang="ts">
import { ChartPie, List, Rows2, Settings, Timer } from '@lucide/vue'

const route = useRoute()

const props = defineProps<{
  text: 'timer' | 'stats' | 'solves' | 'sessions' | 'settings'
  showText?: boolean
  invert?: boolean
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
    class="inline-flex w-full items-center gap-1 rounded-lg p-2 capitalize transition-opacity md:gap-4"
    :class="!isActive ? 'opacity-40 hover:opacity-100' : ''"
  >
    <component :is="icons[props.text]" v-if="!invert && icons[props.text]" />
    <span class="lg:block lg:text-lg" :class="showText ? 'block' : 'hidden'">
      {{ text }}
    </span>
    <component
      :is="icons[props.text]"
      v-if="invert && icons[props.text]"
      :size="14"
    />
  </NuxtLink>
</template>
