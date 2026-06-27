import type { Solve } from '~/types/solve'

export const isSolve = (value: unknown): value is Solve => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'time' in value &&
    'scramble' in value
  )
}
