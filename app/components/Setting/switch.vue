<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <SwitchRoot
    v-model="model"
    class="bg-surface relative h-6.25 w-10.5 shrink-0 rounded-full outline-none data-[state=checked]:bg-blue-600"
  >
    <SwitchThumb
      class="block h-5.25 w-5.25 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4.75"
    />
  </SwitchRoot>
</template>
