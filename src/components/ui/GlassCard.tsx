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
        'rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_22px_54px_rgba(0,0,0,0.35)] backdrop-blur-xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="mb-4 space-y-1">
        <h2 className="font-heading text-xl font-semibold tracking-tight text-slate-50">
          {title}
        </h2>
        {subtitle ? <p className="text-sm text-slate-300">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  )
}
