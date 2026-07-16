import { CheckSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import type { DashboardTask } from '../../lib/mockData'

type TaskItemProps = {
  task: DashboardTask
}

const severityConfig = {
  high: {
    accentClass: 'bg-destructive',
    buttonVariant: 'default' as const,
  },
  medium: {
    accentClass: 'bg-amber-500',
    buttonVariant: 'outline' as const,
  },
}

function TaskItem({ task }: TaskItemProps) {
  const config = severityConfig[task.severity]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border border-border rounded-md p-3 sm:p-4 bg-background transition-colors hover:bg-muted/50">
      <div className={`hidden sm:block w-1 self-stretch rounded-full shrink-0 ${config.accentClass}`}></div>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-semibold text-foreground">{task.title}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {task.badges.map((badge, idx) => (
            <Badge key={idx} variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-md">
              {badge}
            </Badge>
          ))}
          {task.description && <span>{task.description}</span>}
        </div>
      </div>
      
      <Button variant={config.buttonVariant} className="w-full sm:w-auto">
        {task.actionLabel}
      </Button>
    </div>
  )
}

export function HeroTaskList({ tasks, className }: { tasks: DashboardTask[], className?: string }) {
  return (
    <Card className={`p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 ${className || ''}`}>
      <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 shrink-0">
        <CheckSquare className="w-[15px] h-[15px]" /> What to do now
      </h2>
      
      <div className="flex flex-col gap-3">
        {tasks.map(task => <TaskItem key={task.id} task={task} />)}
      </div>
      
      <div className="text-sm text-muted-foreground mt-1">
        0 of {tasks.length} handled today
      </div>
    </Card>
  )
}
