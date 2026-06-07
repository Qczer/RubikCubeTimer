<script setup lang="ts">
import Dropdown from '~/components/Timer/dropdown.vue'

const mode = ref<string | undefined>()
const session = ref<string | undefined>()
</script>

<template>
  <Dropdown v-model="mode" type="mode"/>
  <Dropdown v-model="session" type="session"/>
</template>
