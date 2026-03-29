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
  ArrowLeft,
} from 'lucide-react'
import { UserBasicInfo } from '@/components/web/users/user-form/user-basic-info'
import { UserRoles } from '@/components/web/users/user-form/user-roles'
import { UserSettings } from '@/components/web/users/user-form/user-settings'
import { UserPermissions } from '@/components/web/users/user-form/user-permissions'
import { UserMetadata } from '@/components/web/users/user-form/user-metadata'
import { SideBarForm } from '@/components/web/users/user-form/sidebar-form'
import { useCreateUserMutation } from '@/lib/mutations'
import { AuthSourceEnum } from '@repo/shared'
import z from 'zod'

export const Route = createFileRoute('/_core/users/create')({
  component: CreateUserPage,
})

function CreateUserPage() {
  const navigate = useNavigate()
  const mutation = useCreateUserMutation()

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      avatar: '',
      authSource: AuthSourceEnum.local,
      departmentId: '',
      phone: '',
      manager: '',
      password: '',
      externalId: '',
      isActive: true,
      isLicensed: false,
      roles: [] as string[],
      permissions: [] as string[],
      groups: [] as string[],
      metadata: {},
    } as UserDto,
    validators: {
      onSubmit: CreateUserSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
      navigate({ to: '/users' })
    },
  })

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/users' })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-2xl font-bold tracking-tight">
          Create User
          <div className="text-muted-foreground text-sm font-normal">
            Create a new user
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
            <form.Subscribe
              selector={(state) => [state.values.isLicensed]}
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
                        <UserPermissions form={form} />
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
