<script setup lang="ts">
import { randomScrambleForEvent } from 'cubing/scramble'
import ScrambleButton from './button.vue'
import { getScrambleType } from '~/types/puzzles.js'

const settings = useSettingsStore()

const getScramble = async () =>
  markRaw(await randomScrambleForEvent(getScrambleType(settings.timer.puzzle)))
const scramble = shallowRef(await getScramble())
const scrambleText = useState<string>('scramble', () =>
  scramble.value.toString()
)
const generateScramble = async () => {
  scramble.value = markRaw(
    await randomScrambleForEvent(getScrambleType(settings.timer.puzzle))
  )
}

watch(
  scramble,
  () => {
    scrambleText.value = scramble.value.toString()
  },
  { immediate: true }
)
watch(
  () => settings.timer.puzzle,
  async () => {
    await generateScramble()
  }
)

const locked = ref(false)
const editing = ref(false)

const toggleEdit = () => (editing.value = !editing.value)
const toggleLock = () => (locked.value = !locked.value)
const refresh = async () => (scramble.value = await getScramble())
</script>
<template>
  <div class="mt-5 flex flex-col items-center gap-2">
    <input
      :disabled="!editing"
      class="outline-solid w-[70%] rounded-lg bg-transparent p-1 text-center text-2xl outline-zinc-700"
      :class="editing ? 'outline' : ''"
      v-model="scrambleText"
    />
    <div class="flex gap-3">
      <ScrambleButton type="edit" :toggleEdit="toggleEdit" :locked="locked" />
      <ScrambleButton type="lock" :toggleLock="toggleLock" />
      <ScrambleButton type="copy" :scramble="scrambleText" />
      <ScrambleButton type="refresh" :refresh="refresh" :locked="locked" />
    </div>
  </div>
</template>
