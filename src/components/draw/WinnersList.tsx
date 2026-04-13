import { Award, Crown, Medal } from 'lucide-react'
import { useMemo } from 'react'

import { normalizePrizes } from '../../lib/raffle'
import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

type RankedResult = {
  id: string
  winnerName: string
  prizeLabel: string
  drawnAt: string
  ranking: number
}

const PODIUM_STYLES = [
  {
    place: 1,
    icon: Crown,
    cardClass: 'border-brand-primary/70 bg-brand-primary/16',
    standClass: 'bg-brand-primary/30 h-20 md:h-24',
  },
  {
    place: 2,
    icon: Medal,
    cardClass: 'border-brand-secondary/55 bg-brand-secondary/14',
    standClass: 'bg-brand-secondary/26 h-14 md:h-16',
  },
  {
    place: 3,
    icon: Award,
    cardClass: 'border-brand-line bg-brand-surface/70',
    standClass: 'bg-brand-surface h-10 md:h-12',
  },
] as const

export function WinnersList() {
  const prizes = useRaffleStore((state) => state.prizes)
  const results = useRaffleStore((state) => state.results)

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])
  const rankedResults = useMemo<RankedResult[]>(() => {
    return results
      .map((result) => ({
        id: result.id,
        winnerName: result.winnerName,
        prizeLabel: result.prizeLabel,
        drawnAt: result.drawnAt,
        ranking: validPrizes.length - result.drawOrder + 1,
      }))
      .sort((a, b) => a.ranking - b.ranking)
  }, [results, validPrizes.length])

  const podiumResults = rankedResults.slice(0, 3)

  return (
    <GlassCard
      title="Resultados"
      subtitle="Pódio dos vencedores e histórico completo dos sorteados."
    >
      {results.length === 0 ? (
        <p className="text-brand-muted border-brand-line bg-brand-surface/65 rounded-2xl border px-4 py-5 text-sm">
          Nenhum sorteio realizado ainda.
        </p>
      ) : (
        <div className="space-y-5">
          <section className="mx-auto grid max-w-4xl gap-3 md:grid-cols-3 md:items-end">
            {PODIUM_STYLES.map((style) => {
              const podiumItem = podiumResults.find(
                (result) => result.ranking === style.place,
              )
              const Icon = style.icon
              const isFirstPlace = style.place === 1
              const orderClass =
                style.place === 1
                  ? 'order-1 md:order-2'
                  : style.place === 2
                    ? 'order-2 md:order-1'
                    : 'order-3 md:order-3'

              return (
                <article
                  key={`podium-${style.place}`}
                  className={`flex h-full flex-col items-center justify-end text-center ${orderClass}`}
                >
                  <div
                    className={`border-brand-line relative w-full rounded-2xl border px-3 py-3 pl-16 md:pl-3 ${style.cardClass}`}
                  >
                    <span className="text-brand-tertiary absolute top-1/2 left-6 -translate-y-1/2 text-3xl font-bold tracking-wider md:hidden">
                      {`${style.place}º`}
                    </span>

                    <div className="text-brand-tertiary mb-2 flex items-center justify-center">
                      <Icon className="h-4 w-4" />
                    </div>

                    {podiumItem ? (
                      <div className="mx-auto flex max-w-[18ch] flex-col items-center text-center">
                        <p
                          className={`text-brand-tertiary leading-tight font-semibold ${isFirstPlace ? 'text-xl tracking-wider md:text-2xl' : 'text-lg tracking-wider md:text-xl'}`}
                        >
                          {podiumItem.winnerName}
                        </p>
                        <p
                          className={`text-brand-secondary mt-1 text-center ${isFirstPlace ? 'text-base tracking-wider md:text-lg' : 'text-sm tracking-wider md:text-base'}`}
                        >
                          {podiumItem.prizeLabel}
                        </p>
                      </div>
                    ) : (
                      <p className="text-brand-muted text-xs">Aguardando sorteio</p>
                    )}
                  </div>
                  <div
                    className={`border-brand-line text-brand-tertiary mt-1 hidden w-full max-w-40 items-center justify-center rounded-md border-t font-semibold md:flex ${style.standClass}`}
                  >
                    <span
                      className={`${isFirstPlace ? 'text-2xl tracking-wider md:text-3xl' : 'text-xl tracking-wider md:text-2xl'}`}
                    >
                      {`${style.place}º`}
                    </span>
                  </div>
                </article>
              )
            })}
          </section>

          <ol className="space-y-3">
            {rankedResults.map((result) => (
              <li
                key={result.id}
                className="border-brand-line bg-brand-surface/75 rounded-2xl border px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-brand-primary/18 text-brand-tertiary rounded-full px-3 py-1 text-[11px] tracking-[0.08em] uppercase">
                    Prêmio #{result.ranking}
                  </span>
                  <span className="text-brand-muted text-[11px]">{result.drawnAt}</span>
                </div>

                <p className="text-brand-tertiary mt-2 text-base font-semibold">
                  {result.winnerName}
                </p>
                <p className="text-brand-secondary mt-1 text-sm">{result.prizeLabel}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </GlassCard>
  )
}
