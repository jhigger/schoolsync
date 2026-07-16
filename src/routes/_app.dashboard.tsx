import { createFileRoute, Link } from '@tanstack/react-router'
import { Printer } from 'lucide-react'
import { StatusAlert } from '../components/dashboard/StatusAlert'
import { SummaryStrip } from '../components/dashboard/SummaryStrip'
import { HeroTaskList } from '../components/dashboard/HeroTaskList'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-8">
      <StatusAlert />
      
      <SummaryStrip />

      <HeroTaskList />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-border">
        <Button size="lg" className="gap-2 w-full sm:w-auto">
          <Printer className="w-5 h-5" />
          Print today's report
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto p-0">
          <Link to="/activity" className="w-full h-full flex items-center justify-center px-8">See full activity log</Link>
        </Button>
        <span className="text-sm text-muted-foreground hidden lg:inline">
          Printing makes a plain one-page summary of today.
        </span>
      </div>
    </div>
  )
}
