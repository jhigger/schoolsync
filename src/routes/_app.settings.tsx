import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { usePreferences, type Theme } from '../lib/preferences'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  const { theme, setTheme, viewMode, setViewMode } = usePreferences()

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme.
                </p>
              </div>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">System Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode Toggle</Label>
                <p className="text-sm text-muted-foreground">
                  Quickly toggle dark mode on or off.
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Mode</CardTitle>
            <CardDescription>
              Choose how much detail you want to see in the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Detailed View</Label>
                <p className="text-sm text-muted-foreground">
                  Show detailed information across the dashboard.
                </p>
              </div>
              <Switch
                checked={viewMode === 'detailed'}
                onCheckedChange={(checked) => setViewMode(checked ? 'detailed' : 'simple')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
