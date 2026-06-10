import type { Average, Solve } from '~/types/solve'

export const getPB = (solves: Solve[]): Solve | null => {
  const valid = solves.filter((s) => !s.DNF)
  if (valid.length === 0) return null

  return valid.reduce((best, current) => {
    const currentTime = current.plusTwo ? current.time + 2000 : current.time
    const bestTime = best.plusTwo ? best.time + 2000 : best.time
    return currentTime < bestTime ? current : best
  })
}

export const getWorst = (solves: Solve[]): Solve | null => {
  const valid = solves.filter((s) => !s.DNF)
  if (valid.length === 0) return null

  return valid.reduce((worst, current) => {
    const currentTime = current.plusTwo ? current.time + 2000 : current.time
    const bestTime = worst.plusTwo ? worst.time + 2000 : worst.time
    return currentTime > bestTime ? current : worst
  })
}

// Get Average Of - excludes the best and worst solve
export const getAO = (solves: Solve[]): Average | null => {
  if (solves.length === 0) return null

  const solvesLeft = [...solves].sort((a, b) => a.time - b.time).slice(1, -1)
  return getMO(solvesLeft)
}

// Get Mean Of - includes all solves
export const getMO = (solves: Solve[]): Average | null => {
  if (solves.length === 0) return null

  const sum = solves.reduce((a, b) => a + b.time, 0)
  return { time: sum / solves.length, solves }
}
