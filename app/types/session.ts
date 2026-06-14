import { type PuzzleKey } from './puzzles'
import type { Solve } from './solve'

export interface Session {
  name: string
  solves: Record<PuzzleKey, Solve[]>
}
