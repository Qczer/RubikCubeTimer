<script setup lang="ts">
import { X } from '@lucide/vue'
import type { SolvePopup } from '~/types/solvesFilters'
import Dropdown from '../Timer/dropdown.vue'

const props = defineProps<SolvePopup>()
const model = defineModel<string | undefined>()
const emit = defineEmits<{
  close: []
  onConfirm: []
}>()

const notReady = computed(
  () =>
    (props.type === 'confirm' && model.value !== 'confirm') ||
    (props.type === 'select' && model.value === '')
)

const header = computed(() => {
  if (props.type === 'confirm') {
    return `Bulk ${props.action} solves`
  } else if (props.action === 'session') {
    return 'Move solves'
  } else if (props.action === 'event') {
    return 'Change event type'
  }
})

const message = computed(() => {
  switch (props.action) {
    case 'delete':
      return 'You are about to do a bulk deletion of solves.'
    case '+2':
      return 'You are about to +2 the selected solves.'
    case 'DNF':
      return 'You are about to DNF the selected solves.'
    case 'OK':
      return 'You are about to remove any +2 or DNF from the selected solves.'
    case 'session':
      return 'Select a session to move the selected solves to'
    case 'event':
      return 'Select which event type to associate the selected solves with'
  }
})
</script>
<template>
  <div
    class="fixed inset-0 z-40 flex justify-center bg-black/50 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div
      class="bg-surface relative mt-25 flex h-fit w-150 flex-col gap-6 rounded-xl p-5"
      @click.stop
    >
      <button
        @click="emit('close')"
        class="absolute top-4 right-4 rounded-md text-white transition hover:bg-zinc-700"
      >
        <X :size="24" />
      </button>
      <div class="flex flex-col gap-1">
        <h2 class="text-3xl font-semibold">{{ header }}</h2>
        <p>
          {{ message }}
          {{ type === 'confirm' && 'This is irreversible. Be careful.' }}
        </p>
      </div>
      <template v-if="type === 'confirm'">
        <div
          class="flex w-40 flex-col justify-between rounded-md bg-red-500 p-4"
        >
          <p class="text-2xl font-bold">{{ solvesCount }}</p>
          <p class="opacity-80">Solves</p>
        </div>
        <div class="flex flex-col gap-2">
          <div>
            <input
              v-model="model"
              type="text"
              placeholder="confirm"
              class="w-[90%] rounded-md bg-zinc-700 p-2"
            />
            <p class="text-sm opacity-80">Type "confirm" to proceed</p>
          </div>
          <button
            :disabled="notReady"
            class="w-fit rounded-md bg-red-500 p-2 transition"
            :class="notReady && 'opacity-60'"
            @click="
              () => {
                emit('onConfirm')
                emit('close')
              }
            "
          >
            Delete {{ solvesCount }} solves
          </button>
        </div>
      </template>
      <template v-else>
        <Dropdown
          v-model="model"
          :text="!model && props.action === 'session' ? 'Select Session' : ''"
          :type="props.action === 'session' ? 'session' : 'puzzle'"
          bg="zinc-700"
        />
        <button
          :disabled="notReady"
          class="w-fit rounded-md bg-blue-600 p-2 transition"
          :class="notReady && 'opacity-60'"
          @click="
            () => {
              emit('onConfirm')
              emit('close')
            }
          "
        >
          Confirm
        </button>
      </template>
    </div>
  </div>
</template>
