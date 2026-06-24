<script setup lang="ts">
import {
  ArrowBigUpDash,
  CircleAlert,
  Hash,
  Trophy,
  Timer,
  TriangleAlert,
  Calendar
} from '@lucide/vue'
import { type PuzzleKey } from '~/types/puzzles'

export type statsCardProp = {
  title: string
  value: string | number | null
  date?: number
  puzzle?: PuzzleKey
  scramble?: string
  icon: keyof typeof icons
  color?: keyof typeof colors
  rowSpan?: boolean
}

defineProps<statsCardProp>()

const icons = {
  number: Hash,
  time: Timer,
  top: ArrowBigUpDash,
  DNF: CircleAlert,
  plusTwo: TriangleAlert,
  best: Trophy
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
  <div
    class="bg-surface relative flex h-full w-full min-w-0 flex-col justify-between gap-2 rounded-2xl p-8"
    :class="rowSpan ? 'row-span-2' : ''"
  >
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <div
          class="flex h-7 w-7 items-center justify-center rounded-md"
          :class="color ? colors[color].bg : colors['gray'].bg"
        >
          <component :is="icons[icon]" v-if="icons[icon]" :size="18" />
        </div>
        <span class="opacity-90">{{ title }}</span>
      </div>
      <span
        class="font-bold"
        :class="[
          color ? colors[color].text : colors['gray'].text,
          rowSpan
            ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl'
            : 'text-4xl'
        ]"
      >
        {{ value ?? '-' }}
      </span>
    </div>
    <p v-if="date" class="flex items-center gap-1 text-sm font-bold opacity-90">
      <calendar :size="16" />
      {{ formatDate(date, 'numerical') }}
    </p>
  </div>
</template>
