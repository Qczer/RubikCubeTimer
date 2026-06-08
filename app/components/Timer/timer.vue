<script setup lang="ts">
const hideLayout = useState('hide-layout', () => false)

const startTime = ref<number | null>(null)
const elapsed = ref(0)
const running = ref(false)
const inspecting = ref(false)
const canStart = ref(true)

const holdingTime = ref<number | null>(null)
const stoppedOnKeyDown = ref(false)

let rafId: number | null = null

const settings = {
  decimalPoints: 2,
  inspection: {
    enabled: true,
    seconds: 15,
    autoStart: false
  },
  hideLayout: true
}

const formatTime = (ms: number, plusTwo: boolean, DNF: boolean) => {
  const days = Math.floor(ms / 86400000) // day = 86400000 ms
  const hours = Math.floor((ms % 86400000) / 3600000) // hour = 3600000 ms
  const minutes = Math.floor((ms % 3600000) / 60000) // minute = 60000 ms
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = Math.floor(
    (ms % 1000) / Math.pow(10, 3 - settings.decimalPoints)
  )

  if (inspecting.value) return seconds

  const paddedMinutes = minutes.toString().padStart(2, '0')
  const paddedMilliseconds = milliseconds
    .toString()
    .padStart(settings.decimalPoints, '0')
  const paddedSeconds = seconds.toString().padStart(2, '0')

  if (days > 0) {
    return `${days}d ${hours}:${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`
  }
  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`
  }
  if (minutes > 0) {
    return `${minutes}:${paddedSeconds}:${paddedMilliseconds}`
  }

  return `${seconds}.${paddedMilliseconds}`
}

const tick = () => {
  if ((!running.value && !inspecting.value) || startTime.value === null) return

  elapsed.value = performance.now() - startTime.value
  if (inspecting.value) {
    const remaining = settings.inspection.seconds * 1000 - elapsed.value

    if (remaining <= 0) {
      if (settings.inspection.autoStart) {
        startTimer()
      } else {
        inspecting.value = false
      }
    }
  }

  rafId = requestAnimationFrame(tick)
}

const startInspection = () => {
  startTime.value = performance.now()
  inspecting.value = true
  canStart.value = false
  elapsed.value = 0

  if (settings.hideLayout) {
    hideLayout.value = true
  }

  rafId = requestAnimationFrame(tick)
}

const startTimer = () => {
  startTime.value = performance.now()
  running.value = true
  inspecting.value = false
  canStart.value = false
  elapsed.value = 0

  if (settings.hideLayout) {
    hideLayout.value = true
  }

  rafId = requestAnimationFrame(tick)
}

const stopTimer = () => {
  running.value = false

  if (hideLayout.value) {
    hideLayout.value = false
  }

  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const pressedTimestamp = ref<number | null>(null)

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  e.preventDefault()

  if (!pressedTimestamp.value) {
    pressedTimestamp.value = performance.now()
  }
  holdingTime.value = performance.now() - pressedTimestamp.value

  if (running.value) {
    stopTimer()
    stoppedOnKeyDown.value = true
  }
}

const onKeyUp = (e: KeyboardEvent) => {
  if (e.code !== 'Space') return
  e.preventDefault()

  if (stoppedOnKeyDown.value) {
    stoppedOnKeyDown.value = false
  } else if (
    inspecting.value &&
    holdingTime.value &&
    holdingTime.value >= 1000
  ) {
    startTimer()
  } else if (canStart.value) {
    if (settings.inspection.enabled) {
      startInspection()
    } else {
      startTimer()
    }
  }

  if (!inspecting.value && !running.value) {
    canStart.value = true
  }

  holdingTime.value = null
  pressedTimestamp.value = null
}

const colorClass = computed(() => {
  if (
    canStart.value &&
    !inspecting.value &&
    !running.value &&
    holdingTime.value !== null
  ) {
    return `text-green-500`
  }

  if (holdingTime.value === null) return 'text-white'
  if (holdingTime.value >= 1000) return 'text-green-500'
  if (holdingTime.value >= 500) return 'text-yellow-400'
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
  <h2
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-[15rem]"
    :class="colorClass"
  >
    {{ formatTime(elapsed, false, false) }}
  </h2>
</template>
