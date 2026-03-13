import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircleIcon,
  FileTextIcon,
  UserIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  FolderOpenIcon,
  ArrowLeft,
  Edit,
  XCircle,
  MessageSquare,
  Paperclip,
  Activity,
  Mail,
  Phone,
  Building2,
  Briefcase,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCaseQuery } from '@/lib/queries/cases.query'
import { formatDate } from '@/lib/format-date'
import { cn } from '@/lib/utils'
import { CaseStatusBadge } from '@/components/web/cases/case-status-badge'
import { CaseRequesterInfoItem } from '@/components/web/cases/case-requester-info-item'

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
  className,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  className?: string
}) {
  if (!value) return null
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors',
        className,
      )}
    >
      <div className="p-2 rounded-md bg-background shadow-sm">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground leading-tight">
          {value}
        </p>
      </div>
    </div>
  )
}

function CaseDetailsPage() {
  const { caseId } = Route.useParams()
  const { data: caseRecord, isLoading } = useCaseQuery(caseId)

  if (isLoading || !caseRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="px-4 lg:px-8 space-y-6 pt-6 animate-pulse">
          <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            <div className="xl:col-span-8 space-y-6">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-60 w-full rounded-xl" />
            </div>
            <div className="xl:col-span-4 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-12">
      <div className="px-4 lg:px-8 space-y-6">
        {/* Header Navigation */}
        <div className="flex items-center justify-between pt-6">
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="gap-2 hover:bg-background/80 shadow-sm border"
          >
            <Link to="/cases">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Cases</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="shadow-sm hover:bg-background/80"
            >
              <Link
                to={`/cases/$caseId/edit`}
                params={{ caseId: caseRecord.id }}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Case
              </Link>
            </Button>
            {/* Action buttons could go here (e.g. Change Status) */}
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 leading-tight">
              {caseRecord.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="font-mono bg-background px-3 py-1 shadow-sm border-primary/20 text-primary"
              >
                {caseRecord.number}
              </Badge>
              <CaseStatusBadge status={caseRecord.status} />
              <Badge
                variant="outline"
                className={cn(
                  'gap-1.5 px-3 py-1 shadow-sm',
                  getPriorityColor(caseRecord.priority),
                )}
              >
                <AlertCircleIcon className="h-3.5 w-3.5" />
                <span className="capitalize font-semibold">
                  {caseRecord.priority?.toLowerCase()} Priority
                </span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-8 space-y-6">
            {/* Requester Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Requester Information
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex flex-col items-center text-center space-y-4 min-w-[160px]">
                    <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-md">
                      <AvatarImage src={caseRecord.requester?.avatar} />
                      <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">
                        {caseRecord.requester
                          ? `${caseRecord.requester.first_name?.[0] || ''}${caseRecord.requester.last_name?.[0] || ''}`
                          : 'SY'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold leading-none text-foreground">
                        {caseRecord.requester
                          ? caseRecord.requester.display_name ||
                            `${caseRecord.requester.first_name} ${caseRecord.requester.last_name}`
                          : 'System'}
                      </h3>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="font-semibold bg-primary/10 text-primary border-none text-[10px] h-5 px-2"
                          >
                            <Briefcase className="h-3 w-3 mr-1" />
                            {caseRecord.requester?.metadata?.title ||
                              'Staff member'}
                          </Badge>
                        </div>
                        {caseRecord.requester?.department && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold bg-muted/50 px-2 py-0.5 rounded-full border border-border/50">
                            <Building2 className="h-3 w-3 text-primary/60" />
                            {caseRecord.requester.department.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-32 bg-border/60" />

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full">
                    <CaseRequesterInfoItem
                      icon={Mail}
                      label="Email Address"
                      value={caseRecord.requester?.email || 'No email address'}
                    />

                    <CaseRequesterInfoItem
                      icon={Phone}
                      label="Phone Number"
                      value={caseRecord.requester?.phone || 'No phone number'}
                    />

                    <CaseRequesterInfoItem
                      icon={Building2}
                      label="Department"
                      value={
                        caseRecord.requester?.department?.name ||
                        'No department'
                      }
                    />

                    <CaseRequesterInfoItem
                      icon={UserIcon}
                      label="Manager"
                      value={caseRecord.requester?.manager || 'No manager'}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Details Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileTextIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Case Details</CardTitle>
                    <CardDescription className="text-xs">
                      In-depth description and categorization
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">
                      Description
                    </h4>
                  </div>
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
                    <p className="text-base leading-relaxed text-muted-foreground pl-5 whitespace-pre-wrap italic font-light">
                      {caseRecord.description || 'No description provided'}
                    </p>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary/80">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">
                      Categorization
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-5">
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Category
                      </p>
                      <p className="text-sm font-semibold">
                        {caseRecord.category?.name || 'Uncategorized'}
                      </p>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                        Subcategory
                      </p>
                      <p className="text-sm font-semibold">
                        {caseRecord.subcategory?.name || 'No subcategory'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Placeholder */}
            <Card className="border shadow-md rounded-xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Case Comments</CardTitle>
                    <CardDescription className="text-xs">
                      Internal discussion and updates
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-4 rounded-full bg-muted/50">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Comments coming soon
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    This feature is currently under implementation.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Attachments Placeholder */}
            <Card>
              <CardHeader className="pb-3 border-b bg-muted/20">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Attachments</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  No attachments yet.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-6">
            <Card className="border shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <CardTitle className="text-xl font-bold">
                    Information
                  </CardTitle>
                </div>
                <CardDescription className="text-xs font-medium">
                  Case metadata and assignments
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <InfoItem
                    icon={<UserIcon className="h-4 w-4 text-primary" />}
                    label="Assignee"
                    value={
                      caseRecord.assignee ? (
                        caseRecord.assignee.display_name ||
                        `${caseRecord.assignee.first_name || ''} ${caseRecord.assignee.last_name || ''}`.trim()
                      ) : (
                        <span className="text-muted-foreground italic font-normal">
                          Unassigned
                        </span>
                      )
                    }
                  />
                  <InfoItem
                    icon={<UsersIcon className="h-4 w-4 text-primary" />}
                    label="Assignment Group"
                    value={
                      caseRecord.assignmentGroup?.name || 'No Group assigned'
                    }
                  />
                  <InfoItem
                    icon={<Building2 className="h-4 w-4 text-primary" />}
                    label="Department"
                    value={caseRecord.requester?.department?.name}
                  />

                  <Separator className="my-2 opacity-50" />

                  <div className="grid grid-cols-2 gap-2">
                    <InfoItem
                      icon={<CalendarIcon className="h-4 w-4 text-primary" />}
                      label="Created"
                      value={formatDate(caseRecord.createdAt)}
                      className="p-2 bg-muted/20"
                    />
                    <InfoItem
                      icon={<ClockIcon className="h-4 w-4 text-primary" />}
                      label="Last Updated"
                      value={formatDate(caseRecord.updatedAt)}
                      className="p-2 bg-muted/20"
                    />
                  </div>

                  {caseRecord.businessLine && (
                    <InfoItem
                      icon={<FolderOpenIcon className="h-4 w-4 text-primary" />}
                      label="Business Line"
                      value={caseRecord.businessLine.name}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Placeholder */}
            <Card className="border shadow-md rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted/10">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:w-0.5 before:-translate-x-1/2 before:bg-muted/80">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 mt-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background shadow-sm translate-x-[0.25rem]" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {formatDate(caseRecord.createdAt)}
                    </p>
                    <p className="text-sm font-semibold">Case Created</p>
                    <p className="text-xs text-muted-foreground">
                      Original submission received
                    </p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 mt-1 h-2.5 w-2.5 rounded-full border-2 border-muted-foreground bg-background shadow-sm translate-x-[0.25rem]" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {formatDate(caseRecord.updatedAt)}
                    </p>
                    <p className="text-sm font-semibold">Last Modified</p>
                    <p className="text-xs text-muted-foreground">
                      Recent system update
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
