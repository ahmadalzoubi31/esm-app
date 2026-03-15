import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  ShieldIcon,
  UsersIcon,
  UserCog,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { GroupBasicInfo } from '@/components/web/groups/group-form/group-basic-info'
import { GroupRoles } from '@/components/web/groups/group-form/group-roles'
import { GroupPermissions } from '@/components/web/groups/group-form/group-permissions'
import { GroupUsers } from '@/components/web/groups/group-form/group-users'
import { SideBarForm } from '@/components/web/groups/group-form/sidebar-form'
import { useGroupQuery } from '@/lib/queries/groups.query'
import { useUpdateGroupMutation } from '@/lib/mutations/groups.mutation'
import { UpdateGroupSchema } from '@/schemas/group.schema'
import { Group } from '@/types'

export const Route = createFileRoute('/_core/groups/$groupId')({
  component: EditGroupPage,
})

function EditGroupPage() {
  const { groupId } = Route.useParams()
  const navigate = useNavigate()
  const { data: group, isLoading, error } = useGroupQuery(groupId)
  const updateGroupMutation = useUpdateGroupMutation()

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !group) {
    console.log('Group error or empty:', { error, group })
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-2">
        <div className="text-lg font-semibold">Group not found</div>
        <div className="text-muted-foreground">
          The group you are looking for does not exist or you don't have
          permission to view it.
        </div>
      </div>
    )
  }

  console.log('EditGroupPage loaded with group:', group)

  return (
    <EditGroupForm
      group={group}
      groupId={groupId}
      navigate={navigate}
      mutation={updateGroupMutation}
    />
  )
}

function EditGroupForm({
  group,
  groupId,
  navigate,
  mutation,
}: {
  group: Group
  groupId: string
  navigate: any
  mutation: any
}) {
  const form = useForm({
    defaultValues: {
      name: group.name,
      type: group.type,
      description: group.description,
      teamLeaderId: group.teamLeader?.id || '',
      businessLineId: group.businessLine?.id || '',
      departmentId: (group as any).department?.id || '',
      roles: group.roles?.map((r) => r.id) || [],
      permissions: group.permissions?.map((p) => p.id) || [],
      users: group.users?.map((u) => u.id) || [],
    } as any, // Quick type assertion due to partial vs full schema matching in zod
    validators: {
      onSubmit: UpdateGroupSchema,
    },
    onSubmit: async ({ value }) => {
      const submitData = { ...value }
      await mutation.mutateAsync({ id: groupId, data: submitData })
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
          Edit Group: {group.name}
          <div className="text-muted-foreground text-sm font-normal">
            Edit group details
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
