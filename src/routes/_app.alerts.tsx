import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
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
  const [activeTab, setActiveTab] = useState<'review' | 'reviewed' | 'rules'>('review')
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [rules, setRules] = useState<RuleItem[]>([])
  const [loading, setLoading] = useState(true)
  const reviewedAlertIds = useStore(state => state.sessionActivity.reviewedAlertIds)
  const dismissedAlertIds = useStore(state => state.sessionActivity.dismissedAlertIds)
  const updateSessionActivity = useStore(state => state.updateSessionActivity)
  const viewMode = useStore(state => state.viewMode)
  const isDetailed = viewMode === 'detailed'
  const sessionReviewed = useRef<Set<string>>(new Set())

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

  const reviewCount = alerts.filter(a => !reviewedAlertIds.includes(a.id) && !dismissedAlertIds.includes(a.id)).length

  const reviewRules = rules.filter(r => r.section === 'Tell me when…')
  const toldRules = rules.filter(r => r.section === 'How I’m told')

  const handleReview = (id: string) => {
    sessionReviewed.current.add(id)
    updateSessionActivity('reviewedAlertIds', (prev: string[]) => [...prev, id])
  }
  const handleUndo = (id: string) => {
    sessionReviewed.current.delete(id)
    updateSessionActivity('reviewedAlertIds', (prev: string[]) => prev.filter(x => x !== id))
    updateSessionActivity('dismissedAlertIds', (prev: string[]) => prev.filter(x => x !== id))
  }
  const handleDismiss = (id: string) => updateSessionActivity('dismissedAlertIds', (prev: string[]) => prev.includes(id) ? prev : [...prev, id])

  const setAlertsCount = useStore(state => state.setAlertsCount)
  const globalAlertsCount = useStore(state => state.alertsCount)
  useEffect(() => {
    if (!loading) {
      setAlertsCount(reviewCount)
    }
  }, [reviewCount, loading, setAlertsCount])

  const displayCount = loading ? globalAlertsCount : reviewCount
  const needsReviewAlerts = alerts.filter(a => !dismissedAlertIds.includes(a.id) && (!reviewedAlertIds.includes(a.id) || sessionReviewed.current.has(a.id)))

  return (
    <PageContainer as="section" className="flex flex-col flex-1 overflow-hidden p-4 md:p-6 gap-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-xl w-fit">
        <button 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'review' 
              ? "bg-white text-foreground shadow-sm dark:bg-background" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
          )} 
          onClick={() => setActiveTab('review')}
        >
          Needs review {(displayCount || 0) > 0 && <Badge variant="destructive" className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full p-0 text-[10px]">{displayCount}</Badge>}
        </button>
        <button 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'reviewed' 
              ? "bg-white text-foreground shadow-sm dark:bg-background" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
          )} 
          onClick={() => setActiveTab('reviewed')}
        >
          Reviewed
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
          ) : needsReviewAlerts.length > 0 ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 overflow-x-hidden">
              {needsReviewAlerts.map(alert => {
                return (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    isDetailed={isDetailed} 
                    tab="review"
                    onReview={handleReview}
                    onUndo={handleUndo}
                    onDismiss={handleDismiss}
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground text-center p-12">
              <div className="w-14 h-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>
              </div>
              <div className="text-[17px] font-bold text-foreground">No alerts</div>
              <div className="text-sm">No alerts need your review right now. Anything new will show up here.</div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Reviewed */}
      {activeTab === 'reviewed' && (
        <div className="flex-1 min-h-0 flex flex-col">
          {loading ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              <Skeleton className="h-[140px] w-full rounded-xl" />
            </div>
          ) : alerts.filter(a => reviewedAlertIds.includes(a.id)).length > 0 ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 overflow-x-hidden">
              {alerts.filter(a => reviewedAlertIds.includes(a.id)).map(alert => (
                <AlertCard 
                  key={alert.id} 
                  alert={alert} 
                  isDetailed={isDetailed} 
                  tab="reviewed"
                  onReview={handleReview}
                  onUndo={handleUndo}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground text-center p-12">
              <div className="w-14 h-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>
              </div>
              <div className="text-[17px] font-bold text-foreground">No reviewed alerts</div>
              <div className="text-sm">Alerts you mark as reviewed will appear here after they are dismissed.</div>
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

type AlertCardProps = {
  alert: AlertItem
  isDetailed: boolean
  isReviewed: boolean
  tab: 'review' | 'reviewed'
  onReview: (id: string) => void
  onUndo: (id: string) => void
  onDismiss: (id: string) => void
}



function AlertCard({ alert, isDetailed, tab, onReview, onUndo, onDismiss }: Omit<AlertCardProps, 'isReviewed'>) {
  const isHigh = alert.severity === 'high'
  const [isSlidingOut, setIsSlidingOut] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState<number | 'auto'>('auto')
  const [fullyDismissed, setFullyDismissed] = useState(false)
  
  const timerActiveRef = useRef(timerActive)
  timerActiveRef.current = timerActive
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss
  const tabRef = useRef(tab)
  tabRef.current = tab

  // Unmount effect to immediately dismiss if user navigates away before timer ends
  useEffect(() => {
    return () => {
      if (timerActiveRef.current && tabRef.current === 'review') {
        onDismissRef.current(alert.id)
      }
    }
  }, [alert.id])

  // Timer effect for auto-dismiss
  useEffect(() => {
    if (timerActive && tab === 'review') {
      const timer = setTimeout(() => {
        setCardHeight(0)
        setFullyDismissed(true)
        setTimeout(() => {
          onDismissRef.current(alert.id)
        }, 300) // wait for height transition to finish
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [timerActive, tab, alert.id])

  const handleReview = () => {
    if (contentRef.current) {
      setCardHeight(contentRef.current.offsetHeight)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSlidingOut(true)
          setCardHeight(72)
        })
      })
    } else {
      setIsSlidingOut(true)
      setCardHeight(72)
    }

    setTimeout(() => {
      onReview(alert.id)
      setTimerActive(true)
    }, 300)
  }

  const handleUndoLocal = () => {
    setTimerActive(false)
    setIsSlidingOut(false)
    if (contentRef.current) {
      setCardHeight(contentRef.current.scrollHeight)
      setTimeout(() => setCardHeight('auto'), 300)
    }
    onUndo(alert.id)
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 ease-in-out",
        fullyDismissed ? "opacity-0 mb-0 border-transparent" : "opacity-100",
        isHigh ? "border-l-4 border-l-destructive bg-destructive/5" : "border-l-4 border-l-warning bg-warning/5"
      )}
      style={{ height: cardHeight !== 'auto' ? `${cardHeight}px` : undefined }}
    >
      <style>{`
        @keyframes progress-dash {
          from { stroke-dashoffset: 88; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      
      {/* Old Card (rendered for layout measurement and slide animation) */}
      <div 
        ref={contentRef}
        className={cn(
          "w-full flex flex-col md:flex-row gap-4 p-4 items-start transition-all duration-300 pointer-events-auto",
          isSlidingOut ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        )}
      >
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
          {(isDetailed || showDetails) && (
            <div className="text-[13px] text-foreground/70 leading-relaxed mt-3 pt-3 border-t font-mono break-words">
              {alert.techDetails}
            </div>
          )}
        </div>
        
        <div className="flex flex-row md:flex-col gap-2 items-stretch md:items-end flex-shrink-0 w-full md:w-auto mt-2 md:mt-0 relative z-10">
          {tab === 'review' ? (
            <Button size="sm" className="flex-1 md:flex-none" onClick={handleReview}>Mark as reviewed</Button>
          ) : (
            <Button size="sm" variant="outline" className="flex-1 md:flex-none" onClick={() => handleUndoLocal()}>Move to needs review</Button>
          )}
          <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide details" : "See details"}
          </Button>
        </div>
      </div>
      
      {/* Undo Toast (animates in from bottom simultaneously) */}
      {tab === 'review' && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-between bg-muted p-4 transition-all duration-300 self-start w-full h-[72px] pointer-events-auto",
          isSlidingOut ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        )}>
          <div className="flex items-center gap-2 text-[14.5px] font-semibold text-foreground/80">
             <svg className="w-4 h-4 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
             Alert marked as reviewed
          </div>
          <button 
            onClick={handleUndoLocal}
            disabled={fullyDismissed}
            className={cn(
              "relative flex items-center justify-center w-[34px] h-[34px] rounded-full bg-background border border-border shadow-sm transition-colors group",
              fullyDismissed ? "opacity-50 cursor-not-allowed" : "hover:bg-muted-foreground/10"
            )}
            title="Undo"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90 text-foreground" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="88" strokeDashoffset="88" style={{ animation: timerActive ? 'progress-dash 2s linear forwards' : 'none' }} />
            </svg>
            <svg className="w-3.5 h-3.5 text-foreground relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
            </svg>
          </button>
        </div>
      )}
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
