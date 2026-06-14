import { puzzles } from 'cubing/puzzles'
import type { PuzzleKey } from '~/types/puzzles'
import type { Solve } from '~/types/solve'

export const createEmptySolves = (): Record<PuzzleKey, Solve[]> => {
  const keys = Object.keys(puzzles) as PuzzleKey[]

  const entries: [PuzzleKey, Solve[]][] = keys.map((key) => [
    key,
    [] as Solve[]
  ])

  return Object.fromEntries(entries) as Record<PuzzleKey, Solve[]>
}
