import { cn } from '@/lib/utils'

export const getPriorityColor = (priority?: string) => {
  switch (priority?.toUpperCase()) {
    case 'CRITICAL':
      return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900'
    case 'HIGH':
      return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900'
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900'
  }
}

export function InfoItem({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  className?: string
}) {
  if (!value) return null
  return (
    <div
      className={cn(
        'group flex flex-col gap-1.5 p-3.5 rounded-xl bg-card border border-border/40 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all hover:bg-muted/30 hover:shadow-[0_4px_8px_rgba(0,0,0,0.04)] hover:border-border/60',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] font-sans">
          {label}
        </p>
      </div>
      <div className="text-sm font-semibold text-foreground leading-tight pl-0.5">
        {value}
      </div>
    </div>
  )
}
