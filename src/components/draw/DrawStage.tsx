import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { launchBrandConfetti } from '../../lib/confetti'
import { getEligibleParticipants, normalizePrizes, sleep } from '../../lib/raffle'
import { useRaffleStore } from '../../store/useRaffleStore'
import type { DrawPhase, DrawResult } from '../../types/raffle'
import { GlassCard } from '../ui/GlassCard'

export function DrawStage() {
  const participantsText = useRaffleStore((state) => state.participantsText)
  const prizes = useRaffleStore((state) => state.prizes)
  const results = useRaffleStore((state) => state.results)
  const drawNextWinner = useRaffleStore((state) => state.drawNextWinner)
  const resetDraws = useRaffleStore((state) => state.resetDraws)

  const [phase, setPhase] = useState<DrawPhase>('idle')
  const [countdownValue, setCountdownValue] = useState<number>(3)
  const [rollingName, setRollingName] = useState<string>('Pronto para sortear')
  const [lastDraw, setLastDraw] = useState<DrawResult | null>(null)

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])
  const eligibleParticipants = useMemo(
    () => getEligibleParticipants(participantsText, results),
    [participantsText, results],
  )

  const nextPrizeIndex = validPrizes.length - 1 - results.length
  const nextPrizeLabel = nextPrizeIndex >= 0 ? validPrizes[nextPrizeIndex] : null
  const drawCompleted = validPrizes.length > 0 && results.length >= validPrizes.length

  const canDraw =
    phase !== 'countdown' &&
    phase !== 'rolling' &&
    eligibleParticipants.length > 0 &&
    nextPrizeLabel !== null

  const runDrawExperience = async () => {
    if (!canDraw) {
      return
    }

    setLastDraw(null)
    setCountdownValue(3)
    setPhase('countdown')

    for (let value = 3; value >= 1; value -= 1) {
      setCountdownValue(value)
      await sleep(650)
    }

    setPhase('rolling')

    let delay = 44
    const spins = Math.max(20, eligibleParticipants.length * 3)

    for (let index = 0; index < spins; index += 1) {
      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length)
      setRollingName(eligibleParticipants[randomIndex])
      await sleep(delay)
      delay = Math.min(220, delay + 5 + index * 0.3)
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
  }

  return (
    <GlassCard
      title="Sorteio"
      subtitle="Contagem regressiva + efeito de rolagem em alta velocidade."
    >
      <div className="space-y-5">
        <div className="rounded-3xl border border-white/20 bg-black/35 p-4 text-center">
          <p className="mb-2 text-xs tracking-[0.18em] text-slate-400 uppercase">
            Proximo premio
          </p>
          <p className="text-brand-secondary text-lg font-semibold">
            {nextPrizeLabel ?? 'Sorteio encerrado'}
          </p>
        </div>

        <div className="relative flex min-h-52 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-slate-950/80 p-6 text-center">
          <AnimatePresence mode="wait">
            {phase === 'countdown' ? (
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
            ) : (
              <motion.div
                key={rollingName}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">
                  {phase === 'rolling' ? 'Rodando nomes...' : 'Ganhador'}
                </p>
                <p className="font-heading text-4xl leading-tight font-semibold text-slate-50 md:text-5xl">
                  {rollingName}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {lastDraw ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-brand-primary/40 bg-brand-primary/10 rounded-2xl border p-4 text-center"
          >
            <p className="text-brand-primary text-xs tracking-[0.15em] uppercase">
              Vencedor confirmado
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-50">
              {lastDraw.winnerName}
            </p>
            <p className="mt-1 text-sm text-slate-300">Levou: {lastDraw.prizeLabel}</p>
          </motion.div>
        ) : null}

        <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs tracking-wider text-slate-400 uppercase">Elegiveis</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">
              {eligibleParticipants.length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs tracking-wider text-slate-400 uppercase">Premios</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">
              {validPrizes.length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs tracking-wider text-slate-400 uppercase">Sorteados</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{results.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              void runDrawExperience()
            }}
            disabled={!canDraw}
            className="bg-brand-primary rounded-2xl px-5 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === 'countdown' || phase === 'rolling'
              ? 'Sorteando...'
              : 'Sortear agora'}
          </button>
          <button
            type="button"
            onClick={resetDraws}
            disabled={phase === 'countdown' || phase === 'rolling'}
            className="hover:border-brand-secondary hover:text-brand-secondary rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reiniciar sorteio
          </button>
        </div>

        {drawCompleted ? (
          <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200">
            Todos os premios foram definidos. O ultimo sorteio concluiu o Premio #1
            principal.
          </p>
        ) : null}
      </div>
    </GlassCard>
  )
}
