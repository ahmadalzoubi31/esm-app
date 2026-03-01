import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  User as UserIcon,
  Info,
  Check,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSearchUsersQuery } from '@/lib/queries/users.query'
import { useState, useEffect } from 'react'
import { AuthSource, FormInstance } from '@/types'
import { usersApi } from '@/lib/api/users.api'
import { z } from 'zod'
import { UserSchema } from '@/schemas/user.schema'

interface UserBasicInfoProps {
  form: FormInstance<z.infer<typeof UserSchema>>
}

export function UserBasicInfo({ form }: UserBasicInfoProps) {
  const [openManager, setOpenManager] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: usersResponse, isLoading: isLoadingUsers } =
    useSearchUsersQuery({ search: debouncedSearch, limit: '5' })

  const searchedUsers = usersResponse || []

  // Always ensure the currently selected manager is in the list, even if it doesn't match the current 5 search results
  const [selectedManager, setSelectedManager] = useState<any>(null)

  useEffect(() => {
    // Attempt to hydrate selected manager from search results if missing
    if (form.state.values.manager && !selectedManager) {
      const match = searchedUsers.find(
        (u) => u.username === form.state.values.manager,
      )
      if (match) setSelectedManager(match)
    }
  }, [searchedUsers, form.state.values.manager, selectedManager])

  // Combine search results and potentially the selected manager
  const users = [
    ...searchedUsers,
    ...(selectedManager &&
    !searchedUsers.find((u) => u.username === selectedManager.username)
      ? [selectedManager]
      : []),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Enter the user's personal details and contact information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
          {/* First Name */}
          <form.Field
            name="first_name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Last Name */}
          <form.Field
            name="last_name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Username */}
          <form.Field
            name="username"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Email */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Avatar */}
          <form.Field
            name="avatar"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Avatar</FieldLabel>
                  <div className="flex items-center gap-4">
                    {isUploading ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : field.state.value ? (
                      <img
                        src={field.state.value}
                        alt="Avatar preview"
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : null}
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        id={field.name}
                        name={field.name}
                        disabled={isUploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            try {
                              setIsUploading(true)
                              const {
                                data: { url },
                              } = await usersApi.uploadAvatar(file)
                              field.handleChange(url)
                            } catch (error) {
                              console.error('Failed to upload avatar', error)
                            } finally {
                              setIsUploading(false)
                            }
                          } else {
                            field.handleChange('')
                          }
                        }}
                        className="cursor-pointer file:cursor-pointer"
                        aria-invalid={isInvalid}
                      />
                    </div>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Auth Source */}
          <form.Subscribe
            selector={(state: any) => [state.values.auth_source]}
            children={([authSource]: any) => {
              return (
                <Field>
                  <FieldLabel className="flex items-center gap-2">
                    Authentication Source
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </FieldLabel>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {authSource === AuthSource.LDAP ? 'LDAP' : 'Local'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {authSource === AuthSource.LDAP
                        ? 'Set automatically for LDAP users'
                        : 'Set automatically for manually created users'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This field is automatically determined by the system
                  </p>
                </Field>
              )
            }}
          />

          {/* Password */}
          <form.Subscribe
            selector={(state: any) => [state.values.auth_source]}
            children={([authSource]: any) => {
              return authSource === AuthSource.LOCAL ? (
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Password</FieldLabel>
                        <FieldContent>
                          <Input
                            type="password"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </FieldContent>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              ) : null
            }}
          />

          {/* Department */}
          <form.Field
            name="department"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Department</FieldLabel>
                  <FieldContent>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Phone */}
          <form.Field
            name="phone"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel>Phone</FieldLabel>
                  <FieldContent>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Manager */}
          <form.Field
            name="manager"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid} className="flex flex-col">
                  <FieldLabel>Manager</FieldLabel>
                  <Popover
                    open={openManager}
                    onOpenChange={(isOpen) => {
                      setOpenManager(isOpen)
                      if (!isOpen) {
                        field.handleBlur()
                        setSearch('')
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openManager}
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.state.value && 'text-muted-foreground',
                        )}
                      >
                        {field.state.value
                          ? users.find(
                              (user) => user.username === field.state.value,
                            )?.username || field.state.value
                          : 'Select manager...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <div className="flex border-b px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                          Type at least 3 characters...
                        </div>
                        <CommandInput
                          placeholder="Search manager..."
                          value={search}
                          onValueChange={setSearch}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {search.length > 0 && search.length < 3
                              ? 'Keep typing...'
                              : isLoadingUsers
                                ? 'Searching...'
                                : 'No user found.'}
                          </CommandEmpty>
                          <CommandGroup>
                            {users
                              .filter((u) => u.is_active)
                              .map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={`${user.first_name} ${user.last_name} ${user.username}`}
                                  onSelect={() => {
                                    field.handleChange(
                                      field.state.value === user.username
                                        ? ''
                                        : user.username,
                                    )
                                    setOpenManager(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.state.value === user.username
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {user.first_name} {user.last_name} (
                                  {user.username})
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Manager Name */}
          <form.Subscribe
            selector={(state: any) => [state.values.manager]}
            children={([managerUsername]: any) => {
              const managerDetails = users.find(
                (user) => user.username === managerUsername,
              )

              return (
                <Field className="flex flex-col">
                  <FieldLabel>Manager Name</FieldLabel>
                  <Input
                    disabled
                    value={
                      managerDetails
                        ? `${managerDetails.first_name} ${managerDetails.last_name}`
                        : ''
                    }
                    placeholder="Auto-filled"
                    className="bg-muted"
                  />
                </Field>
              )
            }}
          />

          {/* Manager Email */}
          <form.Subscribe
            selector={(state: any) => [state.values.manager]}
            children={([managerUsername]: any) => {
              const managerDetails = users.find(
                (user) => user.username === managerUsername,
              )

              return (
                <Field className="flex flex-col">
                  <FieldLabel>Manager Email</FieldLabel>
                  <Input
                    disabled
                    value={managerDetails?.email || ''}
                    placeholder="Auto-filled"
                    className="bg-muted"
                  />
                </Field>
              )
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
