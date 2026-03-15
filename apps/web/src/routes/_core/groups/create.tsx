import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ShieldIcon, UsersIcon, UserCog, ArrowLeft } from 'lucide-react'
import { GroupBasicInfo } from '@/components/web/groups/group-form/group-basic-info'
import { GroupRoles } from '@/components/web/groups/group-form/group-roles'
import { GroupPermissions } from '@/components/web/groups/group-form/group-permissions'
import { GroupUsers } from '@/components/web/groups/group-form/group-users'
import { SideBarForm } from '@/components/web/groups/group-form/sidebar-form'
import { useCreateGroupMutation } from '@/lib/mutations/groups.mutation'
import { GroupSchema, CreateGroupSchema } from '@/schemas/group.schema'
import z from 'zod'

export const Route = createFileRoute('/_core/groups/create')({
  component: CreateGroupPage,
})

function CreateGroupPage() {
  const navigate = useNavigate()
  const createGroupMutation = useCreateGroupMutation()

  const form = useForm({
    defaultValues: {
      name: '',
      type: 'help-desk',
      description: '',
      teamLeaderId: '',
      businessLineId: '',
      departmentId: '',
      roles: [],
      permissions: [],
      users: [],
    } as z.infer<typeof GroupSchema>,
    validators: {
      onSubmit: CreateGroupSchema,
    },
    onSubmit: async ({ value }) => {
      const submitData = { ...value }
      await createGroupMutation.mutateAsync(submitData)
      navigate({ to: '/groups' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/groups' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Create Group
          <div className="text-muted-foreground text-sm font-normal">
            Add a new group
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="space-y-6 lg:col-span-3">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger
                    value="basic"
                    className="flex items-center gap-2"
                  >
                    <UsersIcon className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>

                  <TabsTrigger
                    value="roles"
                    className="flex items-center gap-2"
                  >
                    <UserCog className="h-4 w-4" />
                    Roles
                  </TabsTrigger>

                  <TabsTrigger
                    value="permissions"
                    className="flex items-center gap-2"
                  >
                    <ShieldIcon className="h-4 w-4" />
                    Permissions
                  </TabsTrigger>

                  <TabsTrigger
                    value="users"
                    className="flex items-center gap-2"
                  >
                    <UsersIcon className="h-4 w-4" />
                    Members
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 pt-4">
                  <GroupBasicInfo form={form} />
                </TabsContent>

                <TabsContent value="roles" className="pt-4">
                  <GroupRoles form={form} />
                </TabsContent>

                <TabsContent value="permissions" className="pt-4">
                  <GroupPermissions form={form as any} />
                </TabsContent>

                <TabsContent value="users" className="pt-4">
                  <GroupUsers form={form} />
                </TabsContent>
              </Tabs>
            </div>

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
