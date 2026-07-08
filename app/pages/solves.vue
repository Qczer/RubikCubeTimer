<script setup lang="ts">
import Button from '~/components/Solves/Button/index.vue'
import Card from '~/components/Solves/card.vue'
import Popup from '~/components/Solves/Popup/index.vue'
import Dropdown from '~/components/Timer/dropdown.vue'
import type { PuzzleKey } from '~/types/puzzles'
import type { Solve } from '~/types/solve'
import type { SolveFilters, SolvePopup, SolveSort } from '~/types/solvesFilters'
import { getDNFOrSolveTime } from '~/utils/solvesStats'

const puzzle = ref<PuzzleKey>('333')
const sessions = useSessionsStore()
const { togglePlusTwo, toggleDNF, removeSolve, markOK } = useSolvesStore()
const allSolves = computed(() =>
  sessions.sessions.flatMap((s) => s.solves[puzzle.value] ?? [])
)

const inputValue = ref('')

const filters = ref<SolveFilters>({
  plusTwo: null,
  DNF: null
})
const sort = ref<SolveSort>({
  sortBy: 'date',
  reverseOrder: false
})

const solves = computed(() => {
  if (!allSolves.value) return []

  const filtered = allSolves.value.filter((solve) => {
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
    const value = (solve: Solve) => {
      const v =
        sort.value.sortBy === 'time' ? getDNFOrSolveTime(solve) : solve.date

      return v === 'DNF' ? Infinity : v
    }

    const result =
      sort.value.sortBy === 'time' ? value(a) - value(b) : value(b) - value(a)

    return sort.value.reverseOrder ? -result : result
  })

  return sorted
})

const buttons = computed(() => [
  {
    text: 'Delete',
    onClick: () => (popupType.value = { action: 'delete', type: 'confirm' })
  },
  {
    text: 'Change Session',
    onClick: () => (popupType.value = { action: 'session', type: 'select' })
  },
  // TODO
  // {
  // text: 'Change Event',
  // onClick: () => {
  // inputValue.value = puzzle.value
  // popupType.value = { action: 'event', type: 'select' }
  // }
  // },
  {
    text: 'Mark +2',
    onClick: () => (popupType.value = { action: '+2', type: 'confirm' })
  },
  {
    text: 'Mark DNF',
    onClick: () => (popupType.value = { action: 'DNF', type: 'confirm' })
  },
  {
    text: 'Mark OK',
    onClick: () => (popupType.value = { action: 'OK', type: 'confirm' })
  }
])

const onConfirm = () => {
  switch (popupType.value.action) {
    case 'delete':
      solves.value.forEach((s) => removeSolve(s, false))
      break
    case '+2':
      solves.value.forEach((s) => togglePlusTwo(s))
      break
    case 'DNF':
      solves.value.forEach((s) => toggleDNF(s))
      break
    case 'OK':
      solves.value.forEach((s) => markOK(s))
      break
    case 'session': {
      console.log('Moving solves to session:', inputValue.value)
      const sess = sessions.sessions.find((s) => s.name === inputValue.value)

      if (!sess) return
      const otherSessions = sessions.sessions.filter((s) => s !== sess)

      const solvesToMove = otherSessions.flatMap((s) => s.solves[puzzle.value])

      sess.solves[puzzle.value].push(...solvesToMove)
      sess.solves[puzzle.value].sort(
        (a, b) => new Date(b.date).getTime() + new Date(a.date).getTime()
      )

      otherSessions.forEach((s) => {
        s.solves[puzzle.value] = s.solves[puzzle.value].filter(
          (solve) => !solvesToMove.includes(solve)
        )
      })
      break
    }
    case 'event':
      break
  }
}

const popupType = ref<SolvePopup>({ action: null, type: null })
const showPopup = computed(() => popupType.value.action !== null)
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-4 p-8">
    <Popup
      v-if="showPopup"
      v-model="inputValue"
      :action="popupType.action"
      :type="popupType.type"
      :solvesCount="solves.length"
      :puzzle="puzzle"
      @close="popupType = { action: null, type: null }"
      @onConfirm="onConfirm"
    />
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
        <p>{{ solves.length }} solves</p>
      </div>
      <div class="flex flex-col gap-2 rounded-lg p-4 ring-3 ring-zinc-700">
        <p class="opacity-60">Bulk action on {{ solves.length }} solves</p>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="btn in buttons"
            :key="btn.text"
            :text="btn.text"
            :onClick="
              () => {
                inputValue = ''
                btn.onClick()
              }
            "
            :small="true"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <Card v-for="solve in solves" :key="solve.id" :solve="solve" />
      </div>
    </div>
  </div>
</template>
