import { alerts } from '../data/mockData'
import type { AlertItem } from '../types/dashboard'

const severityStyle: Record<AlertItem['severity'], string> = {
  critical: 'bg-mc-red/15 text-mc-red',
  warning: 'bg-mc-amber/15 text-mc-amber',
  info: 'bg-mc-mint/15 text-mc-mint',
}

const severityDot: Record<AlertItem['severity'], string> = {
  critical: 'bg-mc-red',
  warning: 'bg-mc-amber',
  info: 'bg-mc-mint',
}

export default function AlertsPanel() {
  return (
    <div className="rounded-2xl border border-mc-border bg-mc-navy-light">
      <div className="border-b border-mc-border px-5 py-4">
        <h2 className="text-sm font-semibold text-mc-text">Live alerts</h2>
        <p className="text-xs text-mc-text-dim">Across every business you run</p>
      </div>
      <div className="divide-y divide-mc-border">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${severityDot[a.severity]}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-mc-text">{a.message}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${severityStyle[a.severity]}`}
                >
                  {a.severity}
                </span>
                <span className="text-[11px] text-mc-text-dim">{a.business}</span>
                <span className="text-[11px] text-mc-text-dim">· {a.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
