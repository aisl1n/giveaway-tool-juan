import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Dumbbell, ListChecks, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { launchBrandConfetti } from '../../lib/confetti'
import { getEligibleParticipants, normalizePrizes, sleep } from '../../lib/raffle'
import { useRaffleStore } from '../../store/useRaffleStore'
import type { DrawPhase, DrawResult } from '../../types/raffle'
import { DrawStatsPanel } from './DrawStatsPanel'

const READY_MESSAGE = 'Pronto para sortear'
const COUNTDOWN_STEP_MS = 650
const ROLLING_SPIN_COUNT = 48
const ROLLING_STEP_MS = 60
const ROLLING_MESSAGES = [
  'Aquecendo o sorteio',
  'Contando as repetições',
  'Carga máxima no nome',
  'Foco no próximo vencedor',
  'Hoje é dia de bater meta',
  'Treino pesado, prêmio liberado',
  'Ritmo forte até o resultado',
]

const formatStatValue = (value: number) => value.toString().padStart(2, '0')

type DrawStageProps = {
  onClose?: () => void
  onShowFinalResults?: () => void
}

export function DrawStage({ onClose, onShowFinalResults }: DrawStageProps) {
  const participantsNames = useRaffleStore((state) => state.participantsNames)
  const prizes = useRaffleStore((state) => state.prizes)
  const results = useRaffleStore((state) => state.results)
  const drawNextWinner = useRaffleStore((state) => state.drawNextWinner)
  const resetDraws = useRaffleStore((state) => state.resetDraws)

  const [phase, setPhase] = useState<DrawPhase>('idle')
  const [countdownValue, setCountdownValue] = useState<number>(3)
  const [rollingName, setRollingName] = useState<string>(READY_MESSAGE)
  const [rollingStatusMessage, setRollingStatusMessage] =
    useState<string>('Aquecendo o sorteio')
  const [rollingDotsCount, setRollingDotsCount] = useState<number>(0)
  const [lastDraw, setLastDraw] = useState<DrawResult | null>(null)
  const isDrawingRef = useRef(false)

  useEffect(() => {
    if (phase !== 'rolling' && phase !== 'countdown') {
      setRollingDotsCount(0)
      return
    }

    const intervalId = window.setInterval(() => {
      setRollingDotsCount((previousCount) => (previousCount + 1) % 4)
    }, 280)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [phase])

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])
  const eligibleParticipants = useMemo(
    () => getEligibleParticipants(participantsNames, results),
    [participantsNames, results],
  )

  const nextPrizeIndex = validPrizes.length - 1 - results.length
  const nextPrizeLabel = nextPrizeIndex >= 0 ? validPrizes[nextPrizeIndex] : null
  const drawCompleted = validPrizes.length > 0 && results.length >= validPrizes.length
  const drawStats = [
    { label: 'Elegíveis', value: formatStatValue(eligibleParticipants.length) },
    { label: 'Prêmios', value: formatStatValue(validPrizes.length) },
    { label: 'Sorteados', value: formatStatValue(results.length) },
  ]

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

      setRollingStatusMessage((previousMessage) => {
        if (ROLLING_MESSAGES.length < 2) {
          return ROLLING_MESSAGES[0] ?? previousMessage
        }

        let nextMessage =
          ROLLING_MESSAGES[Math.floor(Math.random() * ROLLING_MESSAGES.length)]

        while (nextMessage === previousMessage) {
          nextMessage =
            ROLLING_MESSAGES[Math.floor(Math.random() * ROLLING_MESSAGES.length)]
        }

        return nextMessage
      })
      setPhase('rolling')

      let previousIndex = -1

      for (let index = 0; index < ROLLING_SPIN_COUNT; index += 1) {
        let randomIndex = Math.floor(Math.random() * eligibleParticipants.length)

        if (eligibleParticipants.length > 1) {
          while (randomIndex === previousIndex) {
            randomIndex = Math.floor(Math.random() * eligibleParticipants.length)
          }
        }

        previousIndex = randomIndex
        setRollingName(eligibleParticipants[randomIndex])
        await sleep(ROLLING_STEP_MS)
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

  const handleResetDraws = () => {
    resetDraws()
    setPhase('idle')
    setCountdownValue(3)
    setRollingName(READY_MESSAGE)
    setRollingStatusMessage('Aquecendo o sorteio')
    setLastDraw(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="space-y-4">
        <div className="border-brand-line md:bg-brand-surface/55 relative grid w-full grid-cols-1 gap-4 rounded-3xl border-0 bg-transparent px-4 py-4 text-center md:grid-cols-2 md:place-items-center md:border lg:grid-cols-[max-content_minmax(0,1fr)_max-content] lg:place-items-stretch lg:items-center lg:text-left">
          <div className="mx-auto flex w-fit flex-col items-center justify-center gap-2 text-center md:row-span-2 md:self-center lg:row-span-1 lg:mx-0 lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:text-left">
            <img
              src="/images/Logotipo-Principal.png"
              alt="Logotipo da marca"
              className="h-14 w-auto shrink-0 md:h-16"
            />
            <div className="flex flex-col justify-center leading-tight">
              <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase">
                Tela de sorteio
              </p>
              <h2 className="font-heading text-brand-tertiary text-xl font-semibold lg:text-2xl">
                Sorteador oficial
              </h2>
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-center text-center lg:text-center">
            <div>
              {!drawCompleted ? (
                <p className="text-brand-muted text-[10px] tracking-[0.18em] uppercase">
                  Próximo prêmio
                </p>
              ) : null}
              <p className="text-brand-secondary mt-1 text-[1.7rem] font-semibold md:text-3xl">
                {nextPrizeLabel ?? 'Sorteio encerrado'}
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-fit justify-center md:col-start-2 md:row-start-2 md:justify-center lg:col-start-auto lg:row-start-auto lg:mx-0 lg:justify-end">
            <DrawStatsPanel items={drawStats} />
          </div>
        </div>

        <div className="border-brand-line bg-brand-surface/85 relative flex min-h-88 items-center justify-center overflow-hidden rounded-3xl border p-6 text-center md:min-h-104">
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
            <div className="space-y-3">
              {phase === 'rolling' ? (
                <p className="text-brand-muted text-xs tracking-[0.18em] uppercase">
                  {rollingStatusMessage}
                  <span className="inline-block w-[2ch] text-left">
                    {'.'.repeat(rollingDotsCount)}
                  </span>
                </p>
              ) : null}

              {phase === 'result' ? (
                <p className="text-brand-muted text-xs tracking-[0.18em] uppercase">
                  Ganhador(a)
                </p>
              ) : null}

              <AnimatePresence initial={false}>
                <p className="font-heading text-brand-tertiary text-4xl leading-tight font-semibold md:text-6xl lg:text-7xl">
                  <motion.span
                    key={`${phase}-${rollingName}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: phase === 'rolling' ? 0.1 : 0.2 }}
                    className="inline-block tracking-wide"
                  >
                    {rollingName}
                  </motion.span>
                </p>
              </AnimatePresence>

              {phase === 'result' && lastDraw ? (
                <p className="text-brand-secondary text-sm tracking-[0.08em] uppercase md:text-base">
                  {lastDraw.prizeLabel}
                </p>
              ) : null}
            </div>
          )}

          {drawCompleted ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
              <p className="border-brand-secondary/55 bg-brand-secondary/16 text-brand-tertiary inline-flex max-w-full rounded-2xl border px-4 py-3 text-center text-sm">
                Todos os prêmios foram definidos. O último sorteio concluiu o prêmio
                principal.
              </p>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:justify-end">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              disabled={phase === 'countdown' || phase === 'rolling'}
              className="hover:border-brand-secondary hover:text-brand-secondary border-brand-line text-brand-tertiary flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-normal whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-40 md:w-44"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Voltar para o início
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleResetDraws}
            disabled={phase === 'countdown' || phase === 'rolling'}
            className="hover:border-brand-secondary hover:text-brand-secondary border-brand-line text-brand-tertiary flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-normal whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-40 md:w-44"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar sorteio
          </button>
          {drawCompleted ? (
            <button
              type="button"
              onClick={onShowFinalResults}
              className="bg-brand-primary text-brand-tertiary col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-normal whitespace-nowrap transition hover:brightness-110 md:w-44"
            >
              <ListChecks className="h-4 w-4" />
              Ver resultados finais
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                void runDrawExperience()
              }}
              disabled={!canDraw}
              className="bg-brand-primary text-brand-tertiary col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-normal whitespace-nowrap transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 md:w-44"
            >
              {phase === 'countdown' || phase === 'rolling' ? (
                <>
                  <span className="inline-block animate-spin">
                    <Dumbbell className="h-4 w-4" />
                  </span>
                  Sorteando
                </>
              ) : (
                <>
                  <Dumbbell className="h-4 w-4" />
                  Sortear agora
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
