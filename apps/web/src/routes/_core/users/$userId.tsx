import { useForm } from '@tanstack/react-form'
import { useNavigate, createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  SettingsIcon,
  ShieldIcon,
  UserCog,
  UserIcon,
  DatabaseIcon,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { UserBasicInfo } from '@/components/web/users/user-form/user-basic-info'
import { UserRoles } from '@/components/web/users/user-form/user-roles'
import { UserSettings } from '@/components/web/users/user-form/user-settings'
import { UserPermissions } from '@/components/web/users/user-form/user-permissions'
import { UserMetadata } from '@/components/web/users/user-form/user-metadata'
import { SideBarForm } from '@/components/web/users/user-form/sidebar-form'
import { useUserQuery } from '@/lib/queries/users.query'
import { useUpdateUserMutation } from '@/lib/mutations/users.mutation'
import { UserSchema, UpdateUserSchema } from '@/schemas/user.schema'
import { User } from '@/types'
import z from 'zod'

export const Route = createFileRoute('/_core/users/$userId')({
  component: EditUserPage,
})

function EditUserPage() {
  const { userId } = Route.useParams()
  const navigate = useNavigate()
  const { data: user, isLoading, error } = useUserQuery(userId)
  const updateUserMutation = useUpdateUserMutation()

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center flex-col gap-2">
        <div className="text-lg font-semibold">User not found</div>
        <div className="text-muted-foreground">
          The user you are looking for does not exist or you don't have
          permission to view it.
        </div>
      </div>
    )
  }

  return (
    <EditUserForm
      user={user}
      userId={userId}
      navigate={navigate}
      mutation={updateUserMutation}
    />
  )
}

function EditUserForm({
  user,
  userId,
  navigate,
  mutation,
}: {
  user: User
  userId: string
  navigate: any
  mutation: any
}) {
  const form = useForm({
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      auth_source: user.auth_source,
      department: user.department,
      phone: user.phone,
      manager: user.manager,
      password: user.password,
      external_id: user.external_id,
      is_active: user.is_active,
      is_licensed: user.is_licensed,
      roles: user.roles?.map((r) => r.id) || [],
      permissions: user.permissions?.map((p) => p.id) || [],
      groups: user.groups?.map((g) => g.id) || [],
      metadata: user.metadata,
    } as z.infer<typeof UserSchema>,
    validators: {
      onSubmit: UpdateUserSchema,
    },
    onSubmit: async ({ value }) => {
      const submitData = { ...value }
      if (!submitData.password) {
        delete submitData.password
      }
      await mutation.mutateAsync({ id: userId, data: submitData })
      navigate({ to: '/users' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4 px-4 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/users' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Edit User: {user.username}
          <div className="text-muted-foreground text-sm font-normal">
            Edit user details
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <form.Subscribe
              selector={(state) => [state.values.is_licensed]}
              children={([isLicensed]: any) => (
                <div className="space-y-6 lg:col-span-3">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList
                      className={`grid w-full ${
                        isLicensed ? 'grid-cols-5' : 'grid-cols-3'
                      }`}
                    >
                      <TabsTrigger
                        value="basic"
                        className="flex items-center gap-2"
                      >
                        <UserIcon className="h-4 w-4" />
                        Basic Info
                      </TabsTrigger>

                      {isLicensed && (
                        <TabsTrigger
                          value="roles"
                          className="flex items-center gap-2"
                        >
                          <UserCog className="h-4 w-4" />
                          Roles
                        </TabsTrigger>
                      )}

                      {isLicensed && (
                        <TabsTrigger
                          value="permissions"
                          className="flex items-center gap-2"
                        >
                          <ShieldIcon className="h-4 w-4" />
                          Permissions
                        </TabsTrigger>
                      )}

                      <TabsTrigger
                        value="metadata"
                        className="flex items-center gap-2"
                      >
                        <DatabaseIcon className="h-4 w-4" />
                        Metadata
                      </TabsTrigger>

                      <TabsTrigger
                        value="settings"
                        className="flex items-center gap-2"
                      >
                        <SettingsIcon className="h-4 w-4" />
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-6">
                      <UserBasicInfo form={form} />
                    </TabsContent>

                    {isLicensed && (
                      <TabsContent value="roles">
                        <UserRoles form={form} />
                      </TabsContent>
                    )}

                    {isLicensed && (
                      <TabsContent value="permissions">
                        <UserPermissions form={form as any} />
                      </TabsContent>
                    )}

                    <TabsContent value="metadata">
                      <UserMetadata form={form} />
                    </TabsContent>

                    <TabsContent value="settings">
                      <UserSettings form={form} />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            />

            <SideBarForm form={form} />
          </div>
        </form>
      </div>
    </>
  )
}
