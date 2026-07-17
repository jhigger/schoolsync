import { useStore } from '../store'
import { useRouterState } from '@tanstack/react-router'
import { CircleHelp, X } from 'lucide-react'
import { APP_TITLE } from '../lib/constants'

const helpContent: Record<string, { title: string, text: string }> = {
  dashboard: { title: "Help · Dashboard", text: "Your morning overview. The banner at the top tells you if anything needs attention. 'What to do now' lists today's tasks — handle each one, or tap 'Check now' to jump to the computers that need a look. Use 'Print today's report' for a paper summary." },
  activity: { title: "Help · Activity Log", text: "A running list of everything that happened, newest first. Use the search box to find a room, person, or event, and the filter pills to show only what you care about. 'Load earlier' reveals older days." },
  devices: { title: "Help · Rooms & Devices", text: "Every room and its computers, printers, and other devices. Pick a room on the left to see its devices. 'Has problems' shows only rooms that need attention. On a flagged device, tap 'Show report' to read what happened, or 'Ask IT for help' if it's broken." },
  alerts: { title: "Help · Alerts", text: "Things worth knowing about — like repeated wrong passwords or a device going offline. Read each one and tap 'Mark as reviewed' once you've handled it. The 'What I get alerted about' tab lets you turn alert types on or off." },
  settings: { title: "Help · Settings", text: `Manage your account and choose what ${APP_TITLE} alerts you about. Switch between Simple and Detailed anytime with the toggle in the corner. Use 'Change password' to update your sign-in, or 'Sign out' when you're done.` }
}

export default function HelpBar() {
  const isHelpOpen = useStore((state) => state.isHelpOpen)
  const setHelpOpen = useStore((state) => state.setHelpOpen)
  const router = useRouterState()

  if (!isHelpOpen) return null

  const path = router.location.pathname
  // Parse path to key, e.g. "/dashboard" -> "dashboard", "/" -> "dashboard"
  let viewKey = path.split('/')[1] || 'dashboard'
  if (!helpContent[viewKey]) {
    viewKey = 'dashboard'
  }

  const content = helpContent[viewKey]

  return (
    <div className="flex shrink-0 items-start gap-3 mx-4 sm:mx-[22px] mt-4 sm:mt-[18px] p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg text-sm transition-all duration-200 animate-in slide-in-from-top-2 fade-in">
      <CircleHelp className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300">{content.title}</h4>
        <p className="text-blue-800/80 dark:text-blue-400/80 leading-relaxed">{content.text}</p>
      </div>
      <button 
        onClick={() => setHelpOpen(false)}
        className="shrink-0 p-1 rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        aria-label="Close help"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
