<script setup lang="ts">
import { Plus } from '@lucide/vue'
import CreateNewSession from '~/components/Sessions/createNewSession.vue'
import SessionButton from '~/components/Sessions/sessionButton.vue'
import Dropdown from '~/components/Timer/dropdown.vue'
import type { PuzzleKey } from '~/types/puzzles'
import type { Session } from '~/types/session'
import Solves from '../components/Timer/StatsPanel/Solves/index.vue'
import LineChart from '~/components/Charts/lineChart.vue'
import ColumnChart from '~/components/Charts/columnChart.vue'
import draggable from 'vuedraggable'

const sessions = useSessionsStore()
const selectedSession = ref<Session>(sessions.currentSession)
const selectedPuzzle = ref<PuzzleKey>('333')

const showCreateNewSession = ref(false)
const createNewSession = () => (showCreateNewSession.value = true)
const closeCreateNewSession = () => (showCreateNewSession.value = false)

const chartsKey = computed(
  () => `${selectedSession.value.date}-${selectedPuzzle.value}`
)
</script>
<template>
  <div class="flex flex-1 flex-col gap-4 p-8">
    <Header title="Sessions" />
    <button
      class="absolute top-5 right-5 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2"
      @click="createNewSession"
    >
      New Session <Plus :size="20" />
    </button>
    <CreateNewSession
      v-if="showCreateNewSession"
      @close="closeCreateNewSession"
    />

    <div class="flex gap-8">
      <draggable
        v-model="sessions.sessions"
        item-key="id"
        handle=".drag-handle"
        class="flex flex-col gap-4"
      >
        <template #item="{ element }">
          <SessionButton
            :session="element"
            :selected="element === selectedSession"
            :onClick="() => (selectedSession = element)"
          />
        </template>
      </draggable>
      <div class="flex flex-1 flex-col gap-5">
        <div class="bg-surface flex justify-between rounded-2xl p-5">
          <input
            v-model="selectedSession.name"
            type="text"
            class="rounded-md bg-zinc-700 p-2 outline-none"
          />
          <Dropdown
            v-model="selectedPuzzle"
            type="puzzle"
            bg="bg-zinc-700"
            text="Stats for"
          />
        </div>
        <div class="flex gap-5">
          <div class="bg-surface relative aspect-square flex-1 rounded-xl p-5">
            <Solves :solves="selectedSession.solves[selectedPuzzle]" />
          </div>
          <div class="bg-surface aspect-square flex-1 rounded-xl p-5">
            <LineChart
              :key="`line-${chartsKey}`"
              :data="selectedSession.solves[selectedPuzzle]"
            />
          </div>
          <div class="bg-surface aspect-square flex-1 rounded-xl p-5">
            <ColumnChart
              :key="`column-${chartsKey}`"
              :data="selectedSession.solves[selectedPuzzle]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
