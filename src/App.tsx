import { Dumbbell, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { DrawModal } from './components/draw/DrawModal'
import { WinnersList } from './components/draw/WinnersList'
import { ParticipantsInput } from './components/setup/ParticipantsInput'
import { PrizesManager } from './components/setup/PrizesManager'
import { normalizePrizes, parseParticipants } from './lib/raffle'
import { useRaffleStore } from './store/useRaffleStore'

function App() {
  const clearAll = useRaffleStore((state) => state.clearAll)
  const participantsNames = useRaffleStore((state) => state.participantsNames)
  const prizes = useRaffleStore((state) => state.prizes)
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false)
  const [showFinalResults, setShowFinalResults] = useState(false)
  const [startValidationMessage, setStartValidationMessage] = useState('')
  const [motivationalMessage] = useState(() => {
    const messages = [
      'Treine forte, mantenha a constância e respeite o processo.',
      'Disciplina na academia transforma esforço em resultado.',
      'Hoje é dia de suor, foco e evolução dentro e fora do treino.',
      'Sem pressa, sem desculpas: cada repetição fortalece você.',
      'Corpo forte, mente afiada e energia alta para evoluir sempre.',
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  })

  const handleClearAll = () => {
    setIsDrawModalOpen(false)
    setShowFinalResults(false)
    clearAll()
  }

  const validPrizes = useMemo(() => normalizePrizes(prizes), [prizes])
  const validParticipants = useMemo(
    () => parseParticipants(participantsNames),
    [participantsNames],
  )

  const canStartDraw = validParticipants.length > 0 && validPrizes.length > 0

  useEffect(() => {
    if (!startValidationMessage) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setStartValidationMessage('')
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [startValidationMessage])

  const openDrawModal = () => {
    if (!canStartDraw) {
      if (validParticipants.length === 0 && validPrizes.length === 0) {
        setStartValidationMessage(
          'Cadastre pelo menos 1 participante e 1 prêmio para iniciar o sorteio.',
        )
      } else if (validParticipants.length === 0) {
        setStartValidationMessage(
          'Cadastre pelo menos 1 participante para iniciar o sorteio.',
        )
      } else {
        setStartValidationMessage('Cadastre pelo menos 1 prêmio para iniciar o sorteio.')
      }
      return
    }

    setStartValidationMessage('')
    setIsDrawModalOpen(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,115,0,0.24),transparent_44%),radial-gradient(circle_at_82%_14%,rgba(69,51,175,0.42),transparent_40%)]" />

      <div className="space-y-4">
        <header className="border-brand-line bg-brand-panel/80 relative mx-auto w-fit overflow-hidden rounded-2xl border px-4 py-2 shadow-[0_14px_34px_rgba(0,0,0,0.32)] backdrop-blur-sm md:px-5 md:py-3">
          <div className="bg-brand-primary/30 pointer-events-none absolute -top-16 -right-10 h-32 w-32 rounded-full blur-3xl" />
          <div className="bg-brand-secondary/24 pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-[radial-gradient(circle_at_20%_50%,rgba(255,115,0,0.35),transparent_68%)]" />

          <div className="relative z-10 flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-4">
            <img
              src="/images/Logotipo-Principal.png"
              alt="Logotipo da marca"
              className="relative z-10 h-16 w-auto shrink-0 md:h-20"
            />
            <div className="flex flex-col items-center gap-1 md:items-start">
              <p className="text-brand-secondary/90 text-[10px] tracking-[0.2em] uppercase">
                Fit Club Giveaway
              </p>
              <h1 className="font-heading text-brand-tertiary text-lg font-normal tracking-normal md:text-xl">
                Sorteio Oficial - Juan Personal Trainer
              </h1>
            </div>
          </div>
        </header>

        <main className="space-y-4">
          {showFinalResults ? (
            <section className="mx-auto w-full max-w-4xl">
              <WinnersList />
            </section>
          ) : (
            <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
              <ParticipantsInput />
              <PrizesManager />
            </section>
          )}

          <section className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="border-brand-secondary/40 bg-brand-secondary/15 text-brand-tertiary hover:border-brand-secondary hover:bg-brand-secondary/25 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-normal transition sm:w-auto sm:px-5 sm:text-base"
            >
              <Trash2 className="h-4 w-4" />
              Limpar todos os dados
            </button>
            {!showFinalResults ? (
              <button
                type="button"
                onClick={openDrawModal}
                className="bg-brand-primary text-brand-tertiary flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-normal shadow-[0_14px_30px_rgba(255,115,0,0.3)] transition hover:brightness-110 sm:max-w-60 sm:px-5 sm:text-base"
              >
                <Dumbbell className="h-4 w-4" />
                Iniciar sorteio
              </button>
            ) : null}
          </section>

          {startValidationMessage ? (
            <p className="text-brand-secondary text-center text-xs sm:text-sm">
              {startValidationMessage}
            </p>
          ) : null}
        </main>

        <footer className="text-brand-muted pb-2 text-center text-[10px] tracking-wide">
          <p className="text-brand-tertiary/85 text-[11px] font-medium tracking-[0.12em] uppercase">
            {motivationalMessage}
          </p>
        </footer>
      </div>

      <DrawModal
        isOpen={isDrawModalOpen}
        onClose={() => setIsDrawModalOpen(false)}
        onShowFinalResults={() => {
          setShowFinalResults(true)
          setIsDrawModalOpen(false)
        }}
      />
    </div>
  )
}

export default App
