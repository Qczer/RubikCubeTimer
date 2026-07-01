<script setup lang="ts">
import type { PuzzleKey } from '~/types/puzzles'
import puzzles from '~/types/puzzles'
import type { Average, Solve } from '~/types/solve'
import SolveCard from './solveCard.vue'
import { X } from '@lucide/vue'
import Checkbox from '~/components/Setting/checkbox.vue'

const UIStore = useUIStore()
const solvesStore = useSolvesStore()

const props = defineProps<{
  average: Average
  puzzle: PuzzleKey
  open: boolean
  solvesCount?: number
  isPb?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const {
  selected: selectedSolve,
  isOpen: isSolveOpen,
  open: showSolve,
  close: closeSolve,
  clearAfterLeave: clearSolve
} = useTransitionedSelection<Solve>()

const getHeader = computed(() => {
  return `${props.isPb ? 'best' : 'current'} ${puzzles[props.puzzle]} average ${props.solvesCount ? 'of ' + props.solvesCount : ''}:`
})

const colors = {
  dnf: 'text-dnf',
  plusTwo: 'text-plusTwo',
  green: 'text-green'
}

const getColor = (solve: Solve) => {
  if (solve.DNF) return colors.dnf
  if (solve.plusTwo) return colors.plusTwo
  return colors.green
}

const reversedSolves = ref(false)
const solves = computed(() => {
  const list = props.average.solves

  return reversedSolves.value ? [...list].reverse() : list
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      UIStore.isModalOpen = true
      reversedSolves.value = false
    } else {
      closeSolve()
      clearSolve()
    }
  },
  { immediate: true }
)
onUnmounted(() => (UIStore.isModalOpen = false))

const handleAfterLeave = () => {
  UIStore.isModalOpen = false
}
</script>

<template>
  <Transition
    appear
    enter-active-class="transition-all duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    @after-leave="handleAfterLeave"
  >
    <div
      v-show="open"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click="emit('close')"
    >
      <div
        class="bg-surface relative flex min-h-125 flex-col justify-between rounded-2xl p-10"
        @click.stop
      >
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 rounded-md text-white transition hover:bg-zinc-700"
        >
          <X :size="24" />
        </button>
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-bold capitalize">
            {{ getHeader }}
            <span class="font-normal text-blue-500">{{
              formatTime(average.time)
            }}</span>
          </h2>
          <p class="text-lg opacity-90">{{ formatDate(average.date, true) }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <label class="flex w-fit items-center gap-2">
            <Checkbox v-model="reversedSolves" />
            Reverse Order
          </label>
          <div class="flex flex-col gap-1">
            <div
              v-for="(solve, i) in solves"
              :key="i"
              class="flex h-9 shrink-0 flex-row items-center justify-center pr-1.5"
            >
              <span class="min-w-10 pr-1.5"
                >{{ reversedSolves ? i + 1 : solves.length - i }}.</span
              >
              <span
                class="w-37.5 shrink-0 cursor-pointer transition hover:underline"
                :class="getColor(solve)"
                @click="showSolve(solve)"
                >{{ formatSolveTime(solve) }}</span
              >
              <div class="flex w-full flex-row justify-end gap-2">
                <span
                  class="cursor-pointer text-sm font-bold transition hover:opacity-100"
                  :class="
                    solve.plusTwo
                      ? `${colors.plusTwo} opacity-100`
                      : 'opacity-60'
                  "
                  @click="solvesStore.togglePlusTwo(solve)"
                >
                  +2
                </span>
                <span
                  class="cursor-pointer text-sm font-bold transition hover:opacity-100"
                  :class="
                    solve.DNF ? `${colors.dnf} opacity-100` : 'opacity-60'
                  "
                  @click="solvesStore.toggleDNF(solve)"
                >
                  DNF
                </span>
                <X
                  class="cursor-pointer opacity-60 transition hover:opacity-100"
                  :size="20"
                  @click="solvesStore.removeSolve(solve)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <SolveCard
    :open="isSolveOpen"
    :solve="selectedSolve"
    @close="closeSolve"
    @after-leave="clearSolve"
  />
</template>
