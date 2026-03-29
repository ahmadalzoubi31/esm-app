import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ActivityIcon,
  UserIcon,
  UsersIcon,
  FolderOpenIcon,
  SquareRoundCornerIcon,
} from 'lucide-react'
import { InfoItem } from './info-item'

interface CaseIntelligenceProps {
  caseRecord: {
    assignee?: {
      displayName?: string
      firstName?: string
      lastName?: string
    }
    assignmentGroup: {
      name: string
    }
    businessLine: {
      name: string
    }
    requestCard?: {
      name: string
    }
  }
}

export function CaseIntelligence({ caseRecord }: CaseIntelligenceProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Case Intelligence
          </CardTitle>
          <CardDescription>
            Case Intelligence provides insights into the case, including the
            assignee, assignment group, business line, and request card.
          </CardDescription>{' '}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="flex flex-col gap-4">
          <InfoItem
            icon={<UserIcon className="h-4 w-4" />}
            label="Designated Assignee"
            value={
              caseRecord.assignee ? (
                <div className="flex items-center gap-2">
                  <span>
                    {caseRecord.assignee.displayName ||
                      `${caseRecord.assignee.firstName} ${caseRecord.assignee.lastName}`}
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
            value={caseRecord.assignmentGroup.name}
          />
        </div>

        <InfoItem
          icon={<SquareRoundCornerIcon className="h-4 w-4" />}
          label="Source"
          value={
            caseRecord.requestCard?.name
              ? 'Self Service: ' + caseRecord.requestCard?.name
              : 'Direct Entry'
          }
        />

        <InfoItem
          icon={<FolderOpenIcon className="h-4 w-4" />}
          label="Business Line"
          value={caseRecord.businessLine.name}
        />
      </CardContent>
    </Card>
  )
}

