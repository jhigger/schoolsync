import { useState, useMemo } from 'react'
import { useStore } from '../../store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'

export function SearchPasses() {
  const logbooks = useStore((state) => state.logbooks)
  const logbookEntries = useStore((state) => state.logbookEntries)
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    
    // Filter to only include active entries from logbooks with "temporary pass" in the title
    const activePasses = logbookEntries.map(entry => {
      const logbook = logbooks.find(l => l.id === entry.logbookId)
      return { entry, logbook }
    }).filter(({ entry, logbook }) => {
      if (!logbook) return false
      
      // Spec: Must specifically be a Temporary Pass
      if (!logbook.title.toLowerCase().includes('temporary pass')) return false
      
      // Spec: Must be "active" (e.g. created within the last 24 hours)
      const entryDate = new Date(entry.createdAt)
      const now = new Date()
      const hoursSinceCreation = (now.getTime() - entryDate.getTime()) / (1000 * 60 * 60)
      if (hoursSinceCreation > 24) return false

      return Object.values(entry.data).some(val => val.toLowerCase().includes(query))
    })
    
    return activePasses
  }, [searchQuery, logbookEntries, logbooks])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search Passes
        </CardTitle>
        <CardDescription>Search for active temporary passes by student name or other details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search active passes..." 
            className="pl-9 max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {searchQuery.trim() && (
          <div className="mt-4 space-y-4">
            {searchResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active temporary passes found matching your search.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map(({ entry, logbook }) => (
                  <Card key={entry.id} className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{logbook?.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {new Date(entry.createdAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      {logbook?.fields.map(field => (
                        <div key={field.id} className="flex flex-col">
                          <span className="text-xs text-muted-foreground">{field.label}</span>
                          <span className="font-medium">{entry.data[field.id] || 'N/A'}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
