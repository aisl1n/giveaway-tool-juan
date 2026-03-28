import { DrawStage } from './components/draw/DrawStage'
import { WinnersList } from './components/draw/WinnersList'
import { ParticipantsInput } from './components/setup/ParticipantsInput'
import { PrizesManager } from './components/setup/PrizesManager'
import { useRaffleStore } from './store/useRaffleStore'

function App() {
  const clearAll = useRaffleStore((state) => state.clearAll)

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.2),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.16),transparent_38%)]" />

      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="relative rounded-3xl border border-white/15 bg-white/10 px-6 py-5 shadow-[0_18px_44px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase">
                Premium Giveaway
              </p>
              <h1 className="font-heading mt-2 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
                Sorteio Oficial do Personal Trainer
              </h1>
            </div>

            <div className="flex h-16 w-36 items-center justify-center rounded-2xl border border-dashed border-white/30 bg-black/20 text-xs font-medium tracking-wider text-slate-300 uppercase">
              Sua logo aqui
            </div>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <section className="space-y-6">
            <ParticipantsInput />
            <PrizesManager />

            <button
              type="button"
              onClick={clearAll}
              className="rounded-2xl border border-red-300/25 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:border-red-300/45 hover:bg-red-500/20"
            >
              Limpar todos os dados
            </button>
          </section>

          <section className="space-y-6">
            <DrawStage />
            <WinnersList />
          </section>
        </main>

        <footer className="pb-2 text-center text-xs text-slate-400">
          Desenvolvido para sorteios de alta performance com experiencia premium.
        </footer>
      </div>
    </div>
  )
}

export default App
