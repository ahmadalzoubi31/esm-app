import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { DepartmentBasicInfo } from '@/components/web/departments/department-form/department-basic-info'
import { SideBarForm } from '@/components/web/departments/department-form/sidebar-form'
import { useDepartmentQuery } from '@/lib/queries/departments.query'
import { useUpdateDepartmentMutation } from '@/lib/mutations/departments.mutation'
import { DepartmentSchema } from '@/schemas/department.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/departments/$departmentId')({
  component: EditDepartmentPage,
})

function EditDepartmentPage() {
  const { departmentId } = Route.useParams()
  const navigate = useNavigate()

  const { data: departmentResponse, isLoading: departmentLoading } =
    useDepartmentQuery(departmentId)
  const updateMutation = useUpdateDepartmentMutation()

  // Handle case where API response format might differ
  const department = departmentResponse?.data || departmentResponse

  const form = useForm({
    defaultValues: {
      name: department?.name || '',
      description: department?.description || '',
      active: department?.active ?? true,
    } as z.infer<typeof DepartmentSchema>,
    validators: {
      onSubmit: DepartmentSchema,
    },
    onSubmit: async ({ value }) => {
      const departmentData = {
        name: value.name,
        description: value.description,
        active: value.active,
      }

      await updateMutation.mutateAsync({
        id: departmentId,
        data: departmentData,
      })

      navigate({ to: '/departments' })
    },
  })

  if (departmentLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/departments' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Department
          <div className="text-muted-foreground text-sm font-normal">
            Update department details
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
            <div className="space-y-6 lg:col-span-3">
              <DepartmentBasicInfo form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
