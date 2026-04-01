export function DetailItem({
  label,
  value,
  children,
  className,
}: {
  label: string
  value?: string | number | null
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="text-xs font-medium text-foreground">
        {children || value || '-'}
      </div>
    </div>
  )
}
