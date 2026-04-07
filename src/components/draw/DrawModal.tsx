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
        <div className="border-brand-line bg-brand-panel/90 relative max-h-[calc(100vh-1rem)] w-full overflow-y-auto rounded-3xl border p-3 shadow-[0_26px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl md:max-h-[calc(100vh-2rem)] md:p-5">
          <DrawStage onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
