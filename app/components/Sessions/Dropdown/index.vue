<script setup lang="ts">
import type { Session } from '~/types/session.js'
import Button from './button.vue'

const props = defineProps<{
  session: Session
}>()

const sessions = useSessionsStore()
const settings = useSettingsStore()

const buttons = computed(() => [
  {
    text: 'Make current',
    onClick: () => (settings.timer.session = props.session.name)
  },
  {
    text: 'Merge session',
    onClick: () => sessions.mergeSession(props.session)
  },
  {
    text: 'Delete session',
    onClick: () => sessions.deleteSession(props.session)
  }
])
</script>
<template>
  <div
    class="absolute top-full z-50 mt-2 flex flex-col gap-1 rounded-lg bg-zinc-900 p-2"
  >
    <Button v-for="b in buttons" :text="b.text" :onClick="b.onClick" />
  </div>
</template>
