import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileTextIcon, Activity, FolderOpenIcon } from 'lucide-react'
import { InfoItem } from './info-item'
import { Separator } from '@/components/ui/separator'

interface CaseDetailsOverviewProps {
  caseRecord: {
    description?: string
    affectedService?: { name: string }
    category?: { name: string }
    subcategory?: { name: string }
  }
}

export function CaseDetailsOverview({ caseRecord }: CaseDetailsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Detailed Case Overview
        </CardTitle>
        <CardDescription>
          Categorization and description of the reported issue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem
            icon={<Activity className="h-4 w-4" />}
            label="Affected Service"
            value={caseRecord.affectedService?.name || 'Uncategorized'}
          />
          <InfoItem
            icon={<Activity className="h-4 w-4" />}
            label="Primary Category"
            value={caseRecord.category?.name || 'Uncategorized'}
          />
          <InfoItem
            icon={<FolderOpenIcon className="h-4 w-4" />}
            label="Logical Subcategory"
            value={caseRecord.subcategory?.name || 'No subcategory'}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary/40" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Description
            </h3>
          </div>
          <div className="bg-muted/20 p-4 rounded-xl border border-border/20">
            <p className="text-sm leading-[1.8] text-foreground font-medium whitespace-pre-wrap wrap-break-word">
              {caseRecord.description ||
                'The requester has not provided a description for this case.'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary/40" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Questions and Answers
            </h3>
          </div>
          <div className="bg-muted/20 p-4 rounded-xl border border-border/20">
            <p className="text-sm leading-[1.8] text-foreground font-medium whitespace-pre-wrap wrap-break-word">
              {caseRecord.description ||
                'The requester has not provided a description for this case.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
