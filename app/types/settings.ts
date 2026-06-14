import { type PuzzleKey } from './puzzles'

export const defaultSettings: UserSettings = {
  timer: {
    session: 'New Session',
    puzzle: '333',
    decimalPoints: 2,
    freezeTime: 2,
    hideTime: false,
    hideLayout: true,
    zeroOutTime: false,
    confirmDelete: false,
    personalBestConfetti: true,
    inspection: {
      enabled: true,
      time: 15,
      autoStart: false
      //playSound: false
    }
  }
}

export interface UserSettings {
  timer: {
    session: string
    puzzle: PuzzleKey
    decimalPoints: 0 | 1 | 2 | 3
    freezeTime: number
    hideTime: boolean
    hideLayout: boolean
    zeroOutTime: boolean
    confirmDelete: boolean
    personalBestConfetti: boolean
    inspection: {
      enabled: boolean
      time: number
      autoStart: boolean
      //playSound: boolean
    }
  }
}

export type SettingType = 'boolean' | 'number' | 'select'
export type SettingModelValue = boolean | number
export type SettingOption = {
  label: string
  value: number
}

export type BooleanSettingSchema = {
  type: 'boolean'
}

export type NumberSettingSchema = {
  type: 'number'
  min?: number
  max?: number
  step?: number
}

export type SelectSettingSchema = {
  type: 'select'
  options: readonly SettingOption[]
}

export type SettingSchema =
  | BooleanSettingSchema
  | NumberSettingSchema
  | SelectSettingSchema

export type TimerSettingKey = Exclude<
  keyof UserSettings['timer'],
  'session' | 'puzzle' | 'inspection'
>
export type InspectionSettingKey = keyof UserSettings['timer']['inspection']

export const timerSettingKeys = [
  'decimalPoints',
  'freezeTime',
  'hideTime',
  'hideLayout',
  'zeroOutTime',
  'confirmDelete',
  'personalBestConfetti'
] as const satisfies readonly TimerSettingKey[]

export const inspectionSettingKeys = [
  'time',
  'autoStart'
  //'playSound'
] as const satisfies readonly Exclude<InspectionSettingKey, 'enabled'>[]

type SettingsSchema = Record<TimerSettingKey, SettingSchema> & {
  inspection: Record<InspectionSettingKey, SettingSchema>
}

export const settingsSchema = {
  decimalPoints: {
    type: 'select',
    options: [0, 1, 2, 3].map((value) => ({
      label: String(value),
      value
    }))
  },
  freezeTime: { type: 'number' },
  hideTime: { type: 'boolean' },
  hideLayout: { type: 'boolean' },
  zeroOutTime: { type: 'boolean' },
  confirmDelete: { type: 'boolean' },
  personalBestConfetti: { type: 'boolean' },
  inspection: {
    enabled: { type: 'boolean' },
    time: { type: 'number' },
    autoStart: { type: 'boolean' }
    //playSound: { type: 'boolean' }
  }
} as const satisfies SettingsSchema
