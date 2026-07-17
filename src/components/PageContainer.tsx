import { cn } from '@/lib/utils'
import { ReactNode, HTMLAttributes } from 'react'

interface PageContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: React.ElementType
}

export function PageContainer({ children, className, as: Component = "div", ...props }: PageContainerProps) {
  return (
    <Component className={cn("flex-1 flex flex-col gap-4 p-4 sm:p-[18px_22px] max-w-full w-full h-full min-h-full", className)} {...props}>
      {children}
    </Component>
  )
}
