<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <CheckboxRoot
    v-model="model"
    class="flex h-5 w-5 appearance-none items-center justify-center rounded-md border-2 border-transparent bg-gray-600 transition hover:border-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
  >
    <CheckboxIndicator
      class="flex h-full w-full items-center justify-center rounded"
    >
      <Icon icon="radix-icons:check" class="h-5 w-5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
