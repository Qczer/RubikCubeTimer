<script setup lang="ts">
import Checkbox from '~/components/Setting/checkbox.vue'
import type { FilterValue } from '~/types/solvesFilters'

const props = defineProps<{
  text: string
  option: 'only' | 'no'
}>()

const model = defineModel<FilterValue>({ required: true })

const checked = computed<boolean>({
  get: () => model.value === props.option,
  set: (value) => {
    model.value = value ? props.option : null
  }
})
</script>
<template>
  <label class="flex w-full cursor-pointer gap-1 text-nowrap">
    <Checkbox v-model="checked" />
    {{ text }}
  </label>
</template>
