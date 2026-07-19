import { useState } from 'react'
import { useStore } from '../../store'
import type { Appointment, AppointmentType } from '../../store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Save, CalendarPlus } from 'lucide-react'

const MOCK_STUDENTS = [
  { id: 's1', name: 'Alice Smith' },
  { id: 's2', name: 'Bob Jones' },
  { id: 's3', name: 'Charlie Brown' },
]

type AppointmentDraft = Omit<Appointment, 'id' | 'status' | 'createdAt'>

export function AppointmentManager() {
  const addAppointment = useStore((state) => state.addAppointment)
  const appointments = useStore((state) => state.appointments)
  const updateAppointmentStatus = useStore((state) => state.updateAppointmentStatus)
  
  const [draft, setDraft] = useState<AppointmentDraft>({
    studentId: '',
    studentName: '',
    title: '',
    date: '',
    type: 'appointment'
  })

  const handleSave = () => {
    if (!draft.studentId || !draft.title.trim() || !draft.date) {
      alert('Please fill out student, title, and date')
      return
    }

    const newAppointment: Appointment = {
      ...draft,
      id: crypto.randomUUID(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    }
    
    addAppointment(newAppointment)
    setDraft({ studentId: '', studentName: '', title: '', date: '', type: 'appointment' })
    alert('Appointment/Requirement created successfully!')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Create Appointment / Requirement</CardTitle>
          <CardDescription>Target a specific student for a meeting or required action.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={draft.type} 
              onValueChange={(v) => setDraft(prev => ({ ...prev, type: v as AppointmentType }))}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="requirement">Requirement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select 
              value={draft.studentId} 
              onValueChange={(v) => {
                const student = MOCK_STUDENTS.find(s => s.id === v)
                if (student) {
                  setDraft(prev => ({ ...prev, studentId: student.id, studentName: student.name }))
                }
              }}
            >
              <SelectTrigger id="student">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_STUDENTS.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={draft.title} 
              onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))} 
              placeholder="e.g. Guidance Counseling" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input 
              id="date" 
              type="datetime-local"
              value={draft.date} 
              onChange={(e) => setDraft(prev => ({ ...prev, date: e.target.value }))} 
            />
          </div>
        </CardContent>
        <CardFooter className="pt-6 border-t mt-auto">
          <Button className="w-full" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Create
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle>Active Appointments</CardTitle>
          <CardDescription>Track status of student appointments and requirements.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="text-sm text-muted-foreground italic p-4 border border-dashed rounded-lg text-center">
              No appointments created yet.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <Card key={appt.id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CalendarPlus className="w-4 h-4 text-muted-foreground" />
                        {appt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">Student: {appt.studentName}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded uppercase">
                          {appt.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(appt.date).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        {appt.status}
                      </span>
                    </div>
                  </div>
                  {appt.status === 'Reschedule Requested' && (
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button size="sm" onClick={() => updateAppointmentStatus(appt.id, 'Pending')}>
                        Re-open Slot
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateAppointmentStatus(appt.id, 'Cancelled')}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
