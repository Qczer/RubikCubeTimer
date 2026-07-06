<script setup lang="ts">
import { ArrowUpWideNarrow, Funnel } from '@lucide/vue'
import type {
  FilterValue,
  SolveFilters,
  SolveSort
} from '~/types/solvesFilters'
import Option from './option.vue'
import Checkbox from '~/components/Setting/checkbox.vue'

const props = defineProps<{
  text?: string
  icon?: 'cube' | 'filter' | 'sort'
  onClick?: () => void
  small?: boolean
}>()
const model = defineModel<SolveFilters | SolveSort>({ required: false })

const icons = {
  filter: Funnel,
  sort: ArrowUpWideNarrow
} as const

const iconComponent = computed(() =>
  props.icon && props.icon !== 'cube' ? icons[props.icon] : null
)

const filterModel = computed<SolveFilters | null>(() =>
  props.icon === 'filter'
    ? ((model.value as SolveFilters | undefined) ?? null)
    : null
)

const sortModel = computed<SolveSort | null>(() =>
  props.icon === 'sort'
    ? ((model.value as SolveSort | undefined) ?? null)
    : null
)

const bindFilter = (key: keyof SolveFilters) =>
  computed<FilterValue>({
    get: () => filterModel.value?.[key] ?? null,
    set: (value) => {
      if (!filterModel.value) return
      model.value = {
        ...filterModel.value,
        [key]: value
      } as SolveFilters
    }
  })

const plusTwoFilter = bindFilter('plusTwo')
const dnfFilter = bindFilter('DNF')
const bindSortBy = (value: SolveSort['sortBy']) =>
  computed<boolean>({
    get: () => sortModel.value?.sortBy === value,
    set: (checked) => {
      if (!checked || !sortModel.value) return
      model.value = {
        ...sortModel.value,
        sortBy: value
      } as SolveSort
    }
  })

const reverseOrder = computed<boolean>({
  get: () => sortModel.value?.reverseOrder ?? false,
  set: (checked) => {
    if (!sortModel.value) return
    model.value = {
      ...sortModel.value,
      reverseOrder: checked
    } as SolveSort
  }
})
const dateSort = bindSortBy('date')
const timeSort = bindSortBy('time')

const showDropdown = ref(false)
const root = ref<HTMLElement | null>(null)

const handleDocumentClick = (event: MouseEvent) => {
  if (!showDropdown.value || !root.value) return
  if (root.value.contains(event.target as Node)) return
  showDropdown.value = false
}

onMounted(() => document.addEventListener('mousedown', handleDocumentClick))
onBeforeUnmount(() =>
  document.removeEventListener('mousedown', handleDocumentClick)
)

const finalOnClick = () => {
  if (props.icon === 'filter' || props.icon === 'sort') {
    showDropdown.value = !showDropdown.value
  }
  props.onClick?.()
}
</script>
<template>
  <div ref="root" class="relative w-fit">
    <button
      type="button"
      class="text-md flex w-fit items-center gap-1 rounded-lg bg-zinc-800 capitalize"
      :class="!small ? ['h-8.75 min-w-8.75 px-3.75'] : ['px-3 py-1.5']"
      @click="finalOnClick"
    >
      <span :class="small && 'text-sm'">{{ text ?? icon }}</span>
      <component v-if="iconComponent" :is="iconComponent" :size="16" />
      <img
        v-else-if="icon === 'cube'"
        src="/icons/cuboid.svg"
        class="h-4 invert"
        alt="Cube"
      />
    </button>
    <div
      v-if="showDropdown"
      class="absolute top-full z-25 mt-2 rounded-lg bg-zinc-800 p-4"
      @click.stop
    >
      <template v-if="icon === 'filter'">
        <Option v-model="plusTwoFilter" text="+2 Only" option="only" />
        <Option v-model="plusTwoFilter" text="No +2s" option="no" />
        <Option v-model="dnfFilter" text="DNF Only" option="only" />
        <Option v-model="dnfFilter" text="No DNFs" option="no" />
      </template>
      <template v-else-if="icon === 'sort'">
        <label
          class="flex w-full cursor-pointer items-center gap-1 text-nowrap"
        >
          <Checkbox v-model="dateSort" />
          Date
        </label>
        <label
          class="flex w-full cursor-pointer items-center gap-1 text-nowrap"
        >
          <Checkbox v-model="timeSort" />
          Time
        </label>
        <label
          class="flex w-full cursor-pointer items-center gap-1 text-nowrap"
        >
          <Checkbox v-model="reverseOrder" />
          ReverseOrder
        </label>
      </template>
    </div>
  </div>
</template>
