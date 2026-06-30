<script setup lang="ts">
import { ChevronDown, EllipsisVertical } from '@lucide/vue'
import type { Session } from '~/types/session'
import Dropdown from './Dropdown/index.vue'

const sessions = useSessionsStore()
const props = defineProps<{
  session: Session
  selected?: boolean
}>()

const isCurrent = computed(() => sessions.currentSession === props.session)

const showDropdown = ref(false)
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
</script>
<template>
  <div
    class="bg-surface relative flex w-70 cursor-pointer items-center gap-2 rounded-xl px-3 py-4"
    :class="selected && 'outline-3 outline-blue-600'"
  >
    <EllipsisVertical
      :size="20"
      class="drag-handle cursor-grab active:cursor-grabbing"
    />
    <div class="flex flex-1 flex-col gap-1">
      <p>{{ session.name }}</p>
      <p class="text-sm opacity-80">{{ formatDate(session.date, true) }}</p>
    </div>
    <div class="flex flex-1 items-center justify-end">
      <button v-if="!isCurrent" class="relative" @click="toggleDropdown">
        <ChevronDown :size="20" />
        <Dropdown v-if="showDropdown" :session />
      </button>
    </div>
    <div
      v-if="isCurrent"
      class="absolute top-1.5 right-1.5 rounded-md bg-blue-600 px-1 py-0.5 text-xs"
    >
      Current
    </div>
  </div>
</template>
