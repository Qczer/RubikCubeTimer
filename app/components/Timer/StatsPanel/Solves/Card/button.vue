<script setup lang="ts">
import { Copy } from '@lucide/vue'

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
    class="flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-sm"
    :class="active ? activeClass : 'bg-primary'"
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
    <Copy v-else-if="icon === 'copy'" :size="15" />
  </button>
</template>
