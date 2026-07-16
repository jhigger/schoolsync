import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const MOCK_EVENTS = [
  { id: 1, action: 'System rebooted', timestamp: '2026-07-17 00:00:00', user: 'System', status: 'info' },
  { id: 2, action: 'User logged in', timestamp: '2026-07-17 00:05:00', user: 'admin', status: 'success' },
  { id: 3, action: 'Threshold changed', timestamp: '2026-07-17 00:10:00', user: 'manager', status: 'warning' },
  { id: 4, action: 'Device offline', timestamp: '2026-07-17 00:15:00', user: 'System', status: 'error' },
]

export function ActivityComponent() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.action.toLowerCase().includes(search.toLowerCase()) || 
                          event.user.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || event.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">Monitor system events and user actions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={filter} onValueChange={(val) => setFilter(val || 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Timestamp</TableHead>
                  <TableHead className="hidden sm:table-cell">User/System</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">#{event.id}</TableCell>
                      <TableCell>{event.action}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {event.timestamp}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{event.user}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={event.status === 'error' ? 'destructive' : 'secondary'}
                          className={event.status === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
