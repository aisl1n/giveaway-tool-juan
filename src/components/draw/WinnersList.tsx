import { useMemo } from 'react'

import { normalizePrizes } from '../../lib/raffle'
import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function WinnersList() {
  const prizes = useRaffleStore((state) => state.prizes)
  const results = useRaffleStore((state) => state.results)

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])

  return (
    <GlassCard
      title="Resultados"
      subtitle="Historico de ganhadores por ordem de sorteio."
    >
      {results.length === 0 ? (
        <p className="text-brand-muted border-brand-line bg-brand-surface/65 rounded-2xl border px-4 py-5 text-sm">
          Nenhum sorteio realizado ainda.
        </p>
      ) : (
        <ol className="space-y-2">
          {results.map((result, index) => {
            const ranking = validPrizes.length - index

            return (
              <li
                key={result.id}
                className="text-brand-tertiary border-brand-line bg-brand-surface/70 rounded-2xl border px-4 py-3 text-sm"
              >
                <p className="text-brand-secondary font-semibold">Premio #{ranking}</p>
                <p className="text-brand-tertiary mt-1 text-base font-medium">
                  {result.winnerName}
                </p>
                <p className="text-brand-muted text-xs">{result.prizeLabel}</p>
              </li>
            )
          })}
        </ol>
      )}
    </GlassCard>
  )
}
