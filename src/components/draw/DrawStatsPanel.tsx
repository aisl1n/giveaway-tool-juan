type DrawStat = {
  label: string
  value: number
}

type DrawStatsPanelProps = {
  items: DrawStat[]
}

function DrawStatCard({ label, value }: DrawStat) {
  return (
    <div className="border-brand-line bg-brand-surface/65 w-fit rounded-2xl border px-3 py-3 text-center">
      <p className="text-brand-muted text-[10px] tracking-wider uppercase">{label}</p>
      <p className="text-brand-tertiary mt-1 text-2xl leading-none font-semibold">
        {value}
      </p>
    </div>
  )
}

export function DrawStatsPanel({ items }: DrawStatsPanelProps) {
  return (
    <aside className="flex gap-3">
      {items.map((item) => (
        <DrawStatCard key={item.label} label={item.label} value={item.value} />
      ))}
    </aside>
  )
}
