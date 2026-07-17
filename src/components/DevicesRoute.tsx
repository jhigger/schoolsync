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

const DEVICE_ICONS: Record<string, any> = {
  printer: ICON_PRN,
  other: ICON_OTHER,
  pc: ICON_PC,
}

function getDeviceIcon(type: string) {
  return DEVICE_ICONS[type] || ICON_PC
}

function getRoomStatus(room: Room) {
  if (room.devices.some(d => d.status === "down")) return "down"
  if (room.devices.some(d => d.status === "warn")) return "warn"
  return "ok"
}

function getBadgeForStatus(status: string, issueCount: number = 0) {
  if (status === 'down') {
    return <Badge variant="destructive">✗ {issueCount} issue{issueCount !== 1 ? 's' : ''}</Badge>
  }
  if (status === 'warn') {
    return <Badge variant="warning">! {issueCount} issue{issueCount !== 1 ? 's' : ''}</Badge>
  }
  return <Badge variant="success">✓ OK</Badge>
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
      const roomStatus = getRoomStatus(room)
      const passesFilter = activeFilter === "all" || (activeFilter === "problems" && roomStatus !== "ok")
      const passesSearch = !query || 
                           room.name.toLowerCase().includes(query) || 
                           room.devices.some(d => d.name.toLowerCase().includes(query))
      return passesFilter && passesSearch
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
    let total = 0
    let working = 0
    let attention = 0
    
    rooms.forEach(room => {
      room.devices.forEach(device => {
        total++
        if (device.status === 'ok') {
          working++
        } else {
          attention++
        }
      })
    })
    
    return { totalDevices: total, workingCount: working, attentionCount: attention }
  }, [rooms])

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-3 p-4 sm:p-[18px_22px] max-w-full w-full animate-pulse">
        <div className="flex gap-[10px] shrink-0 max-[900px]:flex-col">
          <Skeleton className="h-[74px] w-[140px] rounded-[10px]" />
          <Skeleton className="h-[74px] w-[140px] rounded-[10px]" />
          <Skeleton className="h-[74px] w-[140px] rounded-[10px]" />
        </div>
        <div className="flex gap-[10px] items-center shrink-0 mt-2">
          <Skeleton className="h-[42px] w-full max-w-sm rounded-[10px]" />
          <Skeleton className="h-[42px] w-[100px] rounded-full" />
          <Skeleton className="h-[42px] w-[120px] rounded-full" />
        </div>
        <div className="flex-1 flex gap-[14px] min-h-0 overflow-hidden max-[900px]:flex-col max-[900px]:overflow-visible max-[900px]:min-h-auto mt-2">
          <Skeleton className="w-[288px] bg-muted border border-border rounded-lg overflow-y-auto shrink-0 p-2 max-[900px]:w-full max-[900px]:flex max-[900px]:overflow-x-auto max-[900px]:border-b max-[900px]:gap-2 max-[900px]:scrollbar-none" />
          <Skeleton className="flex-1 bg-muted border border-border rounded-lg flex flex-col min-w-0 overflow-hidden" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-3 p-4 sm:p-[18px_22px] max-w-full w-full">
      <div className="flex gap-[10px] shrink-0 max-[900px]:flex-col">
        <div className="flex items-center gap-[9px] bg-card border border-border rounded-[10px] py-[10px] px-[14px]">
          <span className="text-[20px] font-extrabold tracking-tight">{totalDevices}</span>
          <span className="text-[12.5px] text-muted-foreground">Devices<br/>in total</span>
        </div>
        <div className="flex items-center gap-[9px] bg-card border border-border rounded-[10px] py-[10px] px-[14px]">
          <span className="text-[20px] font-extrabold tracking-tight">{workingCount}</span>
          <span className="text-[12.5px] text-muted-foreground">Working<br/>normally</span>
        </div>
        <div className="flex items-center gap-[9px] bg-card border border-border rounded-[10px] py-[10px] px-[14px]">
          <span className="text-[20px] font-extrabold tracking-tight text-destructive">{attentionCount}</span>
          <span className="text-[12.5px] text-muted-foreground">Need<br/>attention</span>
        </div>
        <div className="flex-1"></div>
        <Button variant="outline" size="sm" className="self-center hidden sm:flex h-[38px] px-[14px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>
          Export list
        </Button>
      </div>

      <div className="flex gap-[10px] items-center shrink-0">
        <div className="flex-1 flex items-center gap-2 h-[42px] bg-card border border-border rounded-[10px] px-3">
          <svg className="text-muted-foreground" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            className="border-none outline-none flex-1 text-[15px] bg-transparent text-foreground placeholder:text-muted-foreground"
            placeholder="Search a room or device… (example: Lab 1, printer, PC 12)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`h-[42px] px-4 rounded-full border border-border text-[14px] font-semibold transition-colors duration-200 cursor-pointer ${activeFilter === 'all' ? 'bg-primary text-primary-foreground border-primary hover:bg-primary' : 'bg-card text-muted-foreground hover:bg-muted'}`} 
            onClick={() => setActiveFilter('all')}
          >
            All rooms
          </button>
          <button 
            className={`h-[42px] px-4 rounded-full border border-border text-[14px] font-semibold transition-colors duration-200 cursor-pointer ${activeFilter === 'problems' ? 'bg-primary text-primary-foreground border-primary hover:bg-primary' : 'bg-card text-muted-foreground hover:bg-muted'}`} 
            onClick={() => setActiveFilter('problems')}
          >
            Has problems
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-[14px] min-h-0 overflow-hidden max-[900px]:flex-col max-[900px]:overflow-visible max-[900px]:min-h-auto">
        <div className="w-[288px] bg-card border border-border rounded-lg overflow-y-auto shrink-0 p-2 max-[900px]:w-full max-[900px]:flex max-[900px]:overflow-x-auto max-[900px]:border-b max-[900px]:gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredRooms.length === 0 ? (
            <div className="py-[30px] px-4 text-center text-muted-foreground text-[14px]">
              No rooms match.
            </div>
          ) : (
            filteredRooms.map(room => {
              const roomStatus = getRoomStatus(room)
              const issueCount = room.devices.filter(d => d.status !== 'ok').length
              return (
                <div 
                  key={room.id} 
                  className={`flex items-center gap-[10px] py-[13px] px-[12px] rounded-[9px] cursor-pointer transition-colors duration-100 hover:bg-muted max-[900px]:py-[10px] max-[900px]:px-[14px] max-[900px]:whitespace-nowrap ${room.id === selectedId ? 'bg-accent outline outline-[1.5px] outline-primary' : ''}`} 
                  onClick={() => setSelectedId(room.id)}
                >
                  <div className="w-[34px] h-[34px] rounded-lg bg-muted flex items-center justify-center text-muted-foreground max-[900px]:w-[28px] max-[900px]:h-[28px] shrink-0">
                    {ICON_PC}
                  </div>
                  <div className="flex-1 min-w-0 max-[900px]:hidden">
                    <div className="text-[14.5px] font-bold text-foreground">{room.name}</div>
                    <div className="text-[12.5px] text-muted-foreground mt-[1px]">{issueCount ? `${issueCount} need attention` : "All working"}</div>
                  </div>
                  {getBadgeForStatus(roomStatus, issueCount)}
                </div>
              )
            })
          )}
        </div>
        
        <div className="flex-1 bg-card border border-border rounded-lg flex flex-col min-w-0 overflow-hidden">
          {selectedRoom && (
            <>
              <div className="flex items-center gap-3 py-4 px-[18px] border-b border-border shrink-0">
                <div className="flex-1">
                  <div className="text-[16px] font-bold text-foreground">{selectedRoom.name}</div>
                  <div className="text-[12.5px] text-muted-foreground mt-[2px]">
                    {(() => {
                      const issueCount = selectedRoom.devices.filter(d => d.status !== 'ok').length
                      return issueCount ? `${issueCount} device${issueCount !== 1 ? 's' : ''} need attention` : "Everything here is working"
                    })()}
                  </div>
                </div>
                {getBadgeForStatus(getRoomStatus(selectedRoom), selectedRoom.devices.filter(d => d.status !== 'ok').length)}
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-[18px] grid grid-cols-1 xl:grid-cols-2 gap-3 content-start">
                {filteredDevices.length === 0 ? (
                  <div className="col-span-1 xl:col-span-2 p-[30px] text-center text-muted-foreground text-[14px]">
                    No devices match your search.
                  </div>
                ) : (
                  filteredDevices.map((device, idx) => (
                    <div 
                      key={`${device.name}-${idx}`} 
                      className={`border border-border rounded-[calc(var(--radius)-2px)] p-[14px] flex flex-col gap-2 bg-card ${device.status === 'down' ? 'border-l-4 border-l-destructive bg-destructive/5' : device.status === 'warn' ? 'border-l-4 border-l-warning bg-warning/5' : ''}`}
                    >
                      <div className="flex items-center gap-[10px]">
                        <div className={`w-[32px] h-[32px] rounded-lg flex items-center justify-center ${device.status === 'down' ? 'bg-destructive/10 text-destructive' : device.status === 'warn' ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}`}>
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="text-[14.5px] font-bold text-foreground">{device.name}</div>
                        </div>
                      </div>
                      
                      {device.host && (
                        <div className="text-[11.5px] text-muted-foreground font-mono leading-relaxed hidden sm:block">
                          {device.host} · {device.ip}<br/>
                          {device.model} · last seen {device.seen}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        {device.status === 'down' ? <Badge variant="destructive">✗ Broken</Badge> : device.status === 'warn' ? <Badge variant="warning">! Not responding</Badge> : <Badge variant="success">✓ Working</Badge>}
                        
                        {device.status === 'down' ? (
                          <Button size="sm" className="h-[38px] px-[14px]">Ask IT for help</Button>
                        ) : device.status === 'warn' ? (
                          <Button size="sm" variant="outline" className="h-[38px] px-[14px]" onClick={() => setShownReports(prev => ({ ...prev, [device.name]: !prev[device.name] }))}>
                            {shownReports[device.name] ? 'Hide report' : 'Show report'}
                          </Button>
                        ) : (
                          <span></span>
                        )}
                      </div>
                      
                      {device.report && (
                        <div className={`text-[12.5px] text-foreground leading-relaxed bg-muted rounded-lg py-[10px] px-3 mt-[2px] ${shownReports[device.name] ? 'block' : 'hidden'}`}>
                          <div className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Activity report</div>
                          {device.report}
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
