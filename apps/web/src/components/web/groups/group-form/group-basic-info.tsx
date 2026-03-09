import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, ChevronsUpDown, UsersIcon } from 'lucide-react'
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
import { FormInstance } from '@/types'
import { z } from 'zod'
import { GroupSchema } from '@/schemas/group.schema'

interface GroupBasicInfoProps {
  form: FormInstance<z.infer<typeof GroupSchema>>
}

export function GroupBasicInfo({ form }: GroupBasicInfoProps) {
  const [openLeader, setOpenLeader] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: usersResponse, isLoading: isLoadingUsers } =
    useSearchUsersQuery({ search: debouncedSearch, limit: '5' })

  const searchedUsers = usersResponse || []
  const [selectedLeader, setSelectedLeader] = useState<any>(null)

  useEffect(() => {
    if (form.state.values.teamLeaderId && !selectedLeader) {
      const match = searchedUsers.find(
        (u) => u.id === form.state.values.teamLeaderId,
      )
      if (match) setSelectedLeader(match)
    }
  }, [searchedUsers, form.state.values.teamLeaderId, selectedLeader])

  const users = [
    ...searchedUsers,
    ...(selectedLeader &&
    !searchedUsers.find((u) => u.id === selectedLeader.id)
      ? [selectedLeader]
      : []),
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          Group Information
        </CardTitle>
        <CardDescription>
          Enter basic group details and leadership
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          {/* Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Group Name</FieldLabel>
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

          {/* Type */}
          <form.Field
            name="type"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select
                    onValueChange={(val) => field.handleChange(val)}
                    value={field.state.value}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="help-desk">Help Desk</SelectItem>
                      <SelectItem value="tier-1">Tier 1</SelectItem>
                      <SelectItem value="tier-2">Tier 2</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Description */}
          <form.Field
            name="description"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid} className="md:col-span-2">
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ''}
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

          {/* Team Leader */}
          <form.Field
            name="teamLeaderId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid} className="flex flex-col">
                  <FieldLabel>Team Leader</FieldLabel>
                  <Popover
                    open={openLeader}
                    onOpenChange={(isOpen) => {
                      setOpenLeader(isOpen)
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
                        aria-expanded={openLeader}
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.state.value && 'text-muted-foreground',
                        )}
                      >
                        {field.state.value
                          ? users.find((user) => user.id === field.state.value)
                              ?.username || field.state.value
                          : 'Select leader...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <div className="flex border-b px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                          Type at least 3 characters...
                        </div>
                        <CommandInput
                          placeholder="Search users..."
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
                                      field.state.value === user.id
                                        ? ''
                                        : user.id,
                                    )
                                    setOpenLeader(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.state.value === user.id
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {user.first_name} {user.last_name} ({user.username})
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

          {/* Business Line Key */}
          <form.Field
            name="businessLineKey"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Business Line</FieldLabel>
                  <Select
                    onValueChange={(val) => field.handleChange(val)}
                    value={field.state.value}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                    >
                      <SelectValue placeholder="Select business line" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">Information Technology (IT)</SelectItem>
                      <SelectItem value="HR">Human Resources (HR)</SelectItem>
                      <SelectItem value="FIN">Finance (FIN)</SelectItem>
                      <SelectItem value="OPS">Operations (OPS)</SelectItem>
                    </SelectContent>
                  </Select>
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
