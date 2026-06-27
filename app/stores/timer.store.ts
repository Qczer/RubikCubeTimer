import { defineStore } from 'pinia'
import type { Solve } from '~/types/solve'

type TimerState = 'not-ready' | 'ready' | 'inspecting' | 'running'

export const useTimerStore = defineStore('timer', {
  state: () => ({
    startTime: null as number | null,
    elapsed: 0,
    state: 'ready' as TimerState,
    currSolveState: null as null | '+2' | 'DNF',

    actionLocked: false,
    rafId: null as number | null,

    pressedTimestamp: null as number | null,
    pressedFor: null as number | null
  }),

  actions: {
    tick() {
      const settings = useSettingsStore()

      if (this.rafId === null || !this.startTime) return

      this.elapsed = performance.now() - this.startTime

      if (this.state === 'inspecting') {
        const remaining = settings.timer.inspection.time * 1000 - this.elapsed

        if (remaining <= 0) {
          if (settings.timer.inspection.autoStart) {
            this.startTimer()
          } else if (remaining <= -2000) {
            this.currSolveState = 'DNF'
          } else {
            this.currSolveState = '+2'
          }
        }
      }

      this.rafId = requestAnimationFrame(this.tick)
    },

    startInspection() {
      this.startTime = performance.now()
      this.state = 'inspecting'
      this.elapsed = 0

      this.rafId = requestAnimationFrame(this.tick)
    },

    startTimer() {
      if (this.actionLocked) return
      this.actionLocked = true

      this.startTime = performance.now()
      this.state = 'running'
      this.elapsed = 0
      this.pressedFor = null

      this.rafId = requestAnimationFrame(this.tick)
    },

    stopTimer(scramble: string) {
      const settings = useSettingsStore()
      const solves = useSolvesStore()

      if (this.actionLocked) return
      this.actionLocked = true

      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId)
        this.rafId = null
      }

      if (this.startTime) {
        this.elapsed = performance.now() - this.startTime
      }

      if (this.state === 'running') {
        const solve: Solve = {
          id: Math.floor(Math.random() * 1_000_000),
          time: this.elapsed,
          scramble,
          puzzle: settings.timer.puzzle,
          plusTwo: this.currSolveState === '+2',
          DNF: this.currSolveState === 'DNF',
          date: Date.now(),
          notes: ''
        }

        solves.addSolve(solve)
      }

      this.state = 'not-ready'
      this.currSolveState = null
    },

    keyDown() {
      this.pressedTimestamp ??= performance.now()
      this.pressedFor = performance.now() - this.pressedTimestamp
    },

    keyUp() {
      this.pressedTimestamp = null
      this.pressedFor = null

      setTimeout(() => {
        this.actionLocked = false
      }, 50)
    }
  }
})
