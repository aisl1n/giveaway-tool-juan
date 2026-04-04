import { useEffect } from 'react'

import { DrawStage } from './DrawStage'

type DrawModalProps = {
  isOpen: boolean
  isDrawCompleted: boolean
  onClose: () => void
}

export function DrawModal({ isOpen, isDrawCompleted, onClose }: DrawModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || isDrawCompleted) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 md:p-4">
      <button
        type="button"
        aria-label="Fechar modal de sorteio"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-7xl items-center">
        <div className="border-brand-line bg-brand-panel/90 max-h-[calc(100vh-1rem)] w-full overflow-y-auto rounded-3xl border p-3 shadow-[0_26px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl md:max-h-[calc(100vh-2rem)] md:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <img
                src="/images/Logotipo-Principal.png"
                alt="Logotipo da marca"
                className="h-10 w-auto shrink-0 md:h-12"
              />
              <div className="flex flex-col justify-center leading-tight">
                <p className="text-brand-secondary text-xs tracking-[0.2em] uppercase">
                  Tela de sorteio
                </p>
                <h2 className="font-heading text-brand-tertiary text-lg font-semibold md:text-xl">
                  Sorteador oficial
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="border-brand-line text-brand-tertiary hover:border-brand-secondary hover:text-brand-secondary rounded-xl border px-3 py-1 text-xs font-semibold transition"
            >
              Fechar
            </button>
          </div>

          <DrawStage />
        </div>
      </div>
    </div>
  )
}
