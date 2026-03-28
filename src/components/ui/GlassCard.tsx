import type { PropsWithChildren } from 'react'

interface GlassCardProps extends PropsWithChildren {
  title: string
  subtitle?: string
  className?: string
}

export function GlassCard({ title, subtitle, className, children }: GlassCardProps) {
  return (
    <section
      className={[
        'border-brand-line bg-brand-panel/55 rounded-3xl border p-5 shadow-[0_22px_54px_rgba(0,0,0,0.35)] backdrop-blur-xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="mb-4 space-y-1">
        <h2 className="font-heading text-brand-tertiary text-xl font-semibold tracking-wide">
          {title}
        </h2>
        {subtitle ? <p className="text-brand-muted text-sm">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  )
}
