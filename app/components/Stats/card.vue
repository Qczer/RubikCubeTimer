<script setup lang="ts">
import { ArrowBigUpDash, Hash, Timer } from '@lucide/vue'

defineProps<{
  title: string
  value: string | number
  icon: keyof typeof icons
  color?: keyof typeof colors
}>()

const icons = {
  number: Hash,
  time: Timer,
  top: ArrowBigUpDash
}

const colors = {
  green: {
    bg: 'bg-emerald-400',
    text: 'text-emerald-400'
  },
  blue: {
    bg: 'bg-sky-400',
    text: 'text-sky-400'
  },
  gray: {
    bg: 'bg-gray-500',
    text: 'text-gray-500'
  }
}
</script>
<template>
  <div class="bg-secondary flex flex-col gap-2 rounded-2xl p-6">
    <div class="flex gap-2">
      <div
        class="flex h-7 w-7 items-center justify-center rounded-md"
        :class="color ? colors[color].bg : colors['gray'].bg"
      >
        <component :is="icons[icon]" v-if="icons[icon]" :size="18" />
      </div>
      <span class="opacity-90">{{ title }}</span>
    </div>
    <p
      class="text-4xl font-bold"
      :class="color ? colors[color].text : colors['gray'].text"
    >
      {{ value }}
    </p>
  </div>
</template>
