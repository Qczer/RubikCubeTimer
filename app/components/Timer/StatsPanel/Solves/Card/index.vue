<script setup lang="ts">
import { X } from '@lucide/vue'
import type { Solve } from '~/types/solve'
import Button from './button.vue'
import { twistyPlayerPuzzles } from '~/types/puzzles.js'
import { formatDate } from '#imports'

const settings = useSettingsStore()
const UIStore = useUIStore()
const { removeSolve } = useSolves()

const props = defineProps<{
  solve: Solve
}>()

const emit = defineEmits<{
  close: []
}>()

const active = ref<'scramble' | 'notes'>('scramble')
const copyActive = ref(false)
const editing = ref(false)
const toggleEdit = () => (editing.value = !editing.value)

const PlusTwo = () => (props.solve.plusTwo = !props.solve.plusTwo)
const DNF = () => (props.solve.DNF = !props.solve.DNF)
const CopyScramble = () => {
  navigator.clipboard.writeText(props.solve.scramble)
  copyActive.value = true

  setTimeout(() => {
    copyActive.value = false
  }, 1500)
}

onMounted(() => (UIStore.isModalOpen = true))
onUnmounted(() => (UIStore.isModalOpen = false))
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
      <button
        @click="emit('close')"
        class="absolute right-4 top-4 rounded-md text-white transition hover:bg-zinc-700"
      >
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
        <Button
          text="Edit"
          :onClick="toggleEdit"
          :active="editing"
          activeClass="bg-white text-black"
        />
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
      <p>{{ formatDate(solve.date) }}</p>
      <div class="w-full rounded-sm border-t border-t-[2px] border-zinc-700" />
      <div class="flex flex-col items-center gap-2 p-1">
        <div class="flex w-full gap-2">
          <button
            class="text-md rounded-md px-4 py-2 transition"
            :class="active === 'scramble' ? 'bg-blue-600' : 'bg-primary'"
            @click="active = 'scramble'"
          >
            Scramble
          </button>
          <button
            class="text-md rounded-md px-4 py-2 transition"
            :class="active === 'notes' ? 'bg-blue-600' : 'bg-primary'"
            @click="active = 'notes'"
          >
            Notes
          </button>
        </div>
        <div
          class="flex flex-col items-center gap-2"
          :class="active === 'scramble' ? '' : 'invisible h-0'"
        >
          <twisty-player
            :puzzle="twistyPlayerPuzzles[settings.timer.puzzle]"
            :alg="solve.scramble"
            hintFacelets="none"
            background="none"
            visualization="2D"
            controlPanel="none"
          />
          <input
            :disabled="!editing"
            class="text-md h-full w-[90%] w-full rounded-lg bg-transparent px-1 py-0.5 text-center ring-zinc-700 transition"
            :class="editing ? 'ring-2' : ''"
            v-model="solve.scramble"
          />
          <Button
            text="Copy Scramble"
            icon="copy"
            :active="copyActive"
            :activeClass="'bg-white text-black'"
            :onClick="CopyScramble"
          />
        </div>
        <div v-if="active === 'notes'" class="w-full">
          <textarea
            v-model="solve.notes"
            class="bg-primary w-[80%] resize-none rounded-lg p-1"
            :rows="6"
          />
        </div>
      </div>
    </div>
  </div>
</template>
