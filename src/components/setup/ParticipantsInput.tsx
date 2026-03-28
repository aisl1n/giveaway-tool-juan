import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function ParticipantsInput() {
  const participantsText = useRaffleStore((state) => state.participantsText)
  const setParticipantsText = useRaffleStore((state) => state.setParticipantsText)

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
        value={participantsText}
        onChange={(event) => setParticipantsText(event.target.value)}
        placeholder={'Ana\nBruno\nCarlos\nDaniela'}
        className="focus:border-brand-primary focus:ring-brand-primary/30 min-h-52 w-full resize-y rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 transition outline-none focus:ring-2"
      />
      <p className="mt-3 text-xs text-slate-400">
        Dica: nomes repetidos sao removidos automaticamente.
      </p>
    </GlassCard>
  )
}
