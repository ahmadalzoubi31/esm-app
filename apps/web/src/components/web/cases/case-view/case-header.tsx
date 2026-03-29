import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Edit,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/format-date'
import { CaseStatusBadge } from '@/components/web/cases/case-status-badge'
import { getPriorityColor } from './info-item'
import { CaseStatusModal } from './modals/case-status-modal'
import { CaseReassignModal } from './modals/case-reassign-modal'
import { CaseShareModal } from './modals/case-share-modal'

interface CaseHeaderProps {
  caseRecord: {
    id: string
    title: string
    number: string
    status: string
    priority: string
    createdAt: string
    updatedAt: string
    assignee?: { id: string }
  }
}

export function CaseHeader({ caseRecord }: CaseHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          asChild
          className="-ml-3 gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent px-3"
        >
          <Link to="/cases/$caseId" params={{ caseId: caseRecord.id }}>
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium tracking-tight">
              Back to Workspace
            </span>
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            asChild
            className="ml-auto hidden h-8 lg:flex"
          >
            <Link
              to={`/cases/$caseId/edit`}
              params={{ caseId: caseRecord.id }}
              className="gap-2"
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="font-medium">Modify Case</span>
            </Link>
          </Button>
          <CaseStatusModal
            caseId={caseRecord.id}
            currentStatus={caseRecord.status}
          />
          <CaseReassignModal
            caseId={caseRecord.id}
            currentAssigneeId={caseRecord.assignee?.id}
          />
          <CaseShareModal caseNumber={caseRecord.number} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-medium tracking-tight text-foreground font-sans leading-none">
            {caseRecord.title}
          </h1>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-primary/5 border border-primary/20 text-[11px] text-primary font-medium"
            >
              {caseRecord.number}
            </Badge>

            <CaseStatusBadge status={caseRecord.status} />

            <Badge
              variant="outline"
              className={cn(
                'flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider',
                getPriorityColor(caseRecord.priority),
              )}
            >
              <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              {caseRecord.priority} Priority
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground lg:mb-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Submission Date
            </span>
            <span className="font-medium text-foreground">
              {formatDate(caseRecord.createdAt)}
            </span>
          </div>
          <Separator orientation="vertical" className="h-8 bg-border/40" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Last Activity
            </span>
            <span className="font-medium text-foreground">
              {formatDate(caseRecord.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
