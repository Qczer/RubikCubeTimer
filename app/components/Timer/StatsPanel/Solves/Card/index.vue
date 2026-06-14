<script setup lang="ts">
import { X } from '@lucide/vue'
import type { Solve } from '~/types/solve'
import Button from './button.vue'
import { twistyPlayerPuzzles } from '~/types/puzzles.js'

const settings = useSettingsStore()
const { removeSolve } = useSolves()

const props = defineProps<{
  solve: Solve
}>()

const emit = defineEmits<{
  close: []
}>()

const editing = ref(false)
const toggleEdit = () => (editing.value = !editing.value)

const PlusTwo = () => (props.solve.plusTwo = !props.solve.plusTwo)
const DNF = () => (props.solve.DNF = !props.solve.DNF)
const CopyScramble = () => navigator.clipboard.writeText(props.solve.scramble)
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="bg-secondary relative flex min-h-[500px] flex-col items-center gap-5 rounded-2xl px-10 py-5 text-center"
      @click.stop
    >
      <button @click="emit('close')" class="absolute right-4 top-4 text-white">
        <X :size="24" />
      </button>
      <div class="flex w-full justify-end gap-2 px-5">
        <Button
          text="Delete"
          :onClick="
            () => {
              removeSolve(solve)
              emit('close')
            }
          "
        />
        <Button text="Edit" :onClick="toggleEdit" />
      </div>
      <div class="flex flex-col gap-4">
        <h2 class="text-5xl">
          {{ formatTime(solve.time, 2, solve.plusTwo, solve.DNF) }}
        </h2>
        <div class="flex gap-2">
          <Button text="3x3" icon="cube" disabled />
          <Button
            text="+2"
            :active="solve.plusTwo"
            activeClass="bg-orange-500"
            :onClick="PlusTwo"
          />
          <Button
            text="DNF"
            :active="solve.DNF"
            activeClass="bg-red-500"
            :onClick="DNF"
          />
        </div>
      </div>
      <div
        class="w-full rounded-sm border-t border-t-[2px] border-zinc-700"
      ></div>
      <div class="flex flex-col items-center gap-2">
        <twisty-player
          :puzzle="twistyPlayerPuzzles[settings.timer.puzzle]"
          :alg="solve.scramble"
          hintFacelets="none"
          background="none"
          visualization="2D"
          controlPanel="none"
        />
        <p v-if="!editing" class="text-md p-1">
          {{ solve.scramble }}
        </p>
        <input
          v-else
          class="text-md w-full rounded-lg bg-transparent p-1 text-center outline outline-2 outline-zinc-700"
          v-model="solve.scramble"
        />
        <Button text="Copy Scramble" icon="copy" :onClick="CopyScramble" />
      </div>
    </div>
  </div>
</template>
