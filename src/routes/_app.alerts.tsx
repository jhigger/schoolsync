import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { fetchAlertsData, fetchRulesData } from '@/lib/mockData'
import type { AlertItem, RuleItem } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { PageContainer } from '@/components/PageContainer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store'

export const Route = createFileRoute('/_app/alerts')({
  component: AlertsRoute,
})

function AlertsRoute() {
  const [activeTab, setActiveTab] = useState<'review' | 'rules'>('review')
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [rules, setRules] = useState<RuleItem[]>([])
  const [loading, setLoading] = useState(true)
  const viewMode = useStore(state => state.viewMode)
  const isDetailed = viewMode === 'detailed'

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [alertsData, rulesData] = await Promise.all([
        fetchAlertsData(),
        fetchRulesData()
      ])
      setAlerts(alertsData)
      setRules(rulesData)
      setLoading(false)
    }
    loadData()
  }, [])

  const reviewCount = alerts.length

  const reviewRules = rules.filter(r => r.section === 'Tell me when…')
  const toldRules = rules.filter(r => r.section === 'How I’m told')

  return (
    <PageContainer as="section" className="flex flex-col flex-1 overflow-hidden p-4 md:p-6 gap-4">
      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1 shrink-0 self-start gap-1">
        <button 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'review' 
              ? "bg-white text-foreground shadow-sm dark:bg-background" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
          )} 
          onClick={() => setActiveTab('review')}
        >
          Needs review {reviewCount > 0 && <Badge variant="destructive" className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px]">{reviewCount}</Badge>}
        </button>
        <button 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'rules' 
              ? "bg-white text-foreground shadow-sm dark:bg-background" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
          )} 
          onClick={() => setActiveTab('rules')}
        >
          What I get alerted about
        </button>
      </div>

      {/* TAB: Needs review */}
      {activeTab === 'review' && (
        <div className="flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
              ))}
            </div>
          ) : alerts.length > 0 ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {alerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} isDetailed={isDetailed} />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground text-center p-12">
              <div className="w-14 h-14 rounded-full bg-success/10 text-success flex items-center justify-center mb-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div className="text-[17px] font-bold text-foreground">You’re all caught up</div>
              <div className="text-sm">No alerts need your review right now. Anything new will show up here.</div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Rules */}
      {activeTab === 'rules' && (
        <div className="flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground my-1">Tell me when…</div>
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={`tell-${i}`} className="h-[80px] w-full rounded-xl" />
              ))}
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2 mb-1">How I’m told</div>
              <Skeleton className="h-[80px] w-full rounded-xl" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground my-1">Tell me when…</div>
              {reviewRules.map(rule => (
                <RuleCard key={rule.id} rule={rule} isDetailed={isDetailed} />
              ))}
              
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-2 mb-1">How I’m told</div>
              {toldRules.map(rule => (
                <RuleCard key={rule.id} rule={rule} isDetailed={isDetailed} />
              ))}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  )
}

function AlertIcon({ type }: { type: AlertItem['iconType'] }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {type === 'printer' && (
        <>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/>
          <rect x="6" y="14" width="12" height="8" rx="1"/>
        </>
      )}
      {type === 'password' && (
        <>
          <rect width="18" height="11" x="3" y="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </>
      )}
      {type === 'program' && (
        <>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </>
      )}
    </svg>
  )
}

function AlertCard({ alert, isDetailed }: { alert: AlertItem, isDetailed: boolean }) {
  const isHigh = alert.severity === 'high'
  return (
    <div className={cn(
      "flex flex-col md:flex-row gap-4 bg-card border rounded-xl p-4 items-start transition-all",
      isHigh ? "border-l-4 border-l-destructive" : "border-l-4 border-l-warning"
    )}>
      <div className={cn(
        "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg",
        isHigh ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
      )}>
        <AlertIcon type={alert.iconType} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15.5px] font-bold">{alert.title}</div>
        <div className="text-[14px] text-foreground/80 mt-1 leading-relaxed">{alert.description}</div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="secondary" className="rounded-md font-semibold text-[12.5px] bg-muted">{alert.location}</Badge>
          <span className="text-[12.5px] text-muted-foreground">{alert.time}</span>
          {isDetailed && (
            <Badge variant={isHigh ? 'destructive' : 'warning'} className="rounded-full px-2 py-0 h-5">
              {isHigh ? 'High' : 'Medium'}
            </Badge>
          )}
        </div>
        {isDetailed && (
          <div className="text-[13px] text-foreground/70 leading-relaxed mt-3 pt-3 border-t font-mono break-words">
            {alert.techDetails}
          </div>
        )}
      </div>
      <div className="flex flex-row md:flex-col gap-2 items-stretch md:items-end flex-shrink-0 w-full md:w-auto mt-2 md:mt-0">
        <Button size="sm" className="flex-1 md:flex-none">Mark as reviewed</Button>
        <Button variant="outline" size="sm" className="flex-1 md:flex-none">See details</Button>
      </div>
    </div>
  )
}

function RuleCard({ rule, isDetailed }: { rule: RuleItem, isDetailed: boolean }) {
  return (
    <div className="flex items-start gap-4 bg-card border rounded-xl p-4">
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold">{rule.title}</div>
        <div className="text-[13px] text-muted-foreground mt-1">{rule.sub}</div>
        {rule.type === 'threshold' && isDetailed && (
          <div className="flex items-center gap-2 mt-3 text-[13px] text-foreground/80">
            {rule.thresholdText} 
            <Input 
              type="number" 
              defaultValue={rule.thresholdValue} 
              readOnly 
              className="w-14 h-8 text-center text-sm px-2"
            /> 
            {rule.thresholdUnit}
          </div>
        )}
      </div>
      <Switch defaultChecked={rule.defaultOn} className="mt-1" />
    </div>
  )
}
