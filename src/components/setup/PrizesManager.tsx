import { PlusIcon, X } from 'lucide-react'

import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function PrizesManager() {
  const prizes = useRaffleStore((state) => state.prizes)
  const addPrize = useRaffleStore((state) => state.addPrize)
  const updatePrize = useRaffleStore((state) => state.updatePrize)
  const removePrize = useRaffleStore((state) => state.removePrize)

  return (
    <GlassCard
      title="Prêmios"
      subtitle="Cadastre os prêmios que serão sorteados."
      className="flex flex-col"
    >
      <div className="space-y-3">
        {prizes.map((prize, index) => (
          <div key={`prize-${index}`} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={prize}
              onChange={(event) => updatePrize(index, event.target.value)}
              onFocus={(event) => event.target.select()}
              placeholder={`Prêmio ${index + 1}`}
              className="focus:border-brand-secondary focus:ring-brand-secondary/30 border-brand-line bg-brand-surface/85 text-brand-tertiary w-full rounded-xl border px-3 py-2 text-sm font-normal transition outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => removePrize(index)}
              className="hover:border-brand-secondary hover:text-brand-secondary border-brand-line text-brand-muted flex w-full items-center justify-center rounded-xl border px-3 py-2 text-sm font-normal transition sm:w-auto sm:py-0"
            >
              <X className="mr-1 h-4 w-4" />
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-end">
        <button
          type="button"
          onClick={addPrize}
          className="bg-brand-secondary text-brand-tertiary mt-4 flex items-center justify-center rounded-xl px-4 py-2 text-sm transition hover:brightness-110"
        >
          <PlusIcon className="mr-2" />
          Adicionar prêmio
        </button>
      </div>
    </GlassCard>
  )
}
