import { moduleShortcuts } from '../data/mockData'

const icons: Record<string, string> = {
  inventory: '📦',
  crm: '👥',
  hr: '🧑‍💼',
  accounting: '📊',
  automation: '⚡',
}

export default function ModuleGrid() {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-mc-text">Jump into a module</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {moduleShortcuts.map((m) => (
          <a
            key={m.id}
            href="#"
            className="group rounded-2xl border border-mc-border bg-mc-navy-light p-4 transition-colors hover:border-mc-mint/40"
          >
            <span className="text-xl">{icons[m.id]}</span>
            <p className="mt-2 text-sm font-semibold text-mc-text group-hover:text-mc-mint">
              {m.name}
            </p>
            <p className="mt-0.5 text-xs text-mc-text-dim">{m.description}</p>
            <p className="mt-3 text-xs font-medium text-mc-mint">{m.stat}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
