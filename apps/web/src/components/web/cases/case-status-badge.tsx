import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CaseStatus } from '@/types/cases'

interface CaseStatusBadgeProps {
  status: CaseStatus | string
  className?: string
}

export function CaseStatusBadge({ status, className }: CaseStatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      case 'IN_PROGRESS':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
      case 'RESOLVED':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
      case 'CLOSED':
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
      case 'CANCELED':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
      case 'WAITING_FOR_APPROVAL':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800'
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 px-3 py-1 shadow-sm',
        getStatusStyles(status),
        className,
      )}
    >
      <span className="capitalize font-semibold">
        {status?.toLowerCase().replace(/_/g, ' ')}
      </span>
    </Badge>
  )
}
