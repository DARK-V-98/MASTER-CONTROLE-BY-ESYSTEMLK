type Props = {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  hint?: string
}

export default function StatCard({ label, value, delta, deltaPositive = true, hint }: Props) {
  return (
    <div className="rounded-2xl border border-mc-border bg-mc-navy-light p-5">
      <p className="text-xs font-medium text-mc-text-dim">{label}</p>
      <p className="mt-2 text-2xl font-bold text-mc-text">{value}</p>
      <div className="mt-2 flex items-center gap-2">
        {delta && (
          <span
            className={`text-xs font-semibold ${
              deltaPositive ? 'text-mc-mint' : 'text-mc-red'
            }`}
          >
            {deltaPositive ? '↑' : '↓'} {delta}
          </span>
        )}
        {hint && <span className="text-xs text-mc-text-dim">{hint}</span>}
      </div>
    </div>
  )
}
