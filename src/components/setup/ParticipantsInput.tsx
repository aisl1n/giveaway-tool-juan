import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function ParticipantsInput() {
  const participantsNames = useRaffleStore((state) => state.participantsNames)
  const setParticipantsNames = useRaffleStore((state) => state.setParticipantsNames)

  return (
    <GlassCard
      title="Participantes"
      subtitle="Digite um aluno por linha para montar a lista oficial do sorteio."
    >
      <label className="sr-only" htmlFor="participants-textarea">
        Lista de participantes
      </label>
      <textarea
        id="participants-textarea"
        value={participantsNames}
        onChange={(event) => setParticipantsNames(event.target.value)}
        placeholder={'Ana\nBruno\nCarlos\nDaniela'}
        className="focus:border-brand-secondary focus:ring-brand-secondary/30 border-brand-line bg-brand-surface/85 text-brand-tertiary min-h-52 w-full resize-y rounded-2xl border px-4 py-3 text-sm transition outline-none focus:ring-2"
      />
      <p className="text-brand-muted mt-3 text-xs">
        Dica: nomes repetidos sao removidos automaticamente.
      </p>
    </GlassCard>
  )
}
