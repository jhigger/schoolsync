import { useMemo, useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type Row,
  flexRender,
} from '@tanstack/react-table'
import { Search, Download } from 'lucide-react'
import { fetchActivityLogData, type ActivityLogEvent } from '@/lib/mockData'
import { useStore } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { PageContainer } from '@/components/PageContainer'

const CATEGORY_STYLES: Record<string, string> = {
  fix: 'bg-destructive',
  look: 'bg-[hsl(35,92%,50%)]',
  normal: 'bg-[hsl(var(--success))]',
}

const SEVERITY_STYLES: Record<string, string> = {
  High: 'bg-[hsl(0,72%,96%)] text-destructive border-[hsl(0,72%,88%)] dark:bg-[hsl(0,46%,18%)] dark:text-destructive dark:border-[hsl(0,42%,32%)]',
  Medium: 'bg-[hsl(35,92%,95%)] text-[hsl(var(--warning))] border-[hsl(35,92%,82%)] dark:bg-[hsl(35,46%,16%)] dark:text-[hsl(35,88%,70%)] dark:border-[hsl(35,42%,30%)]',
  Info: 'bg-[hsl(142,71%,95%)] text-[hsl(var(--success))] border-[hsl(142,71%,85%)] dark:bg-[hsl(142,38%,16%)] dark:text-[hsl(142,62%,70%)] dark:border-[hsl(142,32%,30%)]',
}

type FilterState = 'All' | 'fix' | 'look' | 'normal'

function useActivityLog(data: ActivityLogEvent[]) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterState>('All')
  const [visibleDays, setVisibleDays] = useState(1)

  useEffect(() => {
    setVisibleDays(1)
  }, [search, filter])

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = search === '' || 
        item.text.toLowerCase().includes(search.toLowerCase()) || 
        item.locationChip.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || item.category === filter;
      return matchesSearch && matchesFilter;
    })
  }, [data, search, filter])

  return {
    search,
    setSearch,
    filter,
    setFilter,
    visibleDays,
    setVisibleDays,
    filteredData
  }
}

export function ActivityComponent() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['activityLogData'],
    queryFn: fetchActivityLogData,
  })
  const viewMode = useStore((state) => state.viewMode)
  const isDetailed = viewMode === 'detailed'

  const { search, setSearch, filter, setFilter, visibleDays, setVisibleDays, filteredData } = useActivityLog(data)

  const columns = useMemo<ColumnDef<ActivityLogEvent>[]>(
    () => [
      {
        id: 'category',
        accessorKey: 'category',
        cell: (info) => (
          <div className={`w-[11px] h-[11px] rounded-full mt-[5px] shrink-0 ${CATEGORY_STYLES[info.getValue() as string] || CATEGORY_STYLES.normal}`} />
        ),
      },
      {
        id: 'text',
        accessorKey: 'text',
        cell: (info) => (
          <div className="text-[14.5px] leading-[1.45] text-foreground">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        id: 'locationChip',
        accessorKey: 'locationChip',
        cell: (info) => (
          <span className="inline-flex items-center gap-[5px] text-[12.5px] font-semibold text-foreground bg-muted border border-border rounded-[7px] px-[8px] py-[3px]">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: 'time',
        accessorKey: 'time',
        cell: (info) => (
          <span className="text-[12.5px] text-muted-foreground">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        id: 'severity',
        accessorKey: 'severity',
        cell: (info) => {
          const val = info.getValue() as string
          return (
            <span className={`inline-flex items-center gap-[5px] rounded-full px-[11px] py-[4px] text-[13px] font-semibold leading-none border border-transparent ${SEVERITY_STYLES[val] || SEVERITY_STYLES.Info}`}>
              {val === 'High' && <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />}
              {val}
            </span>
          )
        },
      },
      {
        id: 'techDetails',
        accessorKey: 'techDetails',
        cell: (info) => (
          <div className="text-[12px] text-muted-foreground font-mono mt-[4px]">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        id: 'dayGroup',
        accessorKey: 'dayGroup',
      },
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnVisibility: {
        severity: isDetailed,
        techDetails: isDetailed,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  })

  // Group rows by dayGroup for rendering
  const groupedRows: Record<string, Row<ActivityLogEvent>[]> = {}
  table.getRowModel().rows.forEach(row => {
    const day = row.original.dayGroup
    if (!groupedRows[day]) groupedRows[day] = []
    groupedRows[day].push(row)
  })

  const allDays = Object.keys(groupedRows)
  const visibleDayKeys = allDays.slice(0, visibleDays)

  // Helper for filter pills
  const FilterButton = ({ label, iconClass, active, onClick }: { label: string; iconClass?: string; active?: boolean; onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={`h-[38px] px-[16px] rounded-full border text-[14px] font-semibold inline-flex items-center gap-[7px] whitespace-nowrap transition-colors ${
        active
          ? 'bg-primary text-primary-foreground border-primary dark:bg-[#39393e] dark:text-[#f5f5f5] dark:border-[#525257]'
          : 'bg-white text-[hsl(240,5%,30%)] border-border dark:bg-card dark:text-foreground hover:opacity-88'
      }`}
    >
      {iconClass && <span className={`w-[9px] h-[9px] rounded-full ${iconClass}`}></span>}
      {label}
    </button>
  )

  return (
    <PageContainer>
      {/* Controls */}
      <div className="flex flex-wrap gap-[10px] items-center shrink-0">
        <div className="flex-1 flex items-center gap-[8px] h-[44px] bg-white dark:bg-card border border-border rounded-[10px] px-[12px] min-w-[200px]">
          <Search className="w-[18px] h-[18px] text-muted-foreground" />
          <input
            type="text"
            placeholder="Type to search… (example: Lab 1, printer, Maria)"
            className="border-none outline-none flex-1 text-[15px] bg-transparent text-foreground placeholder:text-muted-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <FilterButton label="All" active={filter === 'All'} onClick={() => setFilter('All')} />
        <FilterButton label="Needs fixing" iconClass="bg-destructive" active={filter === 'fix'} onClick={() => setFilter('fix')} />
        <FilterButton label="Worth a look" iconClass="bg-[hsl(35,92%,50%)]" active={filter === 'look'} onClick={() => setFilter('look')} />
        <FilterButton label="Normal" iconClass="bg-[hsl(var(--success))]" active={filter === 'normal'} onClick={() => setFilter('normal')} />
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-card border border-border rounded-[var(--radius)] px-[16px] pb-[16px]">
        {isLoading ? (
          <div className="flex flex-col gap-[16px] pt-[16px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[60px] w-full rounded-md" />
            ))}
          </div>
        ) : Object.entries(groupedRows).length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[8px] py-[60px] px-[20px] text-muted-foreground text-center">
            <Search className="w-[34px] h-[34px] stroke-[1.6px]" />
            <div className="text-[16px] font-bold text-foreground">Nothing to display</div>
          </div>
        ) : (
          <>
            {visibleDayKeys.map((day) => {
              const rows = groupedRows[day]
              return (
                <div key={day} className="day-group">
                  <div className="sticky top-0 bg-white dark:bg-card px-[2px] pt-[12px] pb-[8px] text-[13px] font-bold text-muted-foreground tracking-[.02em] uppercase z-10 border-b border-border">
                    {day}
                  </div>
                  {rows.map((row, index) => {
                    const getCellNode = (id: string) => {
                      const cell = row.getVisibleCells().find(c => c.column.id === id)
                      return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null
                    }

                    return (
                      <div key={row.original.id}>
                        <div className="flex gap-[12px] py-[12px] px-[2px] items-start">
                          {getCellNode('category')}
                          <div className="flex-1 min-w-0">
                            {getCellNode('text')}
                            <div className="flex gap-[8px] items-center mt-[5px] flex-wrap">
                              {getCellNode('locationChip')}
                              {getCellNode('time')}
                              {getCellNode('severity')}
                            </div>
                            {getCellNode('techDetails')}
                          </div>
                        </div>
                        {index < rows.length - 1 && (
                          <div className="h-[1px] bg-border w-full"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
            {visibleDays < allDays.length && (
              <div className="flex justify-center py-[20px]">
                <button
                  onClick={() => setVisibleDays(prev => prev + 3)}
                  className="h-[38px] px-[16px] rounded-full border border-border text-[14px] font-semibold transition-colors bg-muted text-foreground hover:bg-muted/80"
                >
                  Load earlier days
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  )
}
