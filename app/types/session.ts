import { type PuzzleKey } from './puzzles'
import type { Solve } from './solve'

export interface Session {
  name: string
  date: number
  solves: Record<PuzzleKey, Solve[]>
}
