import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { CaseBasicInfo } from '@/components/web/cases/case-form/case-basic-info'
import { CaseRequesterInfo } from '@/components/web/cases/case-form/case-requester-info'
import { CaseAssignmentInfo } from '@/components/web/cases/case-form/case-assignment-info'

import { useCreateCaseMutation } from '@/lib/mutations'
import { CaseSchema } from '@/schemas/case.schema'
import z from 'zod'
import { CaseStatus, CasePriority } from '@/types/cases'

export const Route = createFileRoute('/_esm/cases/create')({
  component: CreateCasePage,
})

function CreateCasePage() {
  const navigate = useNavigate()
  const createMutation = useCreateCaseMutation()

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: CaseStatus.NEW,
      priority: CasePriority.MEDIUM,
      category: '',
      subcategory: '',
      requester: '',
      assignee: '',
      assignmentGroup: '',
      businessLine: '',
      affectedService: 'c840564e-218e-4b0d-93b5-c48be6dc4350',
    } as z.infer<typeof CaseSchema>,
    validators: {
      onSubmit: CaseSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('🚀 ~ CreateCasePage ~ value:', value)
      // Clean up empty optional fields
      const submitData = { ...value }
      if (!submitData.subcategory) delete submitData.subcategory
      if (!submitData.assignee) delete submitData.assignee
      // if (!submitData.affectedServiceId) delete submitData.affectedServiceId
      // if (!submitData.requestCardId) delete submitData.requestCardId

      await createMutation.mutateAsync(submitData as any)
      navigate({ to: '/cases' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/cases' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Create Case
          <div className="text-muted-foreground text-sm font-normal">
            Create a new case
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
                      Creating...
                    </>
                  ) : (
                    'Create Case'
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
