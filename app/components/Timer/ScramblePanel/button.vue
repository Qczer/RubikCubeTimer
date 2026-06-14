<script setup lang="ts">
import { Check, Copy, LockKeyhole, Pencil, RotateCw } from '@lucide/vue'

const props = defineProps<{
  type: 'lock' | 'edit' | 'copy' | 'refresh'
  locked?: boolean
  scramble?: string
  refresh?: () => void
  toggleEdit?: () => void
  toggleLock?: () => void
}>()

const icons = {
  lock: LockKeyhole,
  edit: Pencil,
  copy: Copy,
  refresh: RotateCw
} as const

const active = ref(false)

const onClick = () => {
  if (props.type === 'copy' && props.scramble) {
    navigator.clipboard.writeText(props.scramble)

    active.value = true
    setTimeout(() => {
      active.value = false
    }, 1500)

    return
  }
  if (props.type === 'refresh' && props.refresh) {
    props.refresh()
    return
  }

  if (props.type === 'edit' && props.toggleEdit) props.toggleEdit()
  if (props.type === 'lock' && props.toggleLock) props.toggleLock()

  active.value = !active.value
}
</script>
<template>
  <button
    @click="onClick"
    class="rounded-md p-2 transition"
    :class="{ 'bg-white': active, 'opacity-60': locked }"
    :disabled="locked"
  >
    <component
      v-if="icons[props.type]"
      :is="props.type === 'copy' && active ? Check : icons[props.type]"
      :size="16"
      :color="active ? 'black' : 'white'"
      class="transition"
    />
  </button>
</template>
