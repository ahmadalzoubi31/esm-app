import { useRolesQuery } from '@/lib/queries/roles.query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, ChevronsUpDown, X, PlusCircle, UserCog } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { FormInstance } from '@/types'
import { z } from 'zod'
import { UserSchema } from '@/schemas/user.schema'

interface UserRolesProps {
  form: FormInstance<z.infer<typeof UserSchema>>
}

export function UserRoles({ form }: UserRolesProps) {
  const { data: rolesResponse, isLoading } = useRolesQuery()
  const roles = rolesResponse?.data || []
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          User Roles
        </CardTitle>
        <CardDescription>
          Assign roles to define what this user can do in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <form.Field
            name="roles"
            children={(field) => {
              const selectedRoles = (field.state.value || []) as string[]

              const handleSelect = (roleId: string) => {
                const current = (field.state.value as string[]) || []
                if (current.includes(roleId)) {
                  field.handleChange(
                    current.filter((id: string) => id !== roleId),
                  )
                } else {
                  field.handleChange([...current, roleId])
                }
              }

              const handleRemove = (roleId: string) => {
                const current = field.state.value || []
                field.handleChange(
                  current.filter((id: string) => id !== roleId),
                )
              }

              // Filter out already selected roles from the dropdown list
              const availableRoles = roles.filter(
                (role) => !selectedRoles.includes(role.id),
              )

              return (
                <div className="space-y-4">
                  {/* Selected Roles Tags */}
                  {selectedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedRoles.map((selectedRole) => {
                        const role = roles.find((r) => r.id === selectedRole)
                        if (!role) return null
                        return (
                          <Badge
                            key={selectedRole}
                            variant="secondary"
                            className="pl-2 pr-1 py-1 flex items-center gap-1 text-sm"
                          >
                            {role.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full p-0 hover:bg-muted-foreground/20"
                              onClick={() => handleRemove(selectedRole)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </Badge>
                        )
                      })}
                    </div>
                  )}

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <PlusCircle className="h-4 w-4" />
                          Add Role...
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search roles..." />
                        <CommandList>
                          <CommandEmpty>No role found.</CommandEmpty>
                          <CommandGroup>
                            {availableRoles.map((role) => (
                              <CommandItem
                                key={role.id}
                                value={`${role.name} ${role.description}`}
                                onSelect={() => {
                                  handleSelect(role.id)
                                  // Keep open to allow multiple selections or close?
                                  // Usually better to keep open for multi-select,
                                  // but since we remove items from list, it feels natural.
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{role.name}</span>
                                  {role.description && (
                                    <span className="text-xs text-muted-foreground">
                                      {role.description}
                                    </span>
                                  )}
                                </div>
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    selectedRoles.includes(role.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                            {availableRoles.length === 0 && (
                              <div className="p-2 text-sm text-center text-muted-foreground">
                                All available roles assigned.
                              </div>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
