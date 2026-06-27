<script setup lang="ts">
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot
} from 'reka-ui'

const model = defineModel<number>({ required: true })
defineProps<{
  min?: number
  max?: number
  step?: number
}>()
</script>

<template>
  <NumberFieldRoot
    v-model="model"
    :min="min"
    :max="max"
    :step="step"
    class="bg-surface inline-flex h-8.75 items-center rounded-lg"
  >
    <NumberFieldDecrement class="px-1 sm:px-3">
      <Icon name="radix-icons:minus" />
    </NumberFieldDecrement>
    <NumberFieldInput
      class="w-5 bg-transparent text-center outline-none sm:w-14"
    />
    <NumberFieldIncrement class="px-1 sm:px-3">
      <Icon name="radix-icons:plus" />
    </NumberFieldIncrement>
  </NumberFieldRoot>
</template>
