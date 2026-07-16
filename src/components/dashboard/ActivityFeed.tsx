import { Card } from '../ui/card'
import type { DashboardFeedItem } from '../../lib/mockData'
import { Activity } from 'lucide-react'

export function ActivityFeed({ feed }: { feed: DashboardFeedItem[] }) {
  return (
    <Card className="flex flex-col p-4 sm:p-5 h-full">
      <h2 className="text-[12.5px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5 shrink-0">
        <Activity className="w-[15px] h-[15px]" /> Today's activity
      </h2>
      
      <div className="flex gap-2 mb-2 shrink-0">
        <select className="h-[34px] border border-border rounded-lg px-2.5 text-[13px] bg-background">
          <option>All rooms</option>
        </select>
      </div>
      
      <div className="overflow-y-auto flex-1 min-h-0 pr-1 space-y-1">
        {feed.map(item => (
          <div key={item.id} className="flex gap-3 py-2 items-start">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
              item.type === 'g' ? 'bg-green-500' :
              item.type === 'a' ? 'bg-amber-500' :
              'bg-destructive'
            }`}></div>
            <div>
              <div className="text-[14px] leading-snug">{item.text}</div>
              <div className="text-[12.5px] text-muted-foreground mt-0.5">{item.time}</div>
              {item.techDetails && (
                <div className="text-[12px] text-muted-foreground font-mono mt-1">
                  {item.techDetails}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="text-center text-xs text-muted-foreground pt-3 pb-1">
          End of today's activity
        </div>
      </div>
    </Card>
  )
}
