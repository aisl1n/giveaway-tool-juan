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
        <p className="rounded-2xl border border-white/10 bg-black/25 px-4 py-5 text-sm text-slate-400">
          Nenhum sorteio realizado ainda.
        </p>
      ) : (
        <ol className="space-y-2">
          {results.map((result, index) => {
            const ranking = validPrizes.length - index

            return (
              <li
                key={result.id}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-200"
              >
                <p className="text-brand-secondary font-semibold">Premio #{ranking}</p>
                <p className="mt-1 text-base font-medium text-slate-50">
                  {result.winnerName}
                </p>
                <p className="text-xs text-slate-400">{result.prizeLabel}</p>
              </li>
            )
          })}
        </ol>
      )}
    </GlassCard>
  )
}
