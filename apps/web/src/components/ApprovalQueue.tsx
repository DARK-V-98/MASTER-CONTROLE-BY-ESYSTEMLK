import { useState } from 'react'
import { approvals as initialApprovals } from '../data/mockData'
import type { ApprovalItem } from '../types/dashboard'

const kindLabel: Record<ApprovalItem['kind'], string> = {
  reorder: 'Reorder',
  reminder: 'Collection',
  leave: 'Leave',
  payroll: 'Payroll',
  reply: 'Customer reply',
}

export default function ApprovalQueue() {
  const [items, setItems] = useState(initialApprovals)

  const resolve = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <div className="rounded-2xl border border-mc-border bg-mc-navy-light">
      <div className="flex items-center justify-between border-b border-mc-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-mc-text">Needs your decision</h2>
          <p className="text-xs text-mc-text-dim">AI-drafted actions waiting on you</p>
        </div>
        <span className="rounded-full bg-mc-mint/15 px-2.5 py-1 text-xs font-semibold text-mc-mint">
          {items.length} pending
        </span>
      </div>

      <div className="divide-y divide-mc-border">
        {items.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-mc-text-dim">
            All caught up — nothing waiting on you right now.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-5 py-4">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                item.urgent ? 'bg-mc-red' : 'bg-mc-amber'
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-mc-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mc-text-dim">
                  {kindLabel[item.kind]}
                </span>
                <span className="text-[11px] text-mc-text-dim">{item.business}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-mc-text">{item.title}</p>
              <p className="mt-0.5 text-xs text-mc-text-dim">{item.detail}</p>
              {item.amount && (
                <p className="mt-1 text-xs font-semibold text-mc-mint">{item.amount}</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => resolve(item.id)}
                className="rounded-lg bg-mc-mint px-3 py-1.5 text-xs font-semibold text-mc-navy transition-opacity hover:opacity-90"
              >
                Approve
              </button>
              <button
                onClick={() => resolve(item.id)}
                className="rounded-lg border border-mc-border px-3 py-1.5 text-xs font-semibold text-mc-text-dim transition-colors hover:text-mc-text"
              >
                Skip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
