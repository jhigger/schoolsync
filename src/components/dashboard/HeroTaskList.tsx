
import { CheckSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'

type TaskItemProps = {
  title: string
  badges: string[]
  description?: string
  accentColor: string
  actionLabel: string
  actionVariant?: 'default' | 'outline'
}

function TaskItem({
  title,
  badges,
  description,
  accentColor,
  actionLabel,
  actionVariant = 'default',
}: TaskItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border border-border rounded-md p-3 sm:p-4 bg-background transition-colors hover:bg-muted/50">
      <div className={`hidden sm:block w-1 self-stretch rounded-full shrink-0 ${accentColor}`}></div>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-semibold text-foreground">{title}</div>
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {badges.map((badge, idx) => (
            <Badge key={idx} variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-md">
              {badge}
            </Badge>
          ))}
          {description && <span>{description}</span>}
        </div>
      </div>
      
      <Button variant={actionVariant} className="w-full sm:w-auto">
        {actionLabel}
      </Button>
    </div>
  )
}

export function HeroTaskList() {
  return (
    <Card className="p-5 sm:p-6 flex flex-col gap-4 sm:gap-5">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CheckSquare className="w-5 h-5" /> What to do now
      </h2>
      
      <div className="flex flex-col gap-3">
        <TaskItem
          title="Fix the Office printer"
          badges={['Office']}
          description="stopped working at 11:42 AM"
          accentColor="bg-destructive"
          actionLabel="Ask IT for help"
        />
        <TaskItem
          title="Check 3 computers"
          badges={['Lab 1 • PC 12', 'Lab 3 • PC 4', 'Office • PC 9']}
          accentColor="bg-amber-500"
          actionLabel="Check now"
          actionVariant="outline"
        />
      </div>
      
      <div className="text-sm text-muted-foreground mt-1">
        0 of 2 handled today
      </div>
    </Card>
  )
}
