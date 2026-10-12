import { useState } from 'react'
import logo from '../assets/logo-round.png'
import { businesses } from '../data/mockData'

export default function Topbar() {
  const [selected, setSelected] = useState(businesses[0].id)
  const [open, setOpen] = useState(false)
  const current = businesses.find((b) => b.id === selected) ?? businesses[0]

  return (
    <header className="flex items-center justify-between gap-4 border-b border-mc-border bg-mc-navy/95 px-5 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <img src={logo} alt="MASTER CONTROL" className="h-8 w-8 rounded-full" />
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-mc-border bg-mc-navy-light px-3 py-2 text-left text-sm text-mc-text transition-colors hover:border-mc-mint/40"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-mc-mint/15 text-xs font-bold text-mc-mint">
            {current.name.charAt(0)}
          </span>
          <span>
            <span className="block font-semibold leading-tight">{current.name}</span>
            <span className="block text-[11px] leading-tight text-mc-text-dim">{current.kind}</span>
          </span>
          <span className="ml-1 text-mc-text-dim">▾</span>
        </button>

        {open && (
          <div className="absolute z-10 mt-2 w-64 overflow-hidden rounded-xl border border-mc-border bg-mc-navy-light shadow-xl shadow-black/30">
            {businesses.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelected(b.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-mc-navy ${
                  b.id === selected ? 'text-mc-mint' : 'text-mc-text'
                }`}
              >
                <span>
                  <span className="block font-medium">{b.name}</span>
                  <span className="block text-[11px] text-mc-text-dim">{b.kind}</span>
                </span>
                {b.id === selected && <span>✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="hidden w-72 items-center gap-2 rounded-lg border border-mc-border bg-mc-navy-light px-3 py-2 text-sm text-mc-text-dim md:flex">
          <span>🔍</span>
          <span>Ask anything about your business…</span>
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-mc-border bg-mc-navy-light text-mc-text-dim hover:text-mc-text">
          🔔
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mc-red text-[10px] font-bold text-white">
            4
          </span>
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mc-mint text-sm font-bold text-mc-navy">
          TV
        </div>
      </div>
    </header>
  )
}
