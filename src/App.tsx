import { DrawStage } from './components/draw/DrawStage'
import { WinnersList } from './components/draw/WinnersList'
import { ParticipantsInput } from './components/setup/ParticipantsInput'
import { PrizesManager } from './components/setup/PrizesManager'
import { useRaffleStore } from './store/useRaffleStore'

function App() {
  const clearAll = useRaffleStore((state) => state.clearAll)

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(255,115,0,0.24),transparent_44%),radial-gradient(circle_at_82%_14%,rgba(69,51,175,0.42),transparent_40%)]" />

      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="border-brand-line bg-brand-panel/65 relative overflow-hidden rounded-3xl border px-6 py-5 shadow-[0_22px_52px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="bg-brand-primary/50 pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full blur-3xl" />
          <div className="bg-brand-secondary/40 pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full blur-3xl" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-10">
              <p className="text-brand-secondary text-xs tracking-[0.26em] uppercase">
                Fit Club Giveaway
              </p>
              <h1 className="font-heading text-brand-tertiary mt-2 text-2xl font-bold tracking-wide md:text-4xl">
                Sorteio Oficial do Personal Trainer
              </h1>
            </div>

            <img
              src="/images/Logotipo-Principal.png"
              alt="Logotipo da marca"
              className="relative z-10 h-16 w-auto rounded-xl bg-black/25 p-2 md:h-20"
            />
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <section className="space-y-6">
            <ParticipantsInput />
            <PrizesManager />

            <button
              type="button"
              onClick={clearAll}
              className="border-brand-secondary/40 bg-brand-secondary/15 text-brand-tertiary hover:border-brand-secondary hover:bg-brand-secondary/25 rounded-2xl border px-5 py-3 text-sm font-semibold transition"
            >
              Limpar todos os dados
            </button>
          </section>

          <section className="space-y-6">
            <DrawStage />
            <WinnersList />
          </section>
        </main>

        <footer className="text-brand-muted pb-2 text-center text-xs tracking-wide">
          Desenvolvido para sorteios de alta performance com experiencia premium.
        </footer>
      </div>
    </div>
  )
}

export default App
