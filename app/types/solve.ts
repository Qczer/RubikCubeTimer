import type { PuzzleKey } from './puzzles'

export interface Solve {
  id: number
  time: number
  scramble: string
  puzzle: PuzzleKey
  plusTwo?: boolean
  DNF?: boolean
  date: number
  notes: string
}

export interface Average {
  time: number
  solves: Solve[]
}
