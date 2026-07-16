import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

type StatusAlertProps = {
  count?: number
  isLoading?: boolean
}

export function StatusAlert({ count = 0, isLoading }: StatusAlertProps) {
  if (isLoading) {
    return <Skeleton className="h-[48px] w-full rounded-lg" />
  }

  if (count === 0) {
    return (
      <div
        className="flex items-center gap-3 rounded-lg px-4 py-3 shrink-0 bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
        <div className="text-green-900 dark:text-green-300 font-medium">
          You're all caught up
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-3 shrink-0 bg-orange-50 border border-orange-200 dark:bg-orange-950 dark:border-orange-800"
      role="status"
      aria-live="polite"
    >
      <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
      <div className="text-orange-900 dark:text-orange-300 font-medium">
        {count} {count === 1 ? 'thing needs' : 'things need'} your attention
      </div>
    </div>
  )
}
