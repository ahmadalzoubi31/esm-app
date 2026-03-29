import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { DepartmentBasicInfo } from '@/components/web/departments/department-form/department-basic-info'
import { SideBarForm } from '@/components/web/departments/department-form/sidebar-form'
import { useCreateDepartmentMutation } from '@/lib/mutations'
import { DepartmentDto, DepartmentWriteSchema } from '@repo/shared'

export const Route = createFileRoute('/_core/departments/create')({
  component: CreateDepartmentPage,
})

function CreateDepartmentPage() {
  const navigate = useNavigate()
  const createMutation = useCreateDepartmentMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      active: true,
    } as DepartmentDto,
    validators: {
      onSubmit: DepartmentWriteSchema,
    },
    onSubmit: async ({ value }) => {
      const departmentData = {
        name: value.name,
        description: value.description,
        active: value.active,
      }

      await createMutation.mutateAsync(departmentData as any)

      navigate({ to: '/departments' })
    },
  })

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
          Create Department
          <div className="text-muted-foreground text-sm font-normal">
            Create a new department
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
