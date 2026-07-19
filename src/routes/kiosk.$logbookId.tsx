import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useStore } from '../store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button, buttonVariants } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Lock, LogOut } from 'lucide-react'

export const Route = createFileRoute('/kiosk/$logbookId')({
  component: KioskLogbookComponent,
})

function KioskLogbookComponent() {
  const { logbookId } = Route.useParams()
  const navigate = useNavigate()
  const logbooks = useStore((state) => state.logbooks)
  const validateKioskPin = useStore((state) => state.validateKioskPin)
  const addLogbookEntry = useStore((state) => state.addLogbookEntry)
  const logbook = logbooks.find(l => l.id === logbookId)

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showExitModal, setShowExitModal] = useState(false)
  const [exitPin, setExitPin] = useState('')
  const [pinError, setPinError] = useState(false)

  if (!logbook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Logbook Not Found</CardTitle>
            <CardDescription>The requested logbook configuration does not exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/" className={buttonVariants({ className: "w-full" })}>Go Home</Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!logbook) return
    
    addLogbookEntry({
      id: crypto.randomUUID(),
      logbookId: logbook.id,
      data: formData,
      createdAt: new Date().toISOString()
    })
    
    alert('Entry submitted successfully!')
    setFormData({})
  }

  const handleExitAttempt = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateKioskPin(logbook.id, exitPin)) {
      navigate({ to: '/staff-dashboard' })
    } else {
      setPinError(true)
      setExitPin('')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        onClick={() => setShowExitModal(true)}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Exit Kiosk
      </Button>

      <Card className="w-full max-w-2xl shadow-lg border-primary/20">
        <CardHeader className="text-center pb-8 border-b">
          <CardTitle className="text-3xl font-bold tracking-tight">{logbook.title}</CardTitle>
          {logbook.description && (
            <CardDescription className="text-lg mt-2">{logbook.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-8">
          <form id="logbook-form" onSubmit={handleSubmit} className="space-y-6">
            {logbook.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-base">
                  {field.label} {field.required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id={field.id}
                  type={field.type === 'date' ? 'datetime-local' : field.type === 'number' ? 'number' : 'text'}
                  required={field.required}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
            ))}
          </form>
        </CardContent>
        <CardFooter className="pt-6 border-t bg-muted/10 rounded-b-lg">
          <Button type="submit" form="logbook-form" className="w-full h-14 text-lg">
            Submit Entry
          </Button>
        </CardFooter>
      </Card>

      {showExitModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Exit Kiosk Mode
              </CardTitle>
              <CardDescription>
                Enter the staff PIN to exit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="exit-form" onSubmit={handleExitAttempt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">PIN Code</Label>
                  <Input
                    id="pin"
                    type="password"
                    autoFocus
                    value={exitPin}
                    onChange={(e) => {
                      setExitPin(e.target.value)
                      setPinError(false)
                    }}
                    className={pinError ? 'border-destructive' : ''}
                  />
                  {pinError && <p className="text-sm text-destructive font-medium">Incorrect PIN</p>}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => {
                setShowExitModal(false)
                setExitPin('')
                setPinError(false)
              }}>
                Cancel
              </Button>
              <Button type="submit" form="exit-form" variant="destructive">
                Exit
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
