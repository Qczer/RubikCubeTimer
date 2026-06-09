<script setup lang="ts">
const props = defineProps<{
  text: string
  value?: number | null
  height?: number
}>()
</script>
<template>
  <div
    class="bg-secondary relative flex min-h-[50px] rounded-lg p-1.5"
    :style="height ? { gridRow: `span ${height} / span ${height}` } : {}"
  >
    <span class="px-0.5 text-sm opacity-60">
      {{ text }}
    </span>
    <span
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-4xl font-bold"
    >
      {{ value ? formatTime(value) : '-' }}
    </span>
  </div>
</template>
