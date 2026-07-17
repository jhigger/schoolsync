import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PageContainer } from '../components/PageContainer'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { usePreferences, type Theme, type TextSize, type Language } from '../lib/preferences'
import { useStore } from '../store'
import { APP_TITLE } from '../lib/constants'
import { ROLE_PROFILES } from '../components/Sidebar'
export const Route = createFileRoute('/_app/settings')({
  component: SettingsComponent,
})

function SettingRow({ title, description, children, className = '' }: { title: string, description: string, children?: React.ReactNode, className?: string }) {
  return (
    <div className={`flex items-center gap-3.5 py-3.5 border-t border-border first:border-t-0 ${className}`}>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold">{title}</div>
        <div className="text-[13px] text-muted-foreground mt-0.5">{description}</div>
      </div>
      {children}
    </div>
  )
}

function SettingsCard({ title, children, isCollapsible = false }: { title: string, children: React.ReactNode, isCollapsible?: boolean }) {
  const content = (
    <>
      {isCollapsible ? (
        <summary className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-3.5 pb-1 list-none cursor-pointer flex items-center gap-2 [&::-webkit-details-marker]:hidden after:content-['Show'] after:ml-auto after:text-xs after:font-bold after:text-primary after:normal-case after:tracking-normal group-open:after:content-['Hide']">
          {title}
        </summary>
      ) : (
        <div className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-3.5 pb-1">
          {title}
        </div>
      )}
      <div className={isCollapsible ? "mt-1" : ""}>
        {children}
      </div>
    </>
  )

  const className = "bg-card border border-border rounded-lg px-4 py-1.5 shadow-none"

  if (isCollapsible) {
    return <details className={`${className} group`}>{content}</details>
  }
  return <div className={className}>{content}</div>
}

function SettingsComponent() {
  const { 
    theme, setTheme, 
    textSize, setTextSize,
    language, setLanguage,
    emailSummary, setEmailSummary,
    playSound, setPlaySound,
    autoRefresh, setAutoRefresh 
  } = usePreferences()
  const authRole = useStore(state => state.authRole)
  const profile = authRole && ROLE_PROFILES[authRole] 
    ? { ...ROLE_PROFILES[authRole], title: `${ROLE_PROFILES[authRole].title} · ${ROLE_PROFILES[authRole].email}` }
    : { name: 'User', title: 'Guest', initial: 'U' }
  
  const navigate = useNavigate()

  return (
    <PageContainer className="overflow-y-auto">
      {/* Account */}
      <SettingsCard title="Your account">
        <div className="flex items-center gap-3.5 py-4 border-t border-border first:border-t-0">
          <div className="w-14 h-14 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold shrink-0">{profile.initial}</div>
          <div className="flex-1">
            <div className="text-[17px] font-bold">{profile.name}</div>
            <div className="text-[13.5px] text-muted-foreground mt-0.5">{profile.title}</div>
          </div>
          <Button variant="outline" size="sm" className="h-8 hidden sm:flex">Change password</Button>
          <Button variant="destructive" size="sm" className="h-8">Sign out</Button>
        </div>
      </SettingsCard>

      {/* Display */}
      <SettingsCard title="Display">
        <SettingRow title="Text size" description="Make words bigger or smaller across the app.">
          <div className="flex bg-muted rounded-lg p-1 gap-0.5">
            {(['Small', 'Medium', 'Large'] as TextSize[]).map(size => (
              <button 
                key={size}
                className={`border-none font-semibold py-2 px-3.5 rounded-md cursor-pointer transition-all
                  ${size === 'Small' ? 'text-xs' : size === 'Medium' ? 'text-sm' : 'text-base'}
                  ${textSize === size ? 'bg-background text-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setTextSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow title="Appearance" description="Light is easiest to read in bright rooms.">
          <div className="flex bg-muted rounded-lg p-1 gap-0.5">
            {(['light', 'dark', 'auto'] as Theme[]).map(t => (
              <button 
                key={t}
                className={`border-none text-sm font-semibold py-2 px-3.5 rounded-md cursor-pointer transition-all capitalize
                  ${theme === t ? 'bg-background text-foreground shadow-sm' : 'bg-transparent text-muted-foreground hover:text-foreground'}`}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </SettingRow>

        <SettingRow title="Language" description="The language used throughout the app.">
          <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Filipino">Filipino</SelectItem>
              <SelectItem value="Español">Español</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard title="Notifications">
        <SettingRow title="Email me a daily summary" description="One message each evening with the day’s activity.">
          <Switch checked={emailSummary} onCheckedChange={setEmailSummary} />
        </SettingRow>
        
        <SettingRow title="Play a sound for new alerts" description="A gentle chime when something needs attention.">
          <Switch checked={playSound} onCheckedChange={setPlaySound} />
        </SettingRow>

        <SettingRow title="Choose which alerts I get" description="Managed on the Alerts screen.">
          <Button variant="outline" size="sm" className="h-8" onClick={() => navigate({ to: '/alerts' })}>Open Alerts</Button>
        </SettingRow>
      </SettingsCard>

      {/* Advanced */}
      {authRole === 'Admin' && (
        <SettingsCard title="Advanced — connection & data (for IT)" isCollapsible>
          <SettingRow title="Check for updates every" description="How often the app refreshes its information.">
            <div className="flex items-center gap-2">
              <Input type="number" defaultValue="2" className="w-[60px] text-center" />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </SettingRow>

          <SettingRow title="Refresh automatically" description="Turn off to refresh only when you tap.">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </SettingRow>

          <SettingRow title="Where data is stored" description="school-server-01 · Manila data center">
            <Badge variant="secondary" className="font-normal rounded-full px-2.5">On-site</Badge>
          </SettingRow>

          <SettingRow title="Export all data" description="Download a full copy of the logs as a CSV file.">
            <Button variant="outline" size="sm" className="h-8">Export</Button>
          </SettingRow>

          <SettingRow title="About this device" description="Build 2026.06.10 · Device ID TAB-OFFICE-02 · server school-server-01" />
        </SettingsCard>
      )}

      {/* Help & About */}
      <SettingsCard title="Help & about">
        <SettingRow title="How to use this app" description="A short, plain-language guide.">
          <Button size="sm" className="h-8">Open guide</Button>
        </SettingRow>

        <SettingRow title="Contact IT" description="Get help from your school’s tech team.">
          <Button variant="outline" size="sm" className="h-8">Contact</Button>
        </SettingRow>

        <SettingRow title="About" description={`${APP_TITLE} for tablets · Version 1.0`} />
      </SettingsCard>
    </PageContainer>
  )
}
