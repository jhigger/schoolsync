import { AlertTriangle } from 'lucide-react'

type StatusAlertProps = {
  count?: number
}

export function StatusAlert({ count = 2 }: StatusAlertProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3 shrink-0 bg-orange-50 border border-orange-200 dark:bg-orange-950 dark:border-orange-800"
      role="status"
      aria-live="polite"
    >
      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
      <div className="text-orange-900 dark:text-orange-300 font-medium">
        {count} things need your attention
      </div>
    </div>
  )
}
