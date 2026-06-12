<script setup lang="ts">
import Dropdown from '~/components/Timer/dropdown.vue'
import StatsPanel from '~/components/Timer/StatsPanel/index.vue'
import Timer from '~/components/Timer/index.vue'

const hideLayout = useState('hide-layout')

const mode = ref<string | undefined>()
const session = ref<string | undefined>()
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <div v-if="!hideLayout" class="flex h-auto w-full shrink-0 gap-2 p-2">
      <Dropdown v-model="mode" type="mode" />
      <Dropdown v-model="session" type="session" />
    </div>
    <Timer />
    <StatsPanel v-if="!hideLayout" />
  </div>
</template>
