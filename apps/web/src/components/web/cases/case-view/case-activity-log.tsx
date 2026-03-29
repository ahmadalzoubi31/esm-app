import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Clock, CheckCircle2, History } from 'lucide-react'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'

interface CaseActivityLogProps {
  caseRecord: {
    createdAt: string
    updatedAt: string
    title?: string
  }
}

export function CaseActivityLog({ caseRecord }: CaseActivityLogProps) {
  // Since we don't have a backend timeline yet, we'll construct a basic one
  // from the available case record timestamps.
  const events = [
    {
      id: 'updated',
      type: 'case.updated',
      title: 'Last State Update',
      timestamp: caseRecord.updatedAt,
      Icon: History,
      description: 'System record updated',
    },
    {
      id: 'created',
      type: 'case.created',
      title: 'Case Created',
      timestamp: caseRecord.createdAt,
      Icon: CheckCircle2,
      description: `New case ticket opened: ${caseRecord.title || 'Untitled'}`,
    },
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Activity Log
          </CardTitle>
          <CardDescription>
            Track the history of changes and updates to the case.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="space-y-6">
          <div className="pt-8">
            {events.map((event, index) => {
              const Icon = event.Icon
              return (
                <div key={event.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-primary/70" />
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-px h-full bg-gradient-to-b from-border via-border/50 to-transparent my-1 min-h-[40px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-6 pt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm text-foreground/90 leading-none">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground leading-relaxed mb-2">
                      {event.description}
                    </p>
                    <p className="text-[10.5px] font-medium text-muted-foreground/60 uppercase tracking-tight italic">
                      {format(new Date(event.timestamp), 'PPpp')}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
