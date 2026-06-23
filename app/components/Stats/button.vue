<script setup lang="ts">
const props = defineProps<{
  text: string
  active?: boolean
  setActive?: () => void
}>()
</script>
<template>
  <button
    class="rounded-lg px-5 py-2 transition-colors"
    :class="active ? 'bg-blue-500' : 'bg-surface'"
    @click="setActive"
  >
    {{ text }}
  </button>
</template>
