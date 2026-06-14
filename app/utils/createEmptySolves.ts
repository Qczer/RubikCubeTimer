import { puzzles } from 'cubing/puzzles'
import type { PuzzleKey } from '~/types/puzzles'
import type { Solve } from '~/types/solve'

export const createEmptySolves = (): Record<PuzzleKey, Solve[]> => {
  const result = {} as Record<PuzzleKey, Solve[]>

  for (const key of Object.keys(puzzles) as PuzzleKey[]) {
    result[key] = []
  }

  return result
}
