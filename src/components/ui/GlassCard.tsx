import type { PropsWithChildren } from 'react'

interface GlassCardProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  className?: string
}

export function GlassCard({ title, subtitle, className, children }: GlassCardProps) {
  return (
    <section
      className={[
        'border-brand-line bg-brand-panel/55 rounded-3xl border p-4 shadow-[0_22px_54px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {title || subtitle ? (
        <header className="mb-4 space-y-1">
          {title ? (
            <h2 className="font-heading text-brand-tertiary text-xl tracking-wide">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="text-brand-muted text-xs font-normal">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  )
}
