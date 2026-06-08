<script setup lang="ts">
import Dropdown from '~/components/Timer/dropdown.vue'
import Timer from '~/components/Timer/timer.vue'

const hideLayout = useState('hide-layout')

const mode = ref<string | undefined>()
const session = ref<string | undefined>()
</script>

<template>
  <div v-if="!hideLayout" class="flex gap-2 p-2">
    <Dropdown v-model="mode" type="mode" />
    <Dropdown v-model="session" type="session" />
  </div>
  <Timer />
</template>
