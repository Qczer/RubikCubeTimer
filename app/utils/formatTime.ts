export const formatTime = (
  ms: number,
  decimalPoints = 2,
  plusTwo?: boolean,
  DNF?: boolean
) => {
  if (DNF) return 'DNF'

  const displayMs = plusTwo ? ms + 2000 : ms
  const days = Math.floor(displayMs / 86400000) // day = 86400000 ms
  const hours = Math.floor((displayMs % 86400000) / 3600000) // hour = 3600000 ms
  const minutes = Math.floor((displayMs % 3600000) / 60000) // minute = 60000 ms
  const seconds = Math.floor((displayMs % 60000) / 1000)
  const milliseconds = Math.floor(
    (displayMs % 1000) / Math.pow(10, 3 - decimalPoints)
  )

  const paddedMinutes = minutes.toString().padStart(2, '0')
  const paddedMilliseconds = milliseconds
    .toString()
    .padStart(decimalPoints, '0')
  const paddedSeconds = seconds.toString().padStart(2, '0')

  if (days > 0) {
    return `${days}d ${hours}:${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`
  }
  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`
  }
  if (minutes > 0) {
    return `${minutes}:${paddedSeconds}.${paddedMilliseconds}`
  }

  return `${seconds}.${paddedMilliseconds}`
}
