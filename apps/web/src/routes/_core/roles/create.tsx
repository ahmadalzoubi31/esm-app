import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { RoleBasicInfo } from '@/components/web/roles/role-form/role-basic-info'
import { RolePermissions } from '@/components/web/roles/role-form/role-permissions'
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
        permissionIds: value.permissions.length > 0 ? value.permissions : undefined,
      }
      
      await createMutation.mutateAsync(roleData as any)

      navigate({ to: '/roles' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4 px-4 lg:px-8">
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

      <div className="px-8 lg:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid grid-cols-1 gap-6 mx-auto pb-4">
            <RoleBasicInfo form={form} />
            <RolePermissions form={form} />
          </div>

          <div className="sticky bottom-0 z-50 flex justify-end border-t bg-background/80 py-4 backdrop-blur-sm">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    createMutation.isPending
                  }
                >
                  {isSubmitting ||
                  createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Create Role'
                  )}
                </Button>
              )}
            />
          </div>
        </form>
      </div>
    </>
  )
}
