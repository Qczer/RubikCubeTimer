<script setup lang="ts">
import Panel from './panel.vue'
const solves = useState<number[]>('solves')

const pb = computed(() => {
  if (solves.value.length === 0) return null
  return Math.min(...solves.value)
})
</script>

<template>
  <div class="flex h-[30%] w-full shrink-0 gap-2 p-2">
    <div class="bg-secondary flex grow flex-col rounded-2xl p-2">
      <p v-if="solves.length === 0">No solves yet</p>
      <p v-for="(solve, i) in solves" :key="i">
        {{ formatTime(solve) }}
      </p>
    </div>
    <div class="grid grow grid-cols-2 grid-rows-4 gap-1 px-2 py-3">
      <Panel text="pb" :value="pb" :height="2" />
      <Panel text="worst" />
      <Panel text="avg" />
      <Panel text="ao5 pb" />
      <Panel text="ao5" />
      <Panel text="ao12 pb" />
      <Panel text="ao12" />
    </div>
    <div class="bg-secondary flex grow flex-col rounded-2xl p-2">
      Cube model 2D
    </div>
  </div>
</template>
