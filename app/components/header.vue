<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
<template>
  <div class="flex w-fit flex-col gap-2">
    <h2 class="text-5xl font-bold">{{ title }}</h2>
    <div class="w-[calc(100%+20px)] rounded-sm border-t border-zinc-700" />
  </div>
</template>
