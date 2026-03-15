import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { useCaseQuery } from '@/lib/queries/cases.query'
import { CaseHeader } from '@/components/web/cases/case-view/case-header'
import { CaseRequester } from '@/components/web/cases/case-view/case-requester'
import { CaseDetailsOverview } from '@/components/web/cases/case-view/case-details-overview'
import { CaseInternalDiscussion } from '@/components/web/cases/case-view/case-internal-discussion'
import { CaseAttachments } from '@/components/web/cases/case-view/case-attachments'
import { CaseIntelligence } from '@/components/web/cases/case-view/case-intelligence'
import { CaseActivityLog } from '@/components/web/cases/case-view/case-activity-log'

export const Route = createFileRoute('/_esm/cases/$caseId/')({
  component: CaseDetailsPage,
})

function CaseDetailsPage() {
  const { caseId } = Route.useParams()
  const { data: caseRecord, isLoading } = useCaseQuery(caseId)

  if (isLoading || !caseRecord) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      <CaseHeader caseRecord={caseRecord} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-8 space-y-6">
          <CaseRequester requester={caseRecord.requester} />
          <CaseDetailsOverview caseRecord={caseRecord} />
          <CaseInternalDiscussion requester={caseRecord.requester} />
          <CaseAttachments />
        </div>

        {/* Right Column - Sidebar */}
        <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-6">
          <CaseIntelligence caseRecord={caseRecord} />
          <CaseActivityLog caseRecord={caseRecord} />
        </div>
      </div>
    </div>
  )
}
