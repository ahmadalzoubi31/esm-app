import { CellViewer } from '@/components/web/common/cell-viewer'
import { Link } from '@tanstack/react-router'
import { Case } from '@/types/cases'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format-date'
import {
  AlertCircleIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  FolderOpenIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'

const getPriorityColor = (priority: string) => {
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

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="p-2 rounded-md bg-background">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  )
}

export function TableCellViewer({ item }: { item: Case }) {
  return (
    <CellViewer
      triggerLabel={item.number}
      triggerClassName="font-medium hover:underline text-primary whitespace-nowrap w-fit px-0 text-left"
      icon={null}
      title={
        <span className="text-xl font-bold tracking-tight">{item.title}</span>
      }
      description={
        <span className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="outline" className="font-mono bg-background">
            {item.number}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {item.status?.toLowerCase()}
          </Badge>
          <Badge className={`gap-1 ${getPriorityColor(item.priority)}`}>
            <AlertCircleIcon className="h-3 w-3" />
            <span className="capitalize">{item.priority?.toLowerCase()}</span>{' '}
            Priority
          </Badge>
        </span>
      }
      editAction={
        <Link to={`/cases/$caseId`} params={{ caseId: item.id }}>
          View Full Details
        </Link>
      }
    >
      {/* Case Details */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">Case Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Description
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground pl-3 border-l-2 border-muted whitespace-pre-wrap">
              {item.description || 'No description provided'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Categorization
              </h4>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground pl-3 border-l-2 border-muted">
              {item.category?.name && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border/50">
                  <span className="text-sm text-foreground font-medium">
                    Category
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {item.category.name}
                  </span>
                </div>
              )}
              {item.subcategory?.name && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border/50">
                  <span className="text-sm text-foreground font-medium">
                    Subcategory
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {item.subcategory.name}
                  </span>
                </div>
              )}
              {!item.category?.name && !item.subcategory?.name && (
                <span className="text-sm">Uncategorized</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Information</CardTitle>
          <CardDescription className="text-xs">
            Case metadata and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <InfoItem
              icon={<UserIcon className="h-4 w-4 text-primary" />}
              label="Requester"
              value={
                item.requester
                  ? `${item.requester.firstName || ''} ${item.requester.lastName || ''}`.trim() ||
                    undefined
                  : undefined
              }
            />
            <InfoItem
              icon={<UserIcon className="h-4 w-4 text-primary" />}
              label="Assignee"
              value={
                item.assignee
                  ? `${item.assignee.firstName || ''} ${item.assignee.lastName || ''}`.trim() ||
                    'Unassigned'
                  : 'Unassigned'
              }
            />
            <InfoItem
              icon={<UsersIcon className="h-4 w-4 text-primary" />}
              label="Assignment Group"
              value={item.assignmentGroup?.name}
            />
            <InfoItem
              icon={<CalendarIcon className="h-4 w-4 text-primary" />}
              label="Created"
              value={formatDate(item.createdAt)}
            />
            <InfoItem
              icon={<ClockIcon className="h-4 w-4 text-primary" />}
              label="Last Updated"
              value={formatDate(item.updatedAt)}
            />
            {item.businessLine && (
              <InfoItem
                icon={<FolderOpenIcon className="h-4 w-4 text-primary" />}
                label="Business Line"
                value={item.businessLine.name}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </CellViewer>
  )
}
