import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchDepartmentAnnouncements } from '../lib/mockData'
import { PageContainer } from '../components/PageContainer'
import { Skeleton } from '../components/ui/skeleton'
import { enforceRoleAccess } from '../lib/auth'
import { useStore } from '../store'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { CalendarPlus } from 'lucide-react'

export const Route = createFileRoute('/_app/student-dashboard')({
  beforeLoad: () => enforceRoleAccess(['Student']),
  component: StudentDashboardComponent,
})

function StudentDashboardComponent() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['departmentAnnouncements'],
    queryFn: fetchDepartmentAnnouncements,
  })

  const appointments = useStore((state) => state.appointments)
  const updateAppointmentStatus = useStore((state) => state.updateAppointmentStatus)

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground">No appointments at this time.</p>
          ) : (
            appointments.map((appt) => (
              <Card key={appt.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CalendarPlus className="w-4 h-4 text-muted-foreground" />
                      {appt.title}
                    </CardTitle>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      {appt.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                      {appt.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(appt.date).toLocaleString()}
                    </span>
                  </div>
                  
                  {['Pending', "RSVP'd"].includes(appt.status) && (
                    <div className="flex gap-2 flex-wrap">
                      {appt.status !== "RSVP'd" && (
                        <Button 
                          size="sm" 
                          onClick={() => updateAppointmentStatus(appt.id, "RSVP'd")}
                        >
                          RSVP
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateAppointmentStatus(appt.id, 'Reschedule Requested')}
                      >
                        Request Reschedule
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => updateAppointmentStatus(appt.id, 'Cancelled')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Announcements</h2>
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
              </div>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  )
}
