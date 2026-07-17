import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { fetchAlertsData, fetchRulesData } from '@/lib/mockData'
import type { AlertItem, RuleItem } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_app/alerts')({
  component: AlertsRoute,
})

function AlertsRoute() {
  const [activeTab, setActiveTab] = useState<'review' | 'rules'>('review')
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [rules, setRules] = useState<RuleItem[]>([])
  const [loading, setLoading] = useState(true)

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
    <section className="flex-1 flex flex-col gap-4 p-4 sm:p-[18px_22px] max-w-full w-full" data-view="alerts" id="view-alerts">
      <div className="tabs">
        <button 
          className={cn("tab", activeTab === 'review' && "active")} 
          onClick={() => setActiveTab('review')}
        >
          Needs review {reviewCount > 0 && <span className="badge destructive" id="tabBadge">{reviewCount}</span>}
        </button>
        <button 
          className={cn("tab", activeTab === 'rules' && "active")} 
          onClick={() => setActiveTab('rules')}
        >
          What I get alerted about
        </button>
      </div>

      {/* TAB: Needs review */}
      <div className={cn("tabpanel", activeTab === 'review' && "active")} data-panel="review">
        {loading ? (
          <div className="list">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="list" id="alertList">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="empty shown" id="emptyReview">
            <div className="icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div className="e-title">You’re all caught up</div>
            <div>No alerts need your review right now. Anything new will show up here.</div>
          </div>
        )}
      </div>

      {/* TAB: Rules */}
      <div className={cn("tabpanel", activeTab === 'rules' && "active")} data-panel="rules">
        {loading ? (
          <div className="list">
            <div className="section-label">Tell me when…</div>
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={`tell-${i}`} className="h-[80px] w-full rounded-lg" />
            ))}
            <div className="section-label" style={{ marginTop: '8px' }}>How I’m told</div>
            <Skeleton className="h-[80px] w-full rounded-lg" />
          </div>
        ) : (
          <div className="list">
            <div className="section-label">Tell me when…</div>
            {reviewRules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
            
            <div className="section-label" style={{ marginTop: '8px' }}>How I’m told</div>
            {toldRules.map(rule => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        )}
      </div>
    </section>
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

function AlertCard({ alert }: { alert: AlertItem }) {
  return (
    <div className={cn("alert-card", alert.severity === 'high' ? 'high' : 'med')} data-alert>
      <div className="ac-icon">
        <AlertIcon type={alert.iconType} />
      </div>
      <div className="ac-body">
        <div className="ac-title">{alert.title}</div>
        <div className="ac-desc">{alert.description}</div>
        <div className="ac-meta">
          <span className="chip">{alert.location}</span>
          <span className="ac-time">{alert.time}</span>
          <span className={cn("badge only-detailed", alert.severity === 'high' ? 'destructive' : 'warning')}>
            {alert.severity === 'high' ? 'High' : 'Medium'}
          </span>
        </div>
        <div className="ac-tech">
          {alert.techDetails}
        </div>
      </div>
      <div className="ac-actions">
        <button className="btn btn-primary btn-sm" data-review>Mark as reviewed</button>
        <button className="btn btn-outline btn-sm" data-details>See details</button>
      </div>
    </div>
  )
}

function RuleCard({ rule }: { rule: RuleItem }) {
  return (
    <div className="rule">
      <div className="r-body">
        <div className="r-title">{rule.title}</div>
        <div className="r-sub">{rule.sub}</div>
        {rule.type === 'threshold' && (
          <div className="threshold only-detailed">
            {rule.thresholdText} <input type="number" defaultValue={rule.thresholdValue} readOnly /> {rule.thresholdUnit}
          </div>
        )}
      </div>
      <div className={cn("switch", rule.defaultOn && "on")}></div>
    </div>
  )
}
