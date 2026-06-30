<script setup lang="ts">
const props = defineProps<{
  text: string
  onClick: () => void
}>()
</script>
<template>
  <button
    class="w-full rounded-md p-2 text-nowrap hover:bg-zinc-800"
    @click="onClick"
  >
    {{ text }}
  </button>
</template>
