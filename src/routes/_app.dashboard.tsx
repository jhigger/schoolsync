import { createFileRoute, Link } from '@tanstack/react-router'
import { Printer } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { StatusAlert } from '../components/dashboard/StatusAlert'
import { SummaryStrip } from '../components/dashboard/SummaryStrip'
import { HeroTaskList } from '../components/dashboard/HeroTaskList'
import { ActivityFeed } from '../components/dashboard/ActivityFeed'
import { Button, buttonVariants } from '../components/ui/button'
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
        <div className="flex flex-col sm:flex-row gap-4 h-[350px]">
          <Skeleton className="flex-[1.15] h-full rounded-lg" />
          <Skeleton className="flex-1 h-full rounded-lg" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-border">
          <Skeleton className="h-11 w-full sm:w-[200px] rounded-md" />
          <Skeleton className="h-11 w-full sm:w-[200px] rounded-md" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="gap-6 pb-8">
      <StatusAlert count={data.stats.attentionCount} />
      
      <SummaryStrip stats={data.stats} />

      <div className="flex flex-col sm:flex-row gap-4 items-stretch h-auto sm:h-[400px]">
        <HeroTaskList tasks={data.tasks} className="flex-[1.15] h-full" />
        <div className="flex-1 h-full">
          <ActivityFeed feed={data.feed} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-border">
        <Button size="lg" className="gap-2 w-full sm:w-auto">
          <Printer className="w-5 h-5" />
          Print today's report
        </Button>
        <Link to="/activity" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full sm:w-auto px-8' })}>
          See full activity log
        </Link>
        <span className="text-sm text-muted-foreground hidden lg:inline">
          Printing makes a plain one-page summary of today.
        </span>
      </div>
    </PageContainer>
  )
}
