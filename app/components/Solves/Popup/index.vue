<script setup lang="ts">
import { X } from '@lucide/vue'
import type { SolvePopup } from '~/types/solvesFilters'
import Dropdown from '../../Timer/dropdown.vue'
import RedCard from './redCard.vue'

const props = defineProps<SolvePopup>()
const model = defineModel<string | undefined>()
const emit = defineEmits<{
  close: []
  onConfirm: []
}>()

const localType = ref(props.type)
const session = ref<string | undefined>()

const notReady = computed(
  () =>
    (localType.value === 'confirm' && model.value !== 'confirm') ||
    (localType.value === 'select' && model.value === '')
)

const header = computed(() => {
  if (localType.value === 'confirm') {
    return `Bulk ${props.action === 'session' ? 'move' : props.action} solves`
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
      if (localType.value === 'confirm')
        return `You are about to do a bulk move of solves.`

      return 'Select a session to move the selected solves to'
    case 'event':
      return 'Select which event type to associate the selected solves with'
  }
})

const confirmBtnText = computed(() => {
  if (props.action === 'session') {
    return 'Move'
  } else if (props.action) {
    return capitalizeFirstLetter(props.action)
  }
})

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
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
          {{ localType === 'confirm' && 'This is irreversible. Be careful.' }}
        </p>
      </div>
      <template v-if="localType === 'confirm'">
        <div class="flex gap-2">
          <RedCard
            v-if="solvesCount"
            :header="solvesCount"
            :subheader="'Solves'"
          />
          <RedCard
            v-if="session"
            :header="session"
            :subheader="puzzle ? (getMainSession(puzzle) ?? session) : session"
          />
        </div>
        <form
          class="flex flex-col gap-2"
          @submit.prevent="
            () => {
              if (notReady) return

              model = session
              emit('onConfirm')
              emit('close')
            }
          "
        >
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
            type="submit"
            class="w-fit rounded-md bg-red-500 p-2 transition"
            :class="notReady && 'opacity-60'"
          >
            {{ confirmBtnText }} {{ solvesCount }} solves
          </button>
        </form>
      </template>
      <template v-else>
        <Dropdown
          v-model="model"
          :text="!model && props.action === 'session' ? 'Select Session' : ''"
          :type="props.action === 'session' ? 'session' : 'puzzle'"
          bg="zinc-700"
        />
        <p
          v-if="solvesCount && model"
          class="w-fit border-b-4 border-zinc-700 text-2xl"
        >
          Move
          <span class="text-green-600">{{ solvesCount }} solves</span> to
          <span class="text-orange-600">{{ model }}</span>
        </p>
        <button
          :disabled="notReady"
          class="w-fit rounded-md bg-blue-600 p-2 transition"
          :class="notReady && 'opacity-60'"
          @click="
            () => {
              session = model
              localType = 'confirm'
              model = ''
            }
          "
        >
          Continue
        </button>
      </template>
    </div>
  </div>
</template>
