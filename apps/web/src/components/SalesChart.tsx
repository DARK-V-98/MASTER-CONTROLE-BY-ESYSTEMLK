import { salesTrend } from '../data/mockData'

const WIDTH = 560
const HEIGHT = 180
const PAD_L = 8
const PAD_B = 24
const PAD_T = 12

export default function SalesChart() {
  const max = Math.max(...salesTrend.map((p) => p.value))
  const barWidth = (WIDTH - PAD_L * 2) / salesTrend.length
  const chartH = HEIGHT - PAD_B - PAD_T

  return (
    <div className="rounded-2xl border border-mc-border bg-mc-navy-light p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-mc-text">Sales this week</h2>
          <p className="text-xs text-mc-text-dim">All businesses combined</p>
        </div>
        <span className="text-xs font-semibold text-mc-mint">↑ 9% vs last week</span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Daily sales for the last 7 days, trending up 9 percent versus last week"
        className="mt-4 w-full"
      >
        {salesTrend.map((p, i) => {
          const h = (p.value / max) * chartH
          const x = PAD_L + i * barWidth
          const y = PAD_T + (chartH - h)
          const isLast = i === salesTrend.length - 1
          return (
            <g key={p.label}>
              <rect
                x={x + barWidth * 0.18}
                y={y}
                width={barWidth * 0.64}
                height={h}
                rx={4}
                fill={isLast ? 'var(--color-mc-mint)' : 'var(--color-mc-mint)'}
                fillOpacity={isLast ? 1 : 0.45}
              />
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 6}
                textAnchor="middle"
                fontSize="10.5"
                fill="var(--color-mc-text-dim)"
              >
                {p.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
