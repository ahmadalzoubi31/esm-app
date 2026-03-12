import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  AlertCircleIcon,
  FileTextIcon,
  UserIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  FolderOpenIcon,
  ArrowLeft,
} from 'lucide-react'
import { useCaseQuery } from '@/lib/queries/cases.query'
import { formatDate } from '@/lib/format-date'
import { Case } from '@/types/cases'

export const Route = createFileRoute('/_esm/cases/$caseId/')({
  component: CaseDetailsPage,
})

const getPriorityColor = (priority?: string) => {
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

function CaseDetailsPage() {
  const { caseId } = Route.useParams()
  const navigate = useNavigate()
  const { data: caseResponse, isLoading } = useCaseQuery(caseId)

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const caseRecord = caseResponse as Case

  return (
    <>
      <div className="flex flex-row items-center gap-4 px-4 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/cases' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Case: {caseRecord?.number || caseId}
          <div className="text-muted-foreground text-sm font-normal">
            Update case details
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="px-4 lg:px-8 space-y-6 pb-12">
          {/* Header Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button size="sm" variant="ghost" asChild className="gap-2">
              <Link to="/cases">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link
                  to={`/cases/$caseId/edit`}
                  params={{ caseId: caseRecord.id }}
                >
                  View Case
                </Link>
              </Button>
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {caseRecord.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono bg-background">
                  {caseRecord.number}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {caseRecord.status?.toLowerCase()}
                </Badge>
                <Badge
                  className={`gap-1 ${getPriorityColor(caseRecord.priority)}`}
                >
                  <AlertCircleIcon className="h-3 w-3" />
                  <span className="capitalize">
                    {caseRecord.priority?.toLowerCase()}
                  </span>{' '}
                  Priority
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="xl:col-span-8 space-y-6">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
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
                      {caseRecord.description || 'No description provided'}
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
                      {caseRecord.category?.name && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border/50">
                          <span className="text-sm text-foreground font-medium">
                            Category
                          </span>
                          <span className="text-sm text-muted-foreground font-mono">
                            {caseRecord.category.name}
                          </span>
                        </div>
                      )}
                      {caseRecord.subcategory?.name && (
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-1 border-b border-border/50">
                          <span className="text-sm text-foreground font-medium">
                            Subcategory
                          </span>
                          <span className="text-sm text-muted-foreground font-mono">
                            {caseRecord.subcategory.name}
                          </span>
                        </div>
                      )}
                      {!caseRecord.category?.name &&
                        !caseRecord.subcategory?.name && (
                          <span className="text-sm">Uncategorized</span>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-4 space-y-6">
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
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
                        caseRecord.requester
                          ? `${caseRecord.requester.first_name || ''} ${caseRecord.requester.last_name || ''}`.trim() ||
                            undefined
                          : undefined
                      }
                    />
                    <InfoItem
                      icon={<UserIcon className="h-4 w-4 text-primary" />}
                      label="Assignee"
                      value={
                        caseRecord.assignee
                          ? `${caseRecord.assignee.first_name || ''} ${caseRecord.assignee.last_name || ''}`.trim() ||
                            'Unassigned'
                          : 'Unassigned'
                      }
                    />
                    <InfoItem
                      icon={<UsersIcon className="h-4 w-4 text-primary" />}
                      label="Assignment Group"
                      value={caseRecord.assignmentGroup?.name}
                    />
                    <InfoItem
                      icon={<CalendarIcon className="h-4 w-4 text-primary" />}
                      label="Created"
                      value={formatDate(caseRecord.createdAt)}
                    />
                    <InfoItem
                      icon={<ClockIcon className="h-4 w-4 text-primary" />}
                      label="Last Updated"
                      value={formatDate(caseRecord.updatedAt)}
                    />
                    {caseRecord.businessLine && (
                      <InfoItem
                        icon={
                          <FolderOpenIcon className="h-4 w-4 text-primary" />
                        }
                        label="Business Line"
                        value={caseRecord.businessLine.name}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
