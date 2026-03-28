import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function PrizesManager() {
  const prizes = useRaffleStore((state) => state.prizes)
  const addPrize = useRaffleStore((state) => state.addPrize)
  const updatePrize = useRaffleStore((state) => state.updatePrize)
  const removePrize = useRaffleStore((state) => state.removePrize)

  return (
    <GlassCard
      title="Premios"
      subtitle="A ordem de entrega e inversa: o primeiro sorteio define o ultimo premio."
    >
      <div className="space-y-3">
        {prizes.map((prize, index) => (
          <div key={`prize-${index}`} className="flex gap-2">
            <input
              type="text"
              value={prize}
              onChange={(event) => updatePrize(index, event.target.value)}
              placeholder={`Premio #${index + 1}`}
              className="focus:border-brand-secondary focus:ring-brand-secondary/30 border-brand-line bg-brand-surface/85 text-brand-tertiary w-full rounded-xl border px-3 py-2 text-sm transition outline-none focus:ring-2"
            />
            <button
              type="button"
              onClick={() => removePrize(index)}
              className="hover:border-brand-secondary hover:text-brand-secondary border-brand-line text-brand-muted rounded-xl border px-3 text-sm font-semibold transition"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPrize}
        className="bg-brand-secondary text-brand-ink mt-4 rounded-xl px-4 py-2 text-sm font-semibold transition hover:brightness-110"
      >
        + Adicionar premio
      </button>
    </GlassCard>
  )
}
