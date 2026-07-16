import { useQuery } from '@tanstack/react-query'
import { fetchRoomsData, type Room } from '@/lib/mockData'
import { useState, useMemo, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const ICON_PC = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
)
const ICON_PRN = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
)
const ICON_OTHER = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/><circle cx="12" cy="10" r="2"/></svg>
)

function devIcon(t: string) { return t==="printer"?ICON_PRN : t==="other"?ICON_OTHER : ICON_PC; }

function statusOf(room: Room) {
  if(room.devices.some(d=>d.status==="down")) return "down";
  if(room.devices.some(d=>d.status==="warn")) return "warn";
  return "ok";
}

export function DevicesRoute() {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRoomsData
  })

  const [activeFilter, setActiveFilter] = useState<'all' | 'problems'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [shownReports, setShownReports] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (rooms.length > 0 && selectedId === null) {
      setSelectedId('office')
    }
  }, [rooms, selectedId])

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const s = statusOf(room);
      const passFilter = activeFilter==="all" || (activeFilter==="problems" && s!=="ok");
      const passSearch = !query || room.name.toLowerCase().includes(query) || room.devices.some(d=>d.name.toLowerCase().includes(query));
      return passFilter && passSearch;
    })
  }, [rooms, activeFilter, query])

  const selectedRoom = useMemo(() => {
    return rooms.find(r => r.id === selectedId) || rooms[0]
  }, [rooms, selectedId])

  const filteredDevices = useMemo(() => {
    if (!selectedRoom) return []
    return selectedRoom.devices.filter(d => {
      return !query || d.name.toLowerCase().includes(query) || selectedRoom.name.toLowerCase().includes(query)
    })
  }, [selectedRoom, query])

  const { totalDevices, workingCount, attentionCount } = useMemo(() => {
    let t = 0, w = 0, a = 0;
    rooms.forEach(r => {
      r.devices.forEach(d => {
        t++;
        if (d.status === 'ok') w++;
        else a++;
      })
    })
    return { totalDevices: t, workingCount: w, attentionCount: a }
  }, [rooms])

  if (isLoading) {
    return (
      <div className="rd-view p-4 md:p-6 lg:p-8 animate-pulse">
        <div className="rd-summary">
          <Skeleton className="h-[74px] w-[140px] rounded-[10px]" />
          <Skeleton className="h-[74px] w-[140px] rounded-[10px]" />
          <Skeleton className="h-[74px] w-[140px] rounded-[10px]" />
        </div>
        <div className="rd-controls mt-2">
          <Skeleton className="h-[42px] w-full max-w-sm rounded-[10px]" />
          <Skeleton className="h-[42px] w-[100px] rounded-full" />
          <Skeleton className="h-[42px] w-[120px] rounded-full" />
        </div>
        <div className="rd-panes mt-2">
          <Skeleton className="rd-rooms" />
          <Skeleton className="rd-devices" />
        </div>
      </div>
    )
  }

  return (
    <div className="rd-view p-4 md:p-6 lg:p-8">
      <div className="rd-summary">
        <div className="rd-sum-chip"><span className="n">{totalDevices}</span><span className="l">Devices<br/>in total</span></div>
        <div className="rd-sum-chip"><span className="n">{workingCount}</span><span className="l">Working<br/>normally</span></div>
        <div className="rd-sum-chip bad"><span className="n">{attentionCount}</span><span className="l">Need<br/>attention</span></div>
        <div className="flex-1"></div>
        <Button variant="outline" size="sm" className="self-center hidden sm:flex h-[38px] px-[14px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>
          Export list
        </Button>
      </div>

      <div className="rd-controls">
        <div className="rd-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search a room or device… (example: Lab 1, printer, PC 12)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="rd-pills">
          <button className={`rd-pill ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All rooms</button>
          <button className={`rd-pill ${activeFilter === 'problems' ? 'active' : ''}`} onClick={() => setActiveFilter('problems')}>Has problems</button>
        </div>
      </div>

      <div className="rd-panes">
        <div className="rd-rooms">
          {filteredRooms.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '14px' }}>
              No rooms match.
            </div>
          ) : (
            filteredRooms.map(room => {
              const s = statusOf(room);
              const issues = room.devices.filter(d => d.status !== 'ok').length;
              return (
                <div key={room.id} className={`rd-room ${room.id === selectedId ? 'active' : ''}`} onClick={() => setSelectedId(room.id)}>
                  <div className="r-icon">{ICON_PC}</div>
                  <div className="r-body">
                    <div className="r-name">{room.name}</div>
                    <div className="r-sub">{issues ? `${issues} need attention` : "All working"}</div>
                  </div>
                  {s === 'down' && <Badge variant="destructive">✗ {issues} issue{issues > 1 ? 's' : ''}</Badge>}
                  {s === 'warn' && <Badge variant="warning">! {issues} issue{issues > 1 ? 's' : ''}</Badge>}
                  {s === 'ok' && <Badge variant="success">✓ OK</Badge>}
                </div>
              )
            })
          )}
        </div>
        
        <div className="rd-devices">
          {selectedRoom && (
            <>
              <div className="rd-dev-head">
                <div style={{ flex: 1 }}>
                  <div className="dh-title">{selectedRoom.name}</div>
                  <div className="dh-sub">
                    {(() => {
                      const issues = selectedRoom.devices.filter(d => d.status !== 'ok').length;
                      return issues ? `${issues} device${issues > 1 ? 's' : ''} need attention` : "Everything here is working";
                    })()}
                  </div>
                </div>
                {(() => {
                  const s = statusOf(selectedRoom);
                  const issues = selectedRoom.devices.filter(d => d.status !== 'ok').length;
                  if (s === 'down') return <Badge variant="destructive">✗ {issues} issue{issues > 1 ? 's' : ''}</Badge>;
                  if (s === 'warn') return <Badge variant="warning">! {issues} issue{issues > 1 ? 's' : ''}</Badge>;
                  return <Badge variant="success">✓ OK</Badge>;
                })()}
              </div>

              <div className="rd-dev-grid">
                {filteredDevices.length === 0 ? (
                  <div style={{ gridColumn: '1/3', padding: '30px', textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '14px' }}>
                    No devices match your search.
                  </div>
                ) : (
                  filteredDevices.map((d, idx) => (
                    <div key={`${d.name}-${idx}`} className={`rd-dev ${d.status === 'down' ? 'down' : d.status === 'warn' ? 'warn' : ''}`}>
                      <div className="rd-dev-top">
                        <div className="rd-dev-ic">{devIcon(d.type)}</div>
                        <div>
                          <div className="rd-dev-name">{d.name}</div>
                        </div>
                      </div>
                      
                      {d.host && (
                        <div className="rd-dev-tech hidden sm:block">
                          {d.host} · {d.ip}<br/>
                          {d.model} · last seen {d.seen}
                        </div>
                      )}
                      
                      <div className="rd-dev-foot">
                        {d.status === 'down' ? <Badge variant="destructive">✗ Broken</Badge> : d.status === 'warn' ? <Badge variant="warning">! Not responding</Badge> : <Badge variant="success">✓ Working</Badge>}
                        
                        {d.status === 'down' ? (
                          <Button size="sm" className="h-[38px] px-[14px]">Ask IT for help</Button>
                        ) : d.status === 'warn' ? (
                          <Button size="sm" variant="outline" className="h-[38px] px-[14px]" onClick={() => setShownReports(prev => ({ ...prev, [d.name]: !prev[d.name] }))}>
                            {shownReports[d.name] ? 'Hide report' : 'Show report'}
                          </Button>
                        ) : (
                          <span></span>
                        )}
                      </div>
                      
                      {d.report && (
                        <div className={`rd-dev-report ${shownReports[d.name] ? 'block' : 'hidden'}`}>
                          <div className="dr-title">Activity report</div>
                          {d.report}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
