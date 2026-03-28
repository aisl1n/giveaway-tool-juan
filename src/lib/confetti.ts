import confetti from 'canvas-confetti'

const brandPalette = ['#14b8a6', '#f59e0b', '#22d3ee', '#ef4444', '#f8fafc']

export const launchBrandConfetti = (): void => {
  const defaults = {
    spread: 80,
    ticks: 320,
    gravity: 0.9,
    scalar: 1.05,
    colors: brandPalette,
    zIndex: 100,
  }

  void confetti({ ...defaults, particleCount: 120, origin: { x: 0.2, y: 0.6 } })
  void confetti({ ...defaults, particleCount: 120, origin: { x: 0.8, y: 0.6 } })
  void confetti({ ...defaults, particleCount: 180, origin: { x: 0.5, y: 0.35 } })
}
