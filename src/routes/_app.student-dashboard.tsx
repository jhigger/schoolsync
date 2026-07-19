import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchDepartmentAnnouncements } from '../lib/mockData'
import { PageContainer } from '../components/PageContainer'
import { Skeleton } from '../components/ui/skeleton'
import { getStoredAuthRole } from '../store'

export const Route = createFileRoute('/_app/student-dashboard')({
  beforeLoad: () => {
    if (getStoredAuthRole() !== 'Student') {
      throw redirect({ to: '/' })
    }
  },
  component: StudentDashboardComponent,
})

function StudentDashboardComponent() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['departmentAnnouncements'],
    queryFn: fetchDepartmentAnnouncements,
  })

  if (isLoading || !announcements) {
    return (
      <PageContainer className="gap-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="gap-6 pb-8">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <div className="flex flex-col gap-4">
        {announcements.length === 0 ? (
          <p className="text-muted-foreground">No announcements at this time.</p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground">{announcement.department}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{announcement.date}</span>
              </div>
              <p className="text-sm mt-2 text-foreground/90">{announcement.content}</p>
              {announcement.isImportant && (
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full border border-destructive/20 px-2.5 py-0.5 text-xs font-semibold bg-destructive/10 text-destructive">
                    Important
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PageContainer>
  )
}
