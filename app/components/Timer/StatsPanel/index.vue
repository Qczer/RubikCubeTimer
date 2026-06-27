<script setup lang="ts">
import Solves from './Solves/index.vue'
import Stats from './Stats/index.vue'
import Scramble from './Scramble/index.vue'
</script>

<template>
  <div class="@container hidden h-[30%] w-full shrink-0 gap-2 p-2 md:flex">
    <div class="bg-surface relative flex-1 rounded-2xl p-4">
      <Solves />
    </div>
    <div class="relative flex-1 rounded-2xl p-2">
      <Stats />
    </div>
    <div class="bg-surface relative hidden flex-1 rounded-2xl p-2 xl:block">
      <Scramble />
    </div>
  </div>
</template>
