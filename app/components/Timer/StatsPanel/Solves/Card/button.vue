<script setup lang="ts">
import { Check, Copy } from '@lucide/vue'

const props = defineProps<{
  text: string
  icon?: 'cube' | 'copy'
  active?: boolean
  activeClass?: string
  disabled?: boolean
  onClick?: () => void
}>()
</script>
<template>
  <button
    class="bg-background flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm transition"
    :class="active && activeClass"
    :disabled="disabled"
    @click="onClick"
  >
    {{ text }}
    <img
      v-if="icon === 'cube'"
      src="/icons/cuboid.svg"
      class="invert"
      alt="Cuboid"
    />
    <template v-else-if="icon === 'copy'">
      <Copy v-if="!active" :size="15" />
      <Check v-else :size="15" />
    </template>
  </button>
</template>
