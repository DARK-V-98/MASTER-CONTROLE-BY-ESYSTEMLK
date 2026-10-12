import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BriefingBanner from './components/BriefingBanner'
import StatCard from './components/StatCard'
import ApprovalQueue from './components/ApprovalQueue'
import AlertsPanel from './components/AlertsPanel'
import SalesChart from './components/SalesChart'
import ModuleGrid from './components/ModuleGrid'

export default function App() {
  return (
    <div className="flex min-h-screen bg-mc-navy">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 space-y-6 px-5 py-6 lg:px-8">
          <BriefingBanner />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Today's sales" value="LKR 467,000" delta="9% vs last week" />
            <StatCard label="Cash position" value="LKR 8.2M" delta="2.1% vs last week" />
            <StatCard
              label="Outstanding receivables"
              value="LKR 2.1M"
              delta="3 overdue"
              deltaPositive={false}
            />
            <StatCard
              label="Low stock items"
              value="7 SKUs"
              delta="Across 3 branches"
              deltaPositive={false}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <ApprovalQueue />
            </div>
            <AlertsPanel />
          </div>

          <SalesChart />

          <ModuleGrid />
        </main>
      </div>
    </div>
  )
}
