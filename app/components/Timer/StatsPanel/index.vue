<script setup lang="ts">
import Solves from './Solves/index.vue'
import Stats from './Stats/index.vue'
import Scramble from './Scramble/index.vue'
</script>

<template>
  <div class="flex h-[30%] w-full shrink-0 gap-2 p-2">
    <div
      class="bg-secondary flex grow flex-col overflow-scroll rounded-2xl p-2"
    >
      <Solves />
    </div>
    <div class="flex grow flex-col rounded-2xl p-2">
      <Stats />
    </div>
    <div class="bg-secondary flex grow flex-col rounded-2xl p-2">
      <Scramble />
    </div>
  </div>
</template>
