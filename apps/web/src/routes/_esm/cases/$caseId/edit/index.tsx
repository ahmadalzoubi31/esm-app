import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CaseBasicInfo } from '@/components/web/cases/case-form/case-basic-info'
import { CaseRequesterInfo } from '@/components/web/cases/case-form/case-requester-info'
import { CaseAssignmentInfo } from '@/components/web/cases/case-form/case-assignment-info'

import { useCaseQuery } from '@/lib/queries/cases.query'
import { useUpdateCaseMutation } from '@/lib/mutations/cases.mutation'
import { CaseSchema } from '@/schemas/case.schema'
import z from 'zod'

export const Route = createFileRoute('/_esm/cases/$caseId/edit/')({
  component: EditCasePage,
})

function EditCasePage() {
  const { caseId } = Route.useParams()
  const navigate = useNavigate()

  const { data: caseResponse, isLoading: caseLoading } = useCaseQuery(caseId)
  const updateMutation = useUpdateCaseMutation()

  const caseData = caseResponse as any

  const form = useForm({
    defaultValues: {
      title: caseData?.title || '',
      description: caseData?.description || '',
      status: caseData?.status || 'NEW',
      priority: caseData?.priority || 'MEDIUM',
      category_id:
        (caseData?.category as any)?.id || caseData?.category_id || '',
      subcategory_id:
        (caseData?.subcategory as any)?.id || caseData?.subcategory_id || '',
      requester_id:
        (caseData?.requester as any)?.id || caseData?.requester_id || '',
      assignee_id:
        (caseData?.assignee as any)?.id || caseData?.assignee_id || '',
      assignment_group_id:
        (caseData?.assignment_group as any)?.id ||
        caseData?.assignment_group_id ||
        '',
      business_line_id:
        (caseData?.business_line as any)?.id ||
        caseData?.business_line_id ||
        '',
      affected_service_id:
        (caseData?.affected_service as any)?.id ||
        caseData?.affected_service_id ||
        '',
      request_card_id:
        (caseData?.request_card as any)?.id || caseData?.request_card_id || '',
    } as z.infer<typeof CaseSchema>,
    validators: {
      onSubmit: CaseSchema,
    },
    onSubmit: async ({ value }) => {
      const submitData = { ...value }
      if (!submitData.subcategory_id) delete submitData.subcategory_id
      if (!submitData.assignee_id) delete submitData.assignee_id
      if (!submitData.affected_service_id) delete submitData.affected_service_id
      if (!submitData.request_card_id) delete submitData.request_card_id

      await updateMutation.mutateAsync({
        id: caseId,
        data: submitData,
      })

      navigate({ to: '/cases' })
    },
  })

  if (caseLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
          Edit Case: {caseData?.number || caseId}
          <div className="text-muted-foreground text-sm font-normal">
            Update case details
          </div>
        </div>
      </div>

      <div className="px-8 lg:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mx-auto pb-4 pt-4">
            <div className="space-y-6 lg:col-span-4">
              <CaseRequesterInfo form={form} />
              <CaseBasicInfo form={form} />
              <CaseAssignmentInfo form={form} />
            </div>
          </div>
          <div className="flex justify-end gap-4 pb-12">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/cases' })}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state: any) => ({
                isSubmitting: state.isSubmitting,
                isValid: state.isValid,
              })}
            >
              {({ isSubmitting, isValid }: any) => (
                <Button type="submit" disabled={isSubmitting || !isValid}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Case'
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </>
  )
}
