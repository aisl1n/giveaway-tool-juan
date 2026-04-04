import confetti from 'canvas-confetti'

const brandPalette = ['#14b8a6', '#f59e0b', '#22d3ee', '#ef4444', '#f8fafc']

export const launchBrandConfetti = (): void => {
  const defaults = {
    spread: 360,
    ticks: 220,
    gravity: 1,
    decay: 0.92,
    startVelocity: 34,
    scalar: 0.7,
    shapes: ['circle'] as NonNullable<Parameters<typeof confetti>[0]>['shapes'],
    colors: brandPalette,
    zIndex: 100,
  }

  const bursts = [
    { particleCount: 500, origin: { x: 0.2, y: 0.62 }, delayMs: 0 },
    { particleCount: 400, origin: { x: 0.8, y: 0.62 }, delayMs: 280 },
    { particleCount: 550, origin: { x: 0.5, y: 0.38 }, delayMs: 560 },
  ]

  bursts.forEach(({ delayMs, ...burst }) => {
    window.setTimeout(() => {
      void confetti({ ...defaults, ...burst })
      void confetti({
        ...defaults,
        ...burst,
        particleCount: Math.floor(burst.particleCount * 0.35),
        startVelocity: 16,
        ticks: 160,
        scalar: 0.58,
      })
    }, delayMs)
  })
}
