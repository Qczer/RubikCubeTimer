<script setup lang="ts">
import confetti from 'canvas-confetti'
import type { Solve } from '~/types/solve'

const hideLayout = useState('hide-layout', () => false)
const solves = useState('solves', () => <Solve[]>[])

const startTime = ref<number | null>(null)
const elapsed = ref(0)
const state = ref<'not-ready' | 'ready' | 'inspecting' | 'running'>('ready')
const currSolveState = ref<null | '+2' | 'DNF'>(null)

const pressedFor = ref<number | null>(null)

let rafId: number | null = null

const settings = {
  decimalPoints: 2,
  inspection: {
    enabled: true,
    seconds: 5,
    autoStart: false
  },
  hideLayout: true
}

const displayTime = computed(() => {
  if (state.value === 'inspecting') {
    return Math.ceil(
      (settings.inspection.seconds * 1000 - elapsed.value) / 1000
    )
  }

  return formatTime(elapsed.value, settings.decimalPoints)
})

const tick = () => {
  if (rafId === null || !startTime.value) return

  elapsed.value = performance.now() - startTime.value
  if (state.value === 'inspecting') {
    const remaining = settings.inspection.seconds * 1000 - elapsed.value

    if (remaining <= 0) {
      if (settings.inspection.autoStart) {
        startTimer()
      } else {
        if (remaining <= -2000) currSolveState.value = 'DNF'
        else currSolveState.value = '+2'
      }
    }
  }

  rafId = requestAnimationFrame(tick)
}

const startInspection = () => {
  startTime.value = performance.now()
  state.value = 'inspecting'
  elapsed.value = 0

  if (settings.hideLayout) {
    hideLayout.value = true
  }

  rafId = requestAnimationFrame(tick)
}

const startTimer = () => {
  startTime.value = performance.now()
  state.value = 'running'
  elapsed.value = 0

  if (settings.hideLayout) {
    hideLayout.value = true
  }

  rafId = requestAnimationFrame(tick)
}

const stopTimer = (addTime: boolean = true) => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  if (startTime.value) {
    elapsed.value = performance.now() - startTime.value
  }

  if (addTime && state.value === 'running') {
    const worstTime = getWorst(solves.value)?.time
    if (worstTime && elapsed.value < worstTime) {
      const colors = ['#006bb2', '#0880d1', '#098be2']
      confetti({
        particleCount: 150,
        angle: 40,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        gravity: 2,
        startVelocity: 70
      })
      confetti({
        particleCount: 150,
        angle: 140,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        gravity: 2,
        startVelocity: 70
      })
    }

    const lastId = solves.value[-1]?.id ?? 0
    solves.value.push({
      id: lastId + 1,
      time: elapsed.value,
      scramble: '',
      plusTwo: currSolveState.value === '+2',
      DNF: currSolveState.value === 'DNF'
    })
  }

  state.value = 'not-ready'

  if (hideLayout.value) {
    hideLayout.value = false
  }
}

const pressedTimestamp = ref<number | null>(null)

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  e.preventDefault()

  if (!pressedTimestamp.value) {
    pressedTimestamp.value = performance.now()
  }

  pressedFor.value = performance.now() - pressedTimestamp.value

  if (state.value === 'running') {
    stopTimer()
  }
}

const onKeyUp = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  e.preventDefault()

  if (
    state.value === 'inspecting' &&
    pressedFor.value &&
    pressedFor.value >= 1000
  ) {
    startTimer()
  } else if (state.value === 'ready') {
    if (settings.inspection.enabled) {
      startInspection()
    } else {
      startTimer()
    }
  }

  if (state.value === 'not-ready') {
    state.value = 'ready'
  }

  pressedFor.value = null
  pressedTimestamp.value = null
}

const colorClass = computed(() => {
  if (state.value === 'not-ready') {
    return 'text-white'
  }

  if (pressedFor.value === null)
    return state.value === 'inspecting' ? 'text-red-500' : 'text-white'

  if (state.value === 'ready' && pressedFor.value !== null)
    return `text-green-500`

  if (pressedFor.value >= 1000) return 'text-green-500'
  if (pressedFor.value >= 500) return 'text-yellow-400'

  return 'text-red-500'
})

onMounted(() => {
  globalThis.addEventListener('keydown', onKeyDown)
  globalThis.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  globalThis.removeEventListener('keydown', onKeyDown)
  globalThis.removeEventListener('keyup', onKeyUp)
  stopTimer()
})
</script>
<template>
  <div class="relative flex flex-1 items-center justify-center">
    <h2
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-[15rem]"
      :class="colorClass"
    >
      {{ displayTime }}
    </h2>
  </div>
</template>
