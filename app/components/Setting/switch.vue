<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const model = defineModel<boolean>({ required: true })
</script>

<template>
  <SwitchRoot
    v-model="model"
    class="bg-secondary relative h-[25px] w-[42px] rounded-full outline-none data-[state=checked]:bg-blue-600"
  >
    <SwitchThumb
      class="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[19px]"
    />
  </SwitchRoot>
</template>
