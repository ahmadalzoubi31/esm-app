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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  const { data: usersResponse, isLoading } = useSearchUsersQuery({
    search,
    limit: '10',
    isLicensed: true,
  })
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
        <CardDescription>Assign users to this group.</CardDescription>
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
                (user) => !selectedUsers.includes(user.id) && user.isLicensed,
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
                            className="pl-1 pr-2 py-1 flex items-center gap-2 text-sm rounded-full bg-secondary overflow-hidden"
                          >
                            <Avatar className="h-6 w-6 border-muted-foreground/20 border">
                              <AvatarFallback className="text-[10px] bg-background">
                                {user
                                  ? (user.firstName?.[0] || '') +
                                    (user.lastName?.[0] || '')
                                  : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium mr-1">
                              {user
                                ? `${user.firstName} ${user.lastName}`
                                : selectedUserId.substring(0, 8)}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full p-0 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors shrink-0"
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

                  <Popover
                    open={open}
                    onOpenChange={(isOpen) => {
                      setOpen(isOpen)
                      if (!isOpen) setSearch('')
                    }}
                  >
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
                                value={`${user.firstName} ${user.lastName} ${user.username}`}
                                className="flex items-center gap-3 p-2 cursor-pointer"
                                onSelect={() => {
                                  handleSelect(user.id)
                                }}
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {(user.firstName?.[0] || '') +
                                      (user.lastName?.[0] || '')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col flex-1">
                                  <span className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {user.email || user.username}
                                  </span>
                                </div>
                                <Check
                                  className={cn(
                                    'h-4 w-4 text-primary ml-auto',
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

