import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Check, ChevronsUpDown, X, PlusCircle, Users } from 'lucide-react'
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
import { GroupSchema } from '@/schemas/group.schema'
import { useSearchUsersQuery } from '@/lib/queries/users.query'

interface GroupUsersProps {
  form: FormInstance<z.infer<typeof GroupSchema>>
}

export function GroupUsers({ form }: GroupUsersProps) {
  const [search, setSearch] = useState('')
  const { data: usersResponse, isLoading } = useSearchUsersQuery({ search, limit: '20' })
  const users = usersResponse || []
  const [open, setOpen] = useState(false)

  // Get currently selected users to potentially fetch their names if not in the search results
  // For simplicity, we just rely on what is returned by the query or what was originally loaded.

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Group Members
        </CardTitle>
        <CardDescription>
          Assign users to this group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && !users.length ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <form.Field
            name="users"
            children={(field) => {
              const selectedUsers = (field.state.value || []) as string[]

              const handleSelect = (userId: string) => {
                const current = (field.state.value as string[]) || []
                if (current.includes(userId)) {
                  field.handleChange(
                    current.filter((id: string) => id !== userId),
                  )
                } else {
                  field.handleChange([...current, userId])
                }
              }

              const handleRemove = (userId: string) => {
                const current = field.state.value || []
                field.handleChange(
                  current.filter((id: string) => id !== userId),
                )
              }

              const availableUsers = users.filter(
                (user) => !selectedUsers.includes(user.id),
              )

              return (
                <div className="space-y-4">
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((selectedUserId) => {
                        // In edit mode we only have IDs initially unless we fetch all users or the specific users.
                        // Ideally we show the user ID if name isn't available immediately.
                        const user = users.find((u) => u.id === selectedUserId)
                        return (
                          <Badge
                            key={selectedUserId}
                            variant="secondary"
                            className="pl-2 pr-1 py-1 flex items-center gap-1 text-sm"
                          >
                            {user ? user.username : selectedUserId.substring(0, 8)}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full p-0 hover:bg-muted-foreground/20"
                              onClick={() => handleRemove(selectedUserId)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </Badge>
                        )
                      })}
                    </div>
                  )}

                  <Popover open={open} onOpenChange={(isOpen) => {
                    setOpen(isOpen)
                    if (!isOpen) setSearch('')
                  }}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <PlusCircle className="h-4 w-4" />
                          Add Member...
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput 
                          placeholder="Search users..." 
                          value={search}
                          onValueChange={setSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {availableUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={`${user.first_name} ${user.last_name} ${user.username}`}
                                onSelect={() => {
                                  handleSelect(user.id)
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{user.first_name} {user.last_name} ({user.username})</span>
                                  <span className="text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    selectedUsers.includes(user.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
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
