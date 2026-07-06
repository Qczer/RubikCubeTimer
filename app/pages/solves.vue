<script setup lang="ts">
import Button from '~/components/Solves/Button/index.vue'
import Card from '~/components/Solves/card.vue'
import Dropdown from '~/components/Timer/dropdown.vue'
import type { PuzzleKey } from '~/types/puzzles'
import type { SolveFilters, SolveSort } from '~/types/solvesFilters'
import { getDNFOrSolveTime } from '~/utils/solvesStats'

const puzzle = ref<PuzzleKey>('333')
const sessions = useSessionsStore()
const solves = computed(() => sessions.currentSession.solves[puzzle.value])

const filters = ref<SolveFilters>({
  plusTwo: null,
  DNF: null
})
const sort = ref<SolveSort>({
  sortBy: 'date',
  reverseOrder: false
})

const visibleSolves = computed(() => {
  const filtered = solves.value.filter((solve) => {
    const { plusTwo, DNF } = filters.value

    const matchesPlusTwo =
      plusTwo === null
        ? true
        : plusTwo === 'only'
          ? solve.plusTwo
          : !solve.plusTwo

    const matchesDnf =
      DNF === null ? true : DNF === 'only' ? solve.DNF : !solve.DNF

    return matchesPlusTwo && matchesDnf
  })

  const sorted = [...filtered].sort((a, b) => {
    const sortBy = sort.value.sortBy
    const aValue =
      sortBy === 'time' ? getDNFOrSolveTime(a) : a.date
    const bValue =
      sortBy === 'time' ? getDNFOrSolveTime(b) : b.date

    const aSortValue = aValue === 'DNF' ? Infinity : aValue
    const bSortValue = bValue === 'DNF' ? Infinity : bValue

    return sort.value.reverseOrder
      ? bSortValue - aSortValue
      : aSortValue - bSortValue
  })

  return sorted
})

const buttons = computed(() => [
  { text: 'Delete', onClick: () => {} },
  { text: 'Change Session', onClick: () => {} },
  { text: 'Change Event', onClick: () => {} },
  { text: 'Mark +2', onClick: () => {} },
  { text: 'Mark DNF', onClick: () => {} },
  { text: 'Mark OK', onClick: () => {} }
])
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-4 p-8">
    <Header title="Solves" />
    <div class="flex max-w-2xl flex-col gap-4 self-center p-2">
      <div class="flex w-full items-center justify-between">
        <div class="flex gap-2">
          <Dropdown
            v-model="puzzle"
            type="puzzle"
            class="h-full"
            bg="zinc-800"
          />
          <Button icon="filter" v-model="filters" />
          <Button icon="sort" v-model="sort" />
        </div>
        <p>{{ visibleSolves.length }} solves</p>
      </div>
      <div class="flex flex-col gap-2 rounded-lg p-4 ring-3 ring-zinc-700">
        <p class="opacity-60">
          Bulk action on {{ visibleSolves.length }} solves
        </p>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="btn in buttons"
            :key="btn.text"
            :text="btn.text"
            :onClick="btn.onClick"
            :small="true"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <Card v-for="solve in visibleSolves" :key="solve.id" :solve="solve" />
      </div>
    </div>
  </div>
</template>
