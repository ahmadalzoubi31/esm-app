import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { RoleBasicInfo } from '@/components/web/roles/role-form/role-basic-info'
import { RolePermissions } from '@/components/web/roles/role-form/role-permissions'
import { SideBarForm } from '@/components/web/roles/role-form/sidebar-form'
import {
  useUpdateRoleMutation,
  useAssignPermissionsMutation,
  useRemovePermissionsMutation,
} from '@/lib/mutations/roles.mutation'
import {
  useRoleQuery,
  useRolePermissionsQuery,
} from '@/lib/queries/roles.query'
import { RoleSchema } from '@/schemas/role.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/roles/$roleId')({
  component: EditRolePage,
})

function EditRolePage() {
  const { roleId } = Route.useParams()
  const navigate = useNavigate()

  const updateMutation = useUpdateRoleMutation()
  const assignPermsMutation = useAssignPermissionsMutation()
  const removePermsMutation = useRemovePermissionsMutation()

  const { data: roleResponse, isLoading: roleLoading } = useRoleQuery(roleId)
  const { data: permsResponse, isLoading: permsLoading } =
    useRolePermissionsQuery(roleId)

  const isDataLoading = roleLoading || permsLoading

  const form = useForm({
    defaultValues: {
      name: roleResponse?.data.name || '',
      description: roleResponse?.data.description || '',
      permissionCount: roleResponse?.data.permissionCount || 0,
      userCount: roleResponse?.data.userCount || 0,
      permissions: permsResponse?.data?.map((p: any) => p.id) || [],
    } as z.infer<typeof RoleSchema>,
    validators: {
      onSubmit: RoleSchema,
    },
    onSubmit: async ({ value }) => {
      // 1. Update basic info
      await updateMutation.mutateAsync({
        id: roleId,
        data: {
          name: value.name,
          description: value.description,
        },
      })

      // 2. Sync permissions
      const currentPermIds = permsResponse?.data?.map((p: any) => p.id) || []
      const newPermIds = value.permissions

      const permsToAdd = newPermIds.filter((id) => !currentPermIds.includes(id))
      const permsToRemove = currentPermIds.filter(
        (id) => !newPermIds.includes(id),
      )

      if (permsToAdd.length > 0) {
        await assignPermsMutation.mutateAsync({
          id: roleId,
          data: { permissionIds: permsToAdd },
        })
      }

      if (permsToRemove.length > 0) {
        await removePermsMutation.mutateAsync({
          id: roleId,
          data: { permissionIds: permsToRemove },
        })
      }

      navigate({ to: '/roles' })
    },
  })

  if (isDataLoading) {
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
          onClick={() => navigate({ to: '/roles' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit Role
          <div className="text-muted-foreground text-sm font-normal">
            Update role details and permissions
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
