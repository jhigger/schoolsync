import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { usePreferences } from '../lib/preferences'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsComponent,
})

function SettingRow({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

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
            <SettingRow 
              title="Dark Mode" 
              description="Quickly toggle dark mode on or off."
            >
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </SettingRow>
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
            <SettingRow 
              title="Detailed View" 
              description="Show detailed information across the dashboard."
            >
              <Switch
                checked={viewMode === 'detailed'}
                onCheckedChange={(checked) => setViewMode(checked ? 'detailed' : 'simple')}
              />
            </SettingRow>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
