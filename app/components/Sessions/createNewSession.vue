<script setup lang="ts">
import { X } from '@lucide/vue'
import Dropdown from '../Timer/dropdown.vue'
import type { PuzzleKey } from '~/types/puzzles'

const UIStore = useUIStore()
const settings = useSettingsStore()
const { createSession } = useSessionsStore()

const emit = defineEmits<{
  close: []
}>()

const name = ref<string | null>(null)
const puzzle = ref<PuzzleKey | undefined>()

const createNewSession = () => {
  if (!name.value || !puzzle.value) return

  createSession(name.value)
  settings.timer.session = name.value
  settings.timer.puzzle = puzzle.value

  emit('close')
}

onMounted(() => (UIStore.isModalOpen = true))
onUnmounted(() => (UIStore.isModalOpen = false))
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="bg-surface relative mt-25 flex h-fit min-h-80 w-140 flex-col gap-5 rounded-2xl px-10 py-5"
      @click.stop
    >
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 rounded-md text-white transition hover:bg-zinc-700"
      >
        <X :size="24" />
      </button>
      <div class="flex flex-col gap-1">
        <h2 class="text-3xl font-semibold">Create new session</h2>
        <p class="text-wrap opacity-80">
          Sessions can have multiple cube types. You can split up sessions
          however you'd like: by cube type, by day, etc.
        </p>
      </div>
      <div class="flex flex-col gap-1">
        <label for="name" class="text-sm">Session Name</label>
        <input
          v-model="name"
          id="name"
          type="text"
          class="rounded-lg bg-zinc-900 p-2"
          placeholder="New Session"
        />
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-sm">Cube Type</p>
        <Dropdown v-model="puzzle" type="puzzle" bg="zinc-900" class="w-fit" />
      </div>
      <p class="text-sm opacity-50">You can change this later</p>
      <button
        class="w-fit rounded-lg bg-blue-600 px-3 py-2"
        @click="createNewSession"
      >
        Create Session
      </button>
    </div>
  </div>
</template>
