import { type PuzzleKey } from './puzzles'
export const defaultSettings: UserSettings = {
  timer: {
    session: 'Default Session',
    puzzle: '222',
    decimalPoints: 2,
    inspection: {
      enabled: true,
      seconds: 5,
      autoStart: false
    },
    hideLayout: true
  }
}

export interface UserSettings {
  timer: {
    session: string
    puzzle: PuzzleKey
    decimalPoints: 0 | 1 | 2 | 3
    inspection: {
      enabled: boolean
      seconds: number
      autoStart: boolean
    }
    hideLayout: boolean
  }
}
