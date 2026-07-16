import { useState, useMemo, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnDef,
} from '@tanstack/react-table'
import { Search, Download } from 'lucide-react'
import { fetchActivityLogData, type ActivityLogEvent } from '@/lib/mockData'
import { useStore } from '@/store'

export function ActivityComponent() {
  const [data, setData] = useState<ActivityLogEvent[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const viewMode = useStore((state) => state.viewMode)
  const isDetailed = viewMode === 'detailed'

  useEffect(() => {
    fetchActivityLogData().then(setData)
  }, [])

  const columns = useMemo<ColumnDef<ActivityLogEvent>[]>(
    () => [
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'text',
        header: 'Text',
      },
      {
        accessorKey: 'locationChip',
        header: 'Location',
      },
      {
        accessorKey: 'time',
        header: 'Time',
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
      },
      {
        accessorKey: 'techDetails',
        header: 'Tech Details',
      },
      {
        accessorKey: 'dayGroup',
        header: 'Day',
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const text = row.getValue<string>('text')?.toLowerCase() || ''
      const location = row.getValue<string>('locationChip')?.toLowerCase() || ''
      const search = filterValue.toLowerCase()
      return text.includes(search) || location.includes(search)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Apply category filter separately
  const filteredRows = table.getRowModel().rows.filter(row => {
    if (categoryFilter === 'all') return true
    return row.original.category === categoryFilter
  })

  // Group rows by dayGroup for rendering
  const groupedRows: Record<string, typeof filteredRows> = {}
  filteredRows.forEach(row => {
    const day = row.original.dayGroup
    if (!groupedRows[day]) groupedRows[day] = []
    groupedRows[day].push(row)
  })

  return (
    <div className="flex flex-col gap-[12px] h-full w-full">
      {/* Controls */}
      <div className="flex flex-wrap gap-[10px] items-center shrink-0">
        <div className="flex-1 flex items-center gap-[8px] h-[44px] bg-white dark:bg-card border border-border rounded-[10px] px-[12px] min-w-[200px]">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="Type to search… (example: Lab 1, printer, Maria)"
            className="border-none outline-none flex-1 text-[15px] bg-transparent text-foreground placeholder:text-muted-foreground"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        {isDetailed && (
          <>
            <select className="h-[44px] border border-border rounded-[10px] px-[12px] text-[14px] bg-white dark:bg-card text-foreground">
              <option value="">All rooms</option>
              <option>Lab 1</option>
              <option>Lab 2</option>
              <option>Lab 3</option>
              <option>Office</option>
              <option>Library</option>
            </select>
            <select className="h-[44px] border border-border rounded-[10px] px-[12px] text-[14px] bg-white dark:bg-card text-foreground">
              <option>All types</option>
              <option>Device</option>
              <option>Login</option>
              <option>Program</option>
              <option>USB</option>
            </select>
            <button className="inline-flex items-center justify-center gap-[8px] rounded-[calc(var(--radius)-2px)] text-[15px] font-semibold cursor-pointer transition-opacity hover:opacity-88 bg-background text-foreground border border-border shadow-[0_1px_2px_rgba(0,0,0,.04)] dark:bg-card h-[46px] px-[18px]">
              <Download className="w-[16px] h-[16px]" />
              Export CSV
            </button>
          </>
        )}
      </div>

      {/* Pills */}
      <div className="flex gap-[8px] shrink-0 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`h-[38px] px-[16px] rounded-full border text-[14px] font-semibold inline-flex items-center gap-[7px] whitespace-nowrap transition-colors ${
            categoryFilter === 'all'
              ? 'bg-primary text-primary-foreground border-primary dark:bg-[#39393e] dark:text-[#f5f5f5] dark:border-[#525257]'
              : 'bg-white text-[hsl(240,5%,30%)] border-border dark:bg-card dark:text-foreground hover:opacity-88'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setCategoryFilter('fix')}
          className={`h-[38px] px-[16px] rounded-full border text-[14px] font-semibold inline-flex items-center gap-[7px] whitespace-nowrap transition-colors ${
            categoryFilter === 'fix'
              ? 'bg-primary text-primary-foreground border-primary dark:bg-[#39393e] dark:text-[#f5f5f5] dark:border-[#525257]'
              : 'bg-white text-[hsl(240,5%,30%)] border-border dark:bg-card dark:text-foreground hover:opacity-88'
          }`}
        >
          <span className="w-[9px] h-[9px] rounded-full bg-[hsl(var(--destructive))]"></span> Needs fixing
        </button>
        <button
          onClick={() => setCategoryFilter('look')}
          className={`h-[38px] px-[16px] rounded-full border text-[14px] font-semibold inline-flex items-center gap-[7px] whitespace-nowrap transition-colors ${
            categoryFilter === 'look'
              ? 'bg-primary text-primary-foreground border-primary dark:bg-[#39393e] dark:text-[#f5f5f5] dark:border-[#525257]'
              : 'bg-white text-[hsl(240,5%,30%)] border-border dark:bg-card dark:text-foreground hover:opacity-88'
          }`}
        >
          <span className="w-[9px] h-[9px] rounded-full bg-[hsl(35,92%,50%)]"></span> Worth a look
        </button>
        <button
          onClick={() => setCategoryFilter('normal')}
          className={`h-[38px] px-[16px] rounded-full border text-[14px] font-semibold inline-flex items-center gap-[7px] whitespace-nowrap transition-colors ${
            categoryFilter === 'normal'
              ? 'bg-primary text-primary-foreground border-primary dark:bg-[#39393e] dark:text-[#f5f5f5] dark:border-[#525257]'
              : 'bg-white text-[hsl(240,5%,30%)] border-border dark:bg-card dark:text-foreground hover:opacity-88'
          }`}
        >
          <span className="w-[9px] h-[9px] rounded-full bg-[hsl(var(--success))]"></span> Normal
        </button>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-card border border-border rounded-[var(--radius)] px-[16px] pb-[16px]">
        {Object.entries(groupedRows).length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[8px] py-[60px] px-[20px] text-muted-foreground text-center">
            <Search className="w-[34px] h-[34px] stroke-[1.6px]" />
            <div className="text-[16px] font-bold text-foreground">Nothing matches your search</div>
            <div>Try a different word, or tap “All” to see everything.</div>
          </div>
        ) : (
          Object.entries(groupedRows).map(([day, rows]) => (
            <div key={day} className="day-group">
              <div className="sticky top-0 bg-white dark:bg-card px-[2px] pt-[12px] pb-[8px] text-[13px] font-bold text-muted-foreground tracking-[.02em] uppercase z-10 border-b border-border">
                {day}
              </div>
              {rows.map((row, index) => {
                const event = row.original
                return (
                  <div key={event.id}>
                    <div className="flex gap-[12px] py-[12px] px-[2px] items-start">
                      <div
                        className={`w-[11px] h-[11px] rounded-full mt-[5px] shrink-0 ${
                          event.category === 'fix'
                            ? 'bg-[hsl(var(--destructive))]'
                            : event.category === 'look'
                            ? 'bg-[hsl(35,92%,50%)]'
                            : 'bg-[hsl(var(--success))]'
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14.5px] leading-[1.45] text-foreground">
                          {event.text}
                        </div>
                        <div className="flex gap-[8px] items-center mt-[5px] flex-wrap">
                          <span className="inline-flex items-center gap-[5px] text-[12.5px] font-semibold text-foreground bg-muted border border-border rounded-[7px] px-[8px] py-[3px]">
                            {event.locationChip}
                          </span>
                          <span className="text-[12.5px] text-muted-foreground">
                            {event.time}
                          </span>
                          {isDetailed && (
                            <span
                              className={`inline-flex items-center gap-[5px] rounded-full px-[11px] py-[4px] text-[13px] font-semibold leading-none border border-transparent ${
                                event.severity === 'High'
                                  ? 'bg-[hsl(0,72%,96%)] text-[hsl(var(--destructive))] border-[hsl(0,72%,88%)] dark:bg-[hsl(0,46%,18%)] dark:text-[hsl(0,85%,78%)] dark:border-[hsl(0,42%,32%)]'
                                  : event.severity === 'Medium'
                                  ? 'bg-[hsl(35,92%,95%)] text-[hsl(var(--warning))] border-[hsl(35,92%,82%)] dark:bg-[hsl(35,46%,16%)] dark:text-[hsl(35,88%,70%)] dark:border-[hsl(35,42%,30%)]'
                                  : 'bg-[hsl(142,71%,95%)] text-[hsl(var(--success))] border-[hsl(142,71%,85%)] dark:bg-[hsl(142,38%,16%)] dark:text-[hsl(142,62%,70%)] dark:border-[hsl(142,32%,30%)]'
                              }`}
                            >
                              {event.severity}
                            </span>
                          )}
                        </div>
                        {isDetailed && event.techDetails && (
                          <div className="text-[12px] text-muted-foreground font-mono mt-[4px]">
                            {event.techDetails}
                          </div>
                        )}
                      </div>
                    </div>
                    {index < rows.length - 1 && (
                      <div className="h-[1px] bg-border w-full"></div>
                    )}
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
