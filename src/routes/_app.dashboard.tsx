import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { StatusAlert } from '../components/dashboard/StatusAlert'
import { SummaryStrip } from '../components/dashboard/SummaryStrip'
import { HeroTaskList } from '../components/dashboard/HeroTaskList'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'

import { Skeleton } from '../components/ui/skeleton'
import { PageContainer } from '../components/PageContainer'
import { fetchDashboardData } from '../lib/mockData'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  })

  if (isLoading || !data) {
    return (
      <PageContainer className="gap-6">
        <Skeleton className="h-[48px] w-full rounded-lg" />
        <Skeleton className="h-[46px] w-full rounded-lg" />
        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-[500px]">
          <Skeleton className="flex-1 h-full rounded-lg" />
          <Skeleton className="flex-1 h-full rounded-lg" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="gap-6 pb-8">
      <StatusAlert count={data.stats.attentionCount} />
      
      <SummaryStrip stats={data.stats} />

      <div className="flex flex-col sm:flex-row gap-4 items-stretch flex-1 min-h-[500px]">
        <HeroTaskList tasks={data.tasks} className="flex-1 h-full" />
        <div className="flex-1 h-full">
          <ActivityFeed feed={data.feed} />
        </div>
      </div>
    </PageContainer>
  )
}
