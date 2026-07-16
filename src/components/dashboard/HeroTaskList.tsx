import { CheckSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'

export function HeroTaskList() {
  return (
    <Card className="p-5 sm:p-6 flex flex-col gap-4 sm:gap-5">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CheckSquare className="w-5 h-5" /> What to do now
      </h2>
      
      <div className="flex flex-col gap-3">
        {/* Task 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border border-border rounded-md p-3 sm:p-4 bg-background transition-colors hover:bg-muted/50">
          <div className="hidden sm:block w-1 self-stretch rounded-full shrink-0 bg-destructive"></div>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="font-semibold text-foreground">Fix the Office printer</div>
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-md">Office</Badge> 
              <span>stopped working at 11:42 AM</span>
            </div>
          </div>
          
          <Button className="w-full sm:w-auto">Ask IT for help</Button>
        </div>

        {/* Task 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border border-border rounded-md p-3 sm:p-4 bg-background transition-colors hover:bg-muted/50">
          <div className="hidden sm:block w-1 self-stretch rounded-full shrink-0 bg-amber-500"></div>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="font-semibold text-foreground">Check 3 computers</div>
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-md">Lab 1 • PC 12</Badge>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-md">Lab 3 • PC 4</Badge>
              <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-md">Office • PC 9</Badge>
            </div>
          </div>
          
          <Button variant="outline" className="w-full sm:w-auto">Check now</Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mt-1">
        0 of 2 handled today
      </div>
    </Card>
  )
}
