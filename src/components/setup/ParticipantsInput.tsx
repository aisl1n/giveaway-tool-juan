import { useRaffleStore } from '../../store/useRaffleStore'
import { GlassCard } from '../ui/GlassCard'

export function ParticipantsInput() {
  const participantsNames = useRaffleStore((state) => state.participantsNames)
  const setParticipantsNames = useRaffleStore((state) => state.setParticipantsNames)

  const handleParticipantsChange = (value: string) => {
    const capitalizedLines = value
      .split('\n')
      .map((line) =>
        line.replace(/(^|\s)(\S)/g, (_match, prefix: string, char: string) => {
          return `${prefix}${char.toUpperCase()}`
        }),
      )
      .join('\n')
    setParticipantsNames(capitalizedLines)
  }

  return (
    <GlassCard
      title="Participantes"
      subtitle="Digite um aluno(a) por linha para montar a lista oficial do sorteio."
    >
      <label className="sr-only" htmlFor="participants-textarea">
        Lista de participantes
      </label>
      <textarea
        id="participants-textarea"
        value={participantsNames}
        onChange={(event) => handleParticipantsChange(event.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="words"
        placeholder={'Ana\nBruna\nYasmin'}
        className="focus:border-brand-secondary focus:ring-brand-secondary/30 border-brand-line bg-brand-surface/85 text-brand-tertiary min-h-52 w-full resize-y rounded-2xl border px-4 py-3 text-sm transition outline-none focus:ring-2"
      />
      <p className="text-brand-muted mt-3 text-xs font-normal">
        Dica: nomes repetidos são removidos automaticamente.
      </p>
    </GlassCard>
  )
}
