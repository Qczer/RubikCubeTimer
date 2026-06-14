<script setup lang="ts">
import 'cubing/twisty'
import { twistyPlayerPuzzles } from '~/types/puzzles'

const settings = useSettingsStore()
const scrambleText = useState<string>('scramble', () => '')
</script>
<template class="flex h-9 shrink-0 flex-row items-center justify-center pr-1.5">
  <twisty-player
    v-if="scrambleText"
    class="w-full"
    :puzzle="twistyPlayerPuzzles[settings.timer.puzzle]"
    :alg="scrambleText"
    hintFacelets="none"
    background="none"
    visualization="2D"
    controlPanel="none"
  />
</template>
