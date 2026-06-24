<script setup lang="ts">
import Card from './card.vue'

const settings = useSettingsStore()
const puzzle = settings.timer.puzzle
</script>

<template>
  <div class="grid h-full grow grid-cols-2 grid-rows-4 gap-1">
    <Card type="pb" :height="2" :puzzle />
    <Card type="worst" :puzzle />
    <Card type="avg" :puzzle />
    <Card type="ao" :solvesCount="5" :isPb="true" :puzzle />
    <Card type="ao" :solvesCount="5" :puzzle />
    <Card type="ao" :solvesCount="12" :isPb="true" :puzzle />
    <Card type="ao" :solvesCount="12" :puzzle />
  </div>
</template>
