<script setup lang="ts">
const settings = useSettingsStore()
const UIStore = useUIStore()
const timer = useTimerStore()
const solves = useSolvesStore()

const scramble = useState<string>('scramble', () => '')
const hideLayout = useState('hide-layout', () => false)

const displayTime = computed(() => {
  if (timer.state === 'ready') {
    if (settings.timer.zeroOutTime || solves.solves.length === 0) {
      return formatTime(0)
    }

    const last = solves.solves[solves.solves.length - 1]
    if (last) {
      return formatSolveTime(last)
    }
  }

  if (timer.state === 'inspecting') {
    if (timer.currSolveState === '+2') return '+2'
    if (timer.currSolveState === 'DNF') return 'DNF'

    return formatTime(settings.timer.inspection.time * 1000 - timer.elapsed, 0)
  }

  if (settings.timer.hideTime) return 'solve'
  return formatTime(timer.elapsed)
})

const onKeyDown = (e: KeyboardEvent | TouchEvent) => {
  if (UIStore.isModalOpen || ('code' in e && e.code !== 'Space')) return
  e.preventDefault()

  timer.keyDown()

  if (timer.state === 'running') {
    const pb = getPB(solves.solves)

    timer.stopTimer(scramble.value)

    const lastSolve = solves.solves[solves.solves.length - 1]
    if (pb && lastSolve && lastSolve.time < pb.time) {
      shootConfetti()
    }

    if (settings.timer.hideLayout) hideLayout.value = false
  }
}

const onKeyUp = (e: KeyboardEvent | TouchEvent) => {
  if (UIStore.isModalOpen || ('code' in e && e.code !== 'Space')) return
  e.preventDefault()

  if (
    timer.state === 'inspecting' &&
    timer.pressedFor &&
    timer.pressedFor >= settings.timer.freezeTime * 1000
  ) {
    timer.startTimer()
    if (settings.timer.hideLayout) hideLayout.value = true
  } else if (timer.state === 'ready') {
    if (settings.timer.inspection.enabled) timer.startInspection()
    else timer.startTimer()

    if (settings.timer.hideLayout) hideLayout.value = true
  }

  if (timer.state === 'not-ready') {
    timer.state = 'ready'
  }

  timer.keyUp()
}

const colorClass = computed(() => {
  if (timer.state === 'not-ready') return 'text-white'

  if (timer.pressedFor === null)
    return timer.state === 'inspecting' ? 'text-red-500' : 'text-white'

  if (
    timer.state === 'ready' ||
    timer.pressedFor >= settings.timer.freezeTime * 1000
  )
    return `text-green-500`
  if (timer.pressedFor >= (settings.timer.freezeTime * 1000) / 2)
    return 'text-yellow-400'

  return 'text-red-500'
})

onMounted(() => {
  globalThis.addEventListener('keydown', onKeyDown)
  globalThis.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  globalThis.removeEventListener('keydown', onKeyDown)
  globalThis.removeEventListener('keyup', onKeyUp)
})
</script>
<template>
  <div
    class="relative flex min-h-0 flex-1 items-center justify-center max-md:absolute max-md:top-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2"
    @touchstart="onKeyDown"
    @touchend="onKeyUp"
  >
    <h2
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-9xl select-none md:text-[15rem]"
      :class="colorClass"
    >
      {{ displayTime }}
    </h2>
  </div>
</template>
