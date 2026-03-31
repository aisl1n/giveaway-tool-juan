import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { launchBrandConfetti } from '../../lib/confetti'
import { getEligibleParticipants, normalizePrizes, sleep } from '../../lib/raffle'
import { useRaffleStore } from '../../store/useRaffleStore'
import type { DrawPhase, DrawResult } from '../../types/raffle'

type DrawStageProps = {
  autoStartSignal?: number
}

const CONFIRMED_WINNER_PREVIEW_MS = 4200
const READY_MESSAGE = 'Pronto para sortear'
const COUNTDOWN_STEP_MS = 650

export function DrawStage({ autoStartSignal }: DrawStageProps) {
  const participantsNames = useRaffleStore((state) => state.participantsNames)
  const prizes = useRaffleStore((state) => state.prizes)
  const results = useRaffleStore((state) => state.results)
  const drawNextWinner = useRaffleStore((state) => state.drawNextWinner)
  const resetDraws = useRaffleStore((state) => state.resetDraws)

  const [phase, setPhase] = useState<DrawPhase>('idle')
  const [countdownValue, setCountdownValue] = useState<number>(3)
  const [rollingName, setRollingName] = useState<string>(READY_MESSAGE)
  const [lastDraw, setLastDraw] = useState<DrawResult | null>(null)
  const lastAutoStartSignalRef = useRef<number | undefined>(undefined)
  const isDrawingRef = useRef(false)

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])
  const eligibleParticipants = useMemo(
    () => getEligibleParticipants(participantsNames, results),
    [participantsNames, results],
  )

  const nextPrizeIndex = validPrizes.length - 1 - results.length
  const nextPrizeLabel = nextPrizeIndex >= 0 ? validPrizes[nextPrizeIndex] : null
  const drawCompleted = validPrizes.length > 0 && results.length >= validPrizes.length

  const canDraw =
    phase !== 'countdown' &&
    phase !== 'rolling' &&
    eligibleParticipants.length > 0 &&
    nextPrizeLabel !== null

  const runDrawExperience = useCallback(async () => {
    if (!canDraw || isDrawingRef.current) {
      return
    }

    isDrawingRef.current = true

    try {
      setLastDraw(null)
      setCountdownValue(3)
      setPhase('countdown')

      for (let value = 3; value >= 1; value -= 1) {
        setCountdownValue(value)
        await sleep(COUNTDOWN_STEP_MS)
      }

      setPhase('rolling')

      let delay = 34
      const spins = Math.max(40, eligibleParticipants.length * 6)
      let previousIndex = -1

      for (let index = 0; index < spins; index += 1) {
        let randomIndex = Math.floor(Math.random() * eligibleParticipants.length)

        // Avoid showing the same name in consecutive frames when possible.
        if (eligibleParticipants.length > 1) {
          while (randomIndex === previousIndex) {
            randomIndex = Math.floor(Math.random() * eligibleParticipants.length)
          }
        }

        previousIndex = randomIndex
        setRollingName(eligibleParticipants[randomIndex])
        await sleep(delay)
        delay = Math.min(190, delay + 2.2 + index * 0.16)
      }

      const result = drawNextWinner()

      if (!result) {
        setPhase('idle')
        return
      }

      setRollingName(result.winnerName)
      setLastDraw(result)
      setPhase('result')
      launchBrandConfetti()
    } finally {
      isDrawingRef.current = false
    }
  }, [canDraw, drawNextWinner, eligibleParticipants])

  useEffect(() => {
    if (autoStartSignal === undefined) {
      return
    }

    if (lastAutoStartSignalRef.current === autoStartSignal) {
      return
    }

    lastAutoStartSignalRef.current = autoStartSignal
    const timerId = window.setTimeout(() => {
      void runDrawExperience()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [autoStartSignal, runDrawExperience])

  useEffect(() => {
    if (!lastDraw) {
      return
    }

    const timerId = window.setTimeout(() => {
      setLastDraw(null)
    }, CONFIRMED_WINNER_PREVIEW_MS)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [lastDraw])

  const handleResetDraws = () => {
    resetDraws()
    setPhase('idle')
    setCountdownValue(3)
    setRollingName(READY_MESSAGE)
    setLastDraw(null)
  }

  return (
    <div className="space-y-5">
      <div className="border-brand-line bg-brand-surface/55 rounded-3xl border p-4 text-center">
        <p className="text-brand-muted mb-2 text-xs tracking-[0.18em] uppercase">
          Proximo premio
        </p>
        <p className="text-brand-secondary text-lg font-semibold">
          {nextPrizeLabel ?? 'Sorteio encerrado'}
        </p>
      </div>

      <div className="border-brand-line bg-brand-surface/85 relative flex min-h-52 items-center justify-center overflow-hidden rounded-3xl border p-6 text-center">
        {phase === 'countdown' ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={`countdown-${countdownValue}`}
              initial={{ opacity: 0, scale: 0.4, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, y: -18 }}
              transition={{ duration: 0.45 }}
              className="font-heading text-brand-secondary text-8xl font-bold"
            >
              {countdownValue}
            </motion.p>
          </AnimatePresence>
        ) : (
          <div className="space-y-2">
            <p className="text-brand-muted text-xs tracking-[0.18em] uppercase">
              {phase === 'rolling' ? 'Sorteando nomes...' : 'Ganhador'}
            </p>

            <AnimatePresence initial={false}>
              <p className="font-heading text-brand-tertiary text-4xl leading-tight font-semibold md:text-5xl">
                <motion.span
                  key={`${phase}-${rollingName}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: phase === 'rolling' ? 0.1 : 0.2 }}
                  className="inline-block"
                >
                  {rollingName}
                </motion.span>
              </p>
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lastDraw ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="border-brand-primary/45 bg-brand-primary/15 rounded-2xl border p-4 text-center"
          >
            <p className="text-brand-primary text-xs tracking-[0.15em] uppercase">
              Vencedor confirmado
            </p>
            <p className="text-brand-tertiary mt-2 text-xl font-semibold">
              {lastDraw.winnerName}
            </p>
            <p className="text-brand-muted mt-1 text-sm">Levou: {lastDraw.prizeLabel}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="text-brand-muted grid gap-3 text-sm sm:grid-cols-3">
        <div className="border-brand-line bg-brand-surface/65 rounded-2xl border p-3">
          <p className="text-xs tracking-wider uppercase">Elegiveis</p>
          <p className="text-brand-tertiary mt-1 text-lg font-semibold">
            {eligibleParticipants.length}
          </p>
        </div>
        <div className="border-brand-line bg-brand-surface/65 rounded-2xl border p-3">
          <p className="text-xs tracking-wider uppercase">Premios</p>
          <p className="text-brand-tertiary mt-1 text-lg font-semibold">
            {validPrizes.length}
          </p>
        </div>
        <div className="border-brand-line bg-brand-surface/65 rounded-2xl border p-3">
          <p className="text-xs tracking-wider uppercase">Sorteados</p>
          <p className="text-brand-tertiary mt-1 text-lg font-semibold">
            {results.length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            void runDrawExperience()
          }}
          disabled={!canDraw}
          className="bg-brand-primary text-brand-tertiary rounded-2xl px-5 py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {phase === 'countdown' || phase === 'rolling'
            ? 'Sorteando...'
            : 'Sortear agora'}
        </button>
        <button
          type="button"
          onClick={handleResetDraws}
          disabled={phase === 'countdown' || phase === 'rolling'}
          className="hover:border-brand-secondary hover:text-brand-secondary border-brand-line text-brand-tertiary rounded-2xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reiniciar sorteio
        </button>
      </div>

      {drawCompleted ? (
        <p className="border-brand-secondary/55 bg-brand-secondary/16 text-brand-tertiary rounded-2xl border px-4 py-3 text-sm">
          Todos os premios foram definidos. O ultimo sorteio concluiu o Premio #1
          principal.
        </p>
      ) : null}
    </div>
  )
}
