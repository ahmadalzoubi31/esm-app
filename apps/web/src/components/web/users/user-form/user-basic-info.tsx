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
import { User as UserIcon, Info, Check, ChevronsUpDown } from 'lucide-react'
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
import { z } from 'zod'
import { UserSchema } from '@/schemas/user.schema'

interface UserBasicInfoProps {
  form: FormInstance<z.infer<typeof UserSchema>>
}

export function UserBasicInfo({ form }: UserBasicInfoProps) {
  const [openManager, setOpenManager] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: usersResponse, isLoading: isLoadingUsers } =
    useSearchUsersQuery(
      { search: debouncedSearch },
      { enabled: debouncedSearch.length >= 3 },
    )

  const users = usersResponse || []

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
                  <Popover open={openManager} onOpenChange={setOpenManager}>
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
                        <CommandInput
                          placeholder="Search manager..."
                          value={search}
                          onValueChange={setSearch}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {search.length < 3
                              ? 'Type at least 3 characters...'
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
                                    field.handleChange(user.username)
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
        </div>
      </CardContent>
    </Card>
  )
}
