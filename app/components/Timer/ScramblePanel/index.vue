<script setup lang="ts">
import { randomScrambleForEvent } from 'cubing/scramble'
import ScrambleButton from './button.vue'

const getScramble = async () => markRaw(await randomScrambleForEvent('333'))
const scramble = shallowRef(await getScramble())
const scrambleText = computed(() => scramble.value.toString())

const locked = ref(false)
const editing = ref(false)

const toggleEdit = () => {
  editing.value = !editing.value
}
const toggleLock = () => {
  locked.value = !locked.value
}
const refresh = async () => {
  scramble.value = await getScramble()
}
</script>
<template>
  <div class="mt-5 flex flex-col items-center gap-2">
    <p v-if="!editing" class="p-1 text-2xl">
      {{ scrambleText }}
    </p>
    <input
      v-else
      class="outline-solid w-[70%] bg-transparent p-1 text-center text-2xl outline-white"
      :value="scrambleText"
    />
    <div class="flex gap-3">
      <ScrambleButton type="edit" :toggleEdit="toggleEdit" :locked="locked" />
      <ScrambleButton type="lock" :toggleLock="toggleLock" />
      <ScrambleButton type="copy" :scramble="scrambleText" />
      <ScrambleButton type="refresh" :refresh="refresh" :locked="locked" />
    </div>
  </div>
</template>
