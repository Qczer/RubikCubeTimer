<script setup lang="ts">
import Card from './card.vue'
</script>

<template>
  <div class="grid h-[100%] grow grid-cols-2 grid-rows-4 gap-1">
    <Card type="pb" :height="2" />
    <Card type="worst" />
    <Card type="avg" />
    <Card type="ao" :solvesCount="5" :isPb="true" />
    <Card type="ao" :solvesCount="5" />
    <Card type="ao" :solvesCount="12" :isPb="true" />
    <Card type="ao" :solvesCount="12" />
  </div>
</template>
