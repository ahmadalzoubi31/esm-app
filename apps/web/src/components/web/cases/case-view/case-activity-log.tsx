import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClockIcon } from 'lucide-react'
import { formatDate } from '@/lib/format-date'

interface CaseActivityLogProps {
  caseRecord: {
    createdAt: string
    updatedAt: string
  }
}

export function CaseActivityLog({ caseRecord }: CaseActivityLogProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <ClockIcon className="h-4 w-4 text-muted-foreground/40" />
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-10 before:absolute before:left-[0.45rem] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/20 before:via-border/40 before:to-border/20">
          <div className="relative">
            <div className="absolute -left-8 top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">
                Initial Creation
              </p>
              <p className="text-sm font-bold text-foreground">
                Case Ticket Opened
              </p>
              <p className="text-xs text-muted-foreground font-medium italic">
                {formatDate(caseRecord.createdAt)}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full bg-muted-foreground/30 border-2 border-background" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                System Record
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                Last State Change
              </p>
              <p className="text-xs text-muted-foreground/60 font-medium italic">
                {formatDate(caseRecord.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
