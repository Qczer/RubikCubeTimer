import type { Solve } from '~/types/solve'

type decimalPoints = 0 | 1 | 2 | 3

const formatMs = (ms: number, decimalPoints: NonNullable<decimalPoints>) => {
  if (decimalPoints === 0) return ''

  const factor = 10 ** (3 - decimalPoints)
  const value = Math.floor(ms / factor)

  return `.${value.toString().padStart(decimalPoints, '0')}`
}

export const formatTime = (
  ms: number,
  decimalPoints?: decimalPoints,
  plusTwo?: boolean,
  DNF?: boolean
) => {
  if (DNF || ms === Infinity) return 'DNF'
  if (decimalPoints === undefined) {
    const { timer } = useSettingsStore()
    decimalPoints = timer.decimalPoints
  }

  const totalMs = plusTwo ? ms + 2000 : ms
  const s = (totalMs % 60000) / 1000

  const hours = Math.floor(totalMs / 3600000) // hour = 3600000 ms
  const minutes = Math.floor((totalMs % 3600000) / 60000) // minute = 60000 ms
  const seconds = decimalPoints === 0 ? Math.ceil(s) : Math.floor(s)
  const milliseconds = totalMs % 1000

  const pad2 = (n: number) => n.toString().padStart(2, '0')

  const msPart = formatMs(milliseconds, decimalPoints)

  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}${msPart}`
  }
  if (minutes > 0) {
    return `${minutes}:${pad2(seconds)}${msPart}`
  }

  return `${seconds}${msPart}`
}

export const formatSolveTime = (
  solve: Solve,
  decimalPoints?: decimalPoints
) => {
  if (solve.DNF || solve.time === Infinity) return 'DNF'
  if (decimalPoints === undefined) {
    const { timer } = useSettingsStore()
    decimalPoints = timer.decimalPoints
  }

  const totalMs = getSolveTime(solve)
  const s = (totalMs % 60000) / 1000

  const hours = Math.floor(totalMs / 3600000) // hour = 3600000 ms
  const minutes = Math.floor((totalMs % 3600000) / 60000) // minute = 60000 ms
  const seconds = decimalPoints === 0 ? Math.ceil(s) : Math.floor(s)
  const milliseconds = totalMs % 1000

  const pad2 = (n: number) => n.toString().padStart(2, '0')

  const msPart = formatMs(milliseconds, decimalPoints)

  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}${msPart}`
  }
  if (minutes > 0) {
    return `${minutes}:${pad2(seconds)}${msPart}`
  }

  return `${seconds}${msPart}`
}

export const formatDate = (date: number, numerical?: boolean): string => {
  let formatted
  if (numerical) {
    formatted = new Intl.DateTimeFormat('pl-PL', {
      day: 'numeric',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } else {
    formatted = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date))
  }
  return formatted
}
