<script setup lang="ts">
import type { PuzzleKey } from '~/types/puzzles'
import puzzles from '~/types/puzzles'
import type { Average } from '~/types/solve'

const UIStore = useUIStore()

const props = defineProps<{
  average: Average
  puzzle: PuzzleKey
  solvesCount?: number
  isPb?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const getHeader = computed(() => {
  return `${props.isPb ? 'best' : 'current'} ${puzzles[props.puzzle]} average ${props.solvesCount ? 'of ' + props.solvesCount : ''}`
})

onMounted(() => (UIStore.isModalOpen = true))
onUnmounted(() => (UIStore.isModalOpen = false))
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="bg-surface relative flex min-h-125 flex-col items-center gap-5 rounded-2xl px-10 py-5 text-center"
      @click.stop
    >
      <h2 class="text-4xl capitalize">
        {{ getHeader }}
      </h2>
    </div>
  </div>
</template>
