import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CaseBasicInfo } from '@/components/web/cases/case-form/case-basic-info'
import { CaseRequesterInfo } from '@/components/web/cases/case-form/case-requester-info'
import { CaseAssignmentInfo } from '@/components/web/cases/case-form/case-assignment-info'
import { useCaseQuery } from '@/lib/queries/cases.query'
import { CaseSchema, UpdateCaseSchema } from '@/schemas/case.schema'
import z from 'zod'
import { Case } from '@/types'
import { useUpdateCaseMutation } from '@/lib/mutations'

export const Route = createFileRoute('/_esm/cases/$caseId/edit/')({
  component: EditCasePage,
})

function EditCasePage() {
  const { caseId } = Route.useParams()
  const navigate = useNavigate()
  const { data: caseData, isLoading, error } = useCaseQuery(caseId)
  console.log('🚀 ~ EditCasePage ~ caseData:', caseData)
  const updateCaseMutation = useUpdateCaseMutation()

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !caseData) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-2">
        <div className="text-lg font-semibold">Case not found</div>
        <div className="text-muted-foreground">
          The case you are looking for does not exist or you don't have
          permission to view it.
        </div>
      </div>
    )
  }

  return (
    <EditCaseForm
      caseData={caseData}
      caseId={caseId}
      navigate={navigate}
      mutation={updateCaseMutation}
    />
  )
}

function EditCaseForm({
  caseData,
  caseId,
  navigate,
  mutation,
}: {
  caseData: Case
  caseId: string
  navigate: any
  mutation: any
}) {
  const form = useForm({
    defaultValues: {
      title: caseData.title,
      description: caseData.description,
      status: caseData.status,
      priority: caseData.priority,
      category: caseData.category,
      subcategory: caseData.subcategory,
      requester: caseData.requester,
      assignee: caseData.assignee,
      assignmentGroup: caseData.assignmentGroup,
      businessLine: caseData.businessLine,
      affectedService: caseData.affectedService,
      requestCard: caseData.requestCard,
    } as z.infer<typeof CaseSchema>,
    validators: {
      onSubmit: CaseSchema,
    },
    onSubmit: async ({ value }) => {
      const submitData = { ...value }
      if (!submitData.subcategory) delete submitData.subcategory
      if (!submitData.assignee) delete submitData.assignee
      if (!submitData.requestCard) delete submitData.requestCard

      await mutation.mutateAsync({
        id: caseId,
        data: submitData,
      })
      navigate({ to: '/cases' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/cases/$caseId', params: { caseId } })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Case: {caseData.number}
          <div className="text-muted-foreground text-sm font-normal">
            Update case details
          </div>
        </div>
      </div>

      <div className="">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mx-auto pb-4 pt-4">
            <div className="space-y-6 lg:col-span-4">
              <CaseRequesterInfo form={form} disabled={true} />
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
