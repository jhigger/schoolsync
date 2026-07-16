import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

export const Route = createFileRoute('/_app/alerts')({
  component: AlertsComponent,
})

function AlertsComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Alerts</h2>
        <p className="text-muted-foreground">
          Monitor active issues and configure your alert thresholds.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Alerts</h3>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>High CPU Usage</AlertTitle>
            <AlertDescription>
              Server Alpha is experiencing CPU usage above 90% for the last 5 minutes.
            </AlertDescription>
          </Alert>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Maintenance Scheduled</AlertTitle>
            <AlertDescription>
              Database optimization scheduled for tonight at 2:00 AM UTC.
            </AlertDescription>
          </Alert>
          <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
            <AlertTitle>System Healthy</AlertTitle>
            <AlertDescription>
              All monitoring services are reporting normal status.
            </AlertDescription>
          </Alert>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Threshold Configuration</CardTitle>
            <CardDescription>
              Configure when system alerts should be triggered.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-alerts" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">Receive critical alerts via email.</span>
              </Label>
              <Switch id="email-alerts" defaultChecked />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="cpu-threshold">CPU Usage Threshold (%)</Label>
              <Input id="cpu-threshold" type="number" defaultValue={85} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="memory-threshold">Memory Usage Threshold (%)</Label>
              <Input id="memory-threshold" type="number" defaultValue={90} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-resolve" className="flex flex-col space-y-1">
                <span>Auto-resolve Alerts</span>
                <span className="font-normal text-sm text-muted-foreground">Automatically close alerts when metrics return to normal.</span>
              </Label>
              <Switch id="auto-resolve" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
