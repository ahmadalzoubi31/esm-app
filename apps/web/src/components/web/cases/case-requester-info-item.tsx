export function CaseRequesterInfoItem({
  icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string
}) {
  const Icon = icon
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group/item">
      <div className="p-2 rounded-lg bg-muted/50 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          {label}
        </span>
        <span className="font-medium truncate">{value}</span>
      </div>
    </div>
  )
}
