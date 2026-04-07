import { useMemo } from 'react'

import { normalizePrizes } from '../../lib/raffle'
import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function WinnersList() {
  const prizes = useRaffleStore((state) => state.prizes)
  const results = useRaffleStore((state) => state.results)

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])
  const orderedResults = useMemo(() => [...results].reverse(), [results])

  return (
    <GlassCard
      title="Resultados"
      subtitle="Histórico de ganhadores por ordem de sorteio."
    >
      {results.length === 0 ? (
        <p className="text-brand-muted border-brand-line bg-brand-surface/65 rounded-2xl border px-4 py-5 text-sm">
          Nenhum sorteio realizado ainda.
        </p>
      ) : (
        <ol className="space-y-3">
          {orderedResults.map((result) => {
            const ranking = validPrizes.length - result.drawOrder + 1

            return (
              <li
                key={result.id}
                className="border-brand-line bg-brand-surface/75 rounded-2xl border px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-brand-primary/18 text-brand-tertiary rounded-full px-3 py-1 text-[11px] tracking-[0.08em] uppercase">
                    Prêmio #{ranking}
                  </span>
                  <span className="text-brand-muted text-[11px]">{result.drawnAt}</span>
                </div>

                <p className="text-brand-tertiary mt-2 text-base font-semibold">
                  {result.winnerName}
                </p>
                <p className="text-brand-secondary mt-1 text-sm">{result.prizeLabel}</p>
              </li>
            )
          })}
        </ol>
      )}
    </GlassCard>
  )
}
