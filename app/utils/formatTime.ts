export const formatTime = (
  ms: number,
  decimalPoints = 2,
  plusTwo?: boolean,
  DNF?: boolean
) => {
  const days = Math.floor(ms / 86400000) // day = 86400000 ms
  const hours = Math.floor((ms % 86400000) / 3600000) // hour = 3600000 ms
  const minutes = Math.floor((ms % 3600000) / 60000) // minute = 60000 ms
  const seconds = Math.floor((ms % 60000) / 1000)
  const milliseconds = Math.floor((ms % 1000) / Math.pow(10, 3 - decimalPoints))

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
