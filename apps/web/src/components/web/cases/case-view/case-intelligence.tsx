import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Activity, UserIcon, UsersIcon, FolderOpenIcon } from 'lucide-react'
import { InfoItem } from './info-item'

interface CaseIntelligenceProps {
  caseRecord: {
    assignee?: {
      display_name?: string
      first_name?: string
      last_name?: string
    }
    assignmentGroup?: {
      name?: string
    }
    businessLine?: {
      name?: string
    }
  }
}

export function CaseIntelligence({ caseRecord }: CaseIntelligenceProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="h-4 w-4 text-primary opacity-50" />
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Case Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <InfoItem
            icon={<UserIcon className="h-4 w-4" />}
            label="Designated Assignee"
            value={
              caseRecord.assignee ? (
                <div className="flex items-center gap-2">
                  <span>
                    {caseRecord.assignee.display_name ||
                      `${caseRecord.assignee.first_name} ${caseRecord.assignee.last_name}`}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground font-medium italic">
                  Unassigned
                </span>
              )
            }
          />
          <InfoItem
            icon={<UsersIcon className="h-4 w-4" />}
            label="Accountable Group"
            value={caseRecord.assignmentGroup?.name || 'No Group'}
          />
        </div>

        <Separator className="bg-border/20" />

        {caseRecord.businessLine && (
          <InfoItem
            icon={<FolderOpenIcon className="h-4 w-4" />}
            label="Service Line"
            value={caseRecord.businessLine.name}
          />
        )}
      </CardContent>
    </Card>
  )
}
