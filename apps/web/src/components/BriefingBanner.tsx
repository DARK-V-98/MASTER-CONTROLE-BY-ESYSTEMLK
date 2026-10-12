import logo from '../assets/logo-round.png'
import { aiBriefing } from '../data/mockData'

export default function BriefingBanner() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-mc-mint/25 bg-gradient-to-br from-mc-mint/10 via-mc-navy-light to-mc-navy-light p-5">
      <img src={logo} alt="" className="h-10 w-10 shrink-0 rounded-full" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-mc-mint">
          Your daily briefing
        </p>
        <p className="mt-1 text-sm leading-relaxed text-mc-text">{aiBriefing}</p>
      </div>
    </div>
  )
}
