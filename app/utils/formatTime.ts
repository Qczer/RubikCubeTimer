export const formatTime = (
  ms: number,
  decimalPoints: 0 | 1 | 2 | 3 = 2,
  plusTwo?: boolean,
  DNF?: boolean
) => {
  if (DNF) return 'DNF'

  const totalMs = plusTwo ? ms + 2000 : ms

  const hours = Math.floor(totalMs / 3600000) // hour = 3600000 ms
  const minutes = Math.floor((totalMs % 3600000) / 60000) // minute = 60000 ms
  const seconds = Math.floor((totalMs % 60000) / 1000)
  const milliseconds = totalMs % 1000

  const pad2 = (n: number) => n.toString().padStart(2, '0')

  const formatMs = (ms: number) => {
    if (decimalPoints === 0) return ''

    const factor = 10 ** (3 - decimalPoints)
    const value = Math.floor(ms / factor)

    return `.${value.toString().padStart(decimalPoints, '0')}`
  }

  const msPart = formatMs(milliseconds)

  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(seconds)}${msPart}`
  }
  if (minutes > 0) {
    return `${minutes}:${pad2(seconds)}${msPart}`
  }

  return `${seconds}${msPart}`
}
