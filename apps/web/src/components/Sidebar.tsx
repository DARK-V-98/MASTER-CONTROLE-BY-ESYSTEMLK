import logo from '../assets/logo-round.png'
import { moduleShortcuts } from '../data/mockData'

const navIcons: Record<string, string> = {
  dashboard: '⬛',
  inventory: '📦',
  crm: '👥',
  hr: '🧑‍💼',
  accounting: '📊',
  automation: '⚡',
}

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-mc-border bg-mc-ink lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <img src={logo} alt="MASTER CONTROL" className="h-10 w-10 rounded-full" />
        <div>
          <p className="text-sm font-bold tracking-wide text-mc-text">MASTER CONTROL</p>
          <p className="text-[11px] text-mc-text-dim">Every business. One command.</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        <SidebarLink icon={navIcons.dashboard} label="Dashboard" active />
        {moduleShortcuts.map((m) => (
          <SidebarLink key={m.id} icon={navIcons[m.id]} label={m.name} />
        ))}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-mc-border bg-mc-navy-light p-4">
        <p className="text-xs font-semibold text-mc-mint">AI usage this month</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mc-navy">
          <div className="h-full w-[62%] rounded-full bg-mc-mint" />
        </div>
        <p className="mt-2 text-[11px] text-mc-text-dim">6,240 / 10,000 Gemini calls</p>
      </div>
    </aside>
  )
}

function SidebarLink({
  icon,
  label,
  active = false,
}: {
  icon: string
  label: string
  active?: boolean
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
        active
          ? 'bg-mc-mint/10 font-semibold text-mc-mint'
          : 'text-mc-text-dim hover:bg-mc-navy-light hover:text-mc-text'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      {label}
    </a>
  )
}
