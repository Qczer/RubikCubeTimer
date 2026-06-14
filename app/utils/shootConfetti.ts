import confetti from 'canvas-confetti'

export function shootConfetti() {
  const colors = ['#006bb2', '#0880d1', '#098be2']
  confetti({
    particleCount: 150,
    angle: 40,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
    gravity: 2,
    startVelocity: 70
  })
  confetti({
    particleCount: 150,
    angle: 140,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
    gravity: 2,
    startVelocity: 70
  })
}
