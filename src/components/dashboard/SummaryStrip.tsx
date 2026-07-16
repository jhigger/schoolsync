import type { DashboardStats } from '../../lib/mockData'

type SummaryStripProps = {
  stats: DashboardStats
}

export function SummaryStrip({ stats }: SummaryStripProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 flex-wrap text-sm text-muted-foreground bg-card border border-border rounded-lg px-4 py-3 shrink-0 shadow-sm">
      <span>
        <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1.5 bg-green-500"></span>
        <b>{stats.computersWorking} of {stats.computersTotal}</b> computers are working fine
      </span>
      <span className="hidden sm:inline text-border">•</span>
      <span>
        <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1.5 bg-destructive"></span>
        <b>{stats.printersNeedingFix}</b> printer needs fixing
      </span>
      <span className="hidden sm:inline text-border">•</span>
      <span>
        <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1.5 bg-amber-500"></span>
        <b>{stats.issuesWorthReviewing}</b> worth a look
      </span>
    </div>
  )
}
