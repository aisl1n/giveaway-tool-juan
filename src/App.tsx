import { useEffect, useState } from 'react'

import { DrawStage } from './components/draw/DrawStage'
import { WinnersList } from './components/draw/WinnersList'
import { ParticipantsInput } from './components/setup/ParticipantsInput'
import { PrizesManager } from './components/setup/PrizesManager'
import { useRaffleStore } from './store/useRaffleStore'

function App() {
  const clearAll = useRaffleStore((state) => state.clearAll)
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false)
  const [autoStartSignal, setAutoStartSignal] = useState(0)

  useEffect(() => {
    if (!isDrawModalOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawModalOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isDrawModalOpen])

  const openDrawModal = () => {
    setAutoStartSignal((value) => value + 1)
    setIsDrawModalOpen(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-2">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,115,0,0.24),transparent_44%),radial-gradient(circle_at_82%_14%,rgba(69,51,175,0.42),transparent_40%)]" />

      <div className="space-y-2">
        <header className="border-brand-line bg-brand-panel/50 relative mx-auto w-fit overflow-hidden rounded-2xl border px-4 py-2 shadow-[0_14px_34px_rgba(0,0,0,0.32)] backdrop-blur-lg md:px-5 md:py-3">
          <div className="bg-brand-primary/30 pointer-events-none absolute -top-16 -right-10 h-32 w-32 rounded-full blur-3xl" />
          <div className="bg-brand-secondary/24 pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full blur-3xl" />

          <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-4">
            <img
              src="/images/Logotipo-Principal.png"
              alt="Logotipo da marca"
              className="relative z-10 h-16 w-auto shrink-0 md:h-20"
            />
            <div className="flex flex-col items-center gap-1 md:items-start">
              <p className="text-brand-secondary/90 text-[10px] tracking-[0.2em] uppercase">
                Fit Club Giveaway
              </p>
              <h1 className="font-heading text-brand-tertiary text-lg font-semibold tracking-normal md:text-xl">
                Sorteio Oficial Juan Personal Trainer
              </h1>
            </div>
          </div>
        </header>

        <main className="space-y-6">
          <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2">
            <ParticipantsInput />
            <PrizesManager />
          </section>

          <section className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={clearAll}
              className="border-brand-secondary/40 bg-brand-secondary/15 text-brand-tertiary hover:border-brand-secondary hover:bg-brand-secondary/25 rounded-2xl border px-5 py-3 text-base font-semibold transition"
            >
              Limpar todos os dados
            </button>
            <button
              type="button"
              onClick={openDrawModal}
              className="bg-brand-primary text-brand-tertiary w-full max-w-60 rounded-2xl px-5 py-3 text-base font-semibold shadow-[0_14px_30px_rgba(255,115,0,0.3)] transition hover:brightness-110"
            >
              Iniciar sorteio
            </button>
          </section>
        </main>

        <footer className="text-brand-muted pb-2 text-center text-xs tracking-wide">
          Desenvolvido para sorteios de alta performance com experiencia premium.
        </footer>
      </div>

      {isDrawModalOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto p-2 md:p-4">
          <button
            type="button"
            aria-label="Fechar modal de sorteio"
            onClick={() => setIsDrawModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative z-10 mx-auto flex min-h-full w-full max-w-full items-center">
            <div className="border-brand-line bg-brand-panel/90 max-h-[calc(100vh-1rem)] w-full overflow-y-auto rounded-3xl border p-3 shadow-[0_26px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl md:max-h-[calc(100vh-2rem)] md:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase">
                    Tela de sorteio
                  </p>
                  <h2 className="font-heading text-brand-tertiary text-lg font-semibold md:text-xl">
                    Sorteador oficial
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawModalOpen(false)}
                  className="border-brand-line text-brand-tertiary hover:border-brand-secondary hover:text-brand-secondary rounded-xl border px-3 py-1 text-xs font-semibold transition"
                >
                  Fechar
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <DrawStage autoStartSignal={autoStartSignal} />
                <WinnersList />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
