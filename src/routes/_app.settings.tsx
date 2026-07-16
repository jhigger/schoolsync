import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { usePreferences, type Theme } from '../lib/preferences'
import { useState } from 'react'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  const { theme, setTheme } = usePreferences()
  const navigate = useNavigate()

  const [emailSummary, setEmailSummary] = useState(true)
  const [playSound, setPlaySound] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [textSize, setTextSize] = useState('Medium')
  const [language, setLanguage] = useState('English')

  return (
    <div className="flex flex-col overflow-y-auto p-[18px_22px] gap-[16px]">
      {/* Account */}
      <div className="bg-background border border-border rounded-[var(--radius)] px-[18px] py-[6px] shadow-none">
        <div className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-[14px] pb-[4px]">Your account</div>
        <div className="flex items-center gap-[14px] py-[16px]">
          <div className="w-[54px] h-[54px] rounded-full bg-[hsl(240_5%_92%)] dark:bg-[hsl(240_6%_26%)] text-[hsl(240_6%_35%)] dark:text-[hsl(0_0%_90%)] flex items-center justify-center text-[20px] font-bold shrink-0">MR</div>
          <div className="flex-1">
            <div className="text-[17px] font-bold">Maria Reyes</div>
            <div className="text-[13.5px] text-muted-foreground mt-[2px]">Admin assistant · maria.reyes@school.edu</div>
          </div>
          <Button variant="outline" size="sm" className="h-8">Change password</Button>
          <Button variant="destructive" size="sm" className="h-8">Sign out</Button>
        </div>
      </div>

      {/* Display */}
      <div className="bg-background border border-border rounded-[var(--radius)] px-[18px] py-[6px] shadow-none">
        <div className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-[14px] pb-[4px]">Display</div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Text size</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Make words bigger or smaller across the app.</div>
          </div>
          <div className="flex bg-muted rounded-[9px] p-[3px] gap-[2px]">
            {['Small', 'Medium', 'Large'].map(size => (
              <button 
                key={size}
                className={`border-none bg-transparent font-semibold py-[8px] px-[14px] rounded-[7px] cursor-pointer transition-all
                  ${size === 'Small' ? 'text-[12px]' : size === 'Medium' ? 'text-[14px]' : 'text-[16px]'}
                  ${textSize === size ? 'bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,.12)]' : 'text-muted-foreground'}`}
                onClick={() => setTextSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Appearance</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Light is easiest to read in bright rooms.</div>
          </div>
          <div className="flex bg-muted rounded-[9px] p-[3px] gap-[2px]">
            {(['light', 'dark', 'auto'] as Theme[]).map(t => (
              <button 
                key={t}
                className={`border-none bg-transparent text-[13.5px] font-semibold py-[8px] px-[14px] rounded-[7px] cursor-pointer transition-all capitalize
                  ${theme === t ? 'bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,.12)]' : 'text-muted-foreground'}`}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Language</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">The language used throughout the app.</div>
          </div>
          <select 
            className="h-[40px] border border-border rounded-[9px] px-[12px] text-[14px] bg-background outline-none focus:ring-2 focus:ring-ring"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Filipino</option>
            <option>Español</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-background border border-border rounded-[var(--radius)] px-[18px] py-[6px] shadow-none">
        <div className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-[14px] pb-[4px]">Notifications</div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Email me a daily summary</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">One message each evening with the day’s activity.</div>
          </div>
          <Switch checked={emailSummary} onCheckedChange={setEmailSummary} />
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Play a sound for new alerts</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">A gentle chime when something needs attention.</div>
          </div>
          <Switch checked={playSound} onCheckedChange={setPlaySound} />
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Choose which alerts I get</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Managed on the Alerts screen.</div>
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={() => navigate({ to: '/alerts' })}>Open Alerts</Button>
        </div>
      </div>

      {/* Advanced */}
      <details className="bg-background border border-border rounded-[var(--radius)] px-[18px] py-[6px] shadow-none group">
        <summary className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-[14px] pb-[4px] list-none cursor-pointer flex items-center gap-[8px] [&::-webkit-details-marker]:hidden after:content-['Show'] after:ml-auto after:text-[12px] after:font-bold after:text-[hsl(220_80%_45%)] after:normal-case after:tracking-normal group-open:after:content-['Hide']">
          Advanced — connection & data (for IT)
        </summary>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0 mt-[4px]">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Check for updates every</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">How often the app refreshes its information.</div>
          </div>
          <div className="flex items-center gap-[8px]">
            <input type="number" defaultValue="2" className="w-[60px] h-[40px] border border-border rounded-[9px] text-center text-[14px] bg-background outline-none focus:ring-2 focus:ring-ring" />
            <span className="text-[14px] text-muted-foreground">minutes</span>
          </div>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Refresh automatically</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Turn off to refresh only when you tap.</div>
          </div>
          <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Where data is stored</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">school-server-01 · Manila data center</div>
          </div>
          <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-normal text-[12px] h-[22px] rounded-full px-2.5">On-site</Badge>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Export all data</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Download a full copy of the logs as a CSV file.</div>
          </div>
          <Button variant="outline" size="sm" className="h-8">Export</Button>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">About this device</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Build 2026.06.10 · Device ID TAB-OFFICE-02 · server school-server-01</div>
          </div>
        </div>
      </details>

      {/* Help & About */}
      <div className="bg-background border border-border rounded-[var(--radius)] px-[18px] py-[6px] shadow-none">
        <div className="text-[13px] font-bold uppercase tracking-[.04em] text-muted-foreground pt-[14px] pb-[4px]">Help & about</div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">How to use this app</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">A short, plain-language guide.</div>
          </div>
          <Button size="sm" className="h-8 bg-primary text-primary-foreground">Open guide</Button>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">Contact IT</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">Get help from your school’s tech team.</div>
          </div>
          <Button variant="outline" size="sm" className="h-8">Contact</Button>
        </div>
        <div className="flex items-center gap-[14px] py-[15px] border-t border-border first:border-t-0">
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold">About</div>
            <div className="text-[13px] text-muted-foreground mt-[2px]">SchoolSync for tablets · Version 1.0</div>
          </div>
        </div>
      </div>
    </div>
  )
}
