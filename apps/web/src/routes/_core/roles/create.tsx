import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { RoleBasicInfo } from '@/components/web/roles/role-form/role-basic-info'
import { RolePermissions } from '@/components/web/roles/role-form/role-permissions'
import { SideBarForm } from '@/components/web/roles/role-form/sidebar-form'
import { useCreateRoleMutation } from '@/lib/mutations'
import { RoleSchema } from '@/schemas/role.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/roles/create')({
  component: CreateRolePage,
})

function CreateRolePage() {
  const navigate = useNavigate()
  const createMutation = useCreateRoleMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      permissionCount: 0,
      userCount: 0,
      permissions: [],
    } as z.infer<typeof RoleSchema>,
    validators: {
      onSubmit: RoleSchema,
    },
    onSubmit: async ({ value }) => {
      const roleData = {
        name: value.name,
        description: value.description,
        permissionIds:
          value.permissions.length > 0 ? value.permissions : undefined,
      }

      await createMutation.mutateAsync(roleData as any)

      navigate({ to: '/roles' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/roles' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Create Role
          <div className="text-muted-foreground text-sm font-normal">
            Create a new role
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mx-auto pb-4">
            <div className="space-y-6 lg:col-span-3">
              <RoleBasicInfo form={form} />
              <RolePermissions form={form} />
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
