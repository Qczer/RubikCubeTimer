<script setup lang="ts">
const props = defineProps<{
  header: string | number
  subheader: string | number
}>()
</script>
<template>
  <div class="flex min-w-40 flex-col justify-between rounded-md bg-red-500 p-4">
    <p class="inline-flex text-2xl font-bold">{{ header }}</p>
    <p class="opacity-80">{{ subheader }}</p>
  </div>
</template>
