import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
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
import { User } from '@/types'

export interface UserMenuProps {
  value?: string | null
  onChange: (value: string | undefined) => void
  isInvalid?: boolean
  id?: string
  placeholder?: string
  disabled?: boolean
}

export function UserMenu({
  value,
  onChange,
  isInvalid,
  id,
  placeholder = 'Select user...',
  disabled,
}: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: usersResponse, isLoading } = useSearchUsersQuery({
    search: debouncedSearch,
    limit: '10',
  })

  const searchedUsers = usersResponse || []
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (value && !selectedUser) {
      const match = searchedUsers.find((u: User) => u.id === value)
      if (match) setSelectedUser(match)
    }
  }, [searchedUsers, value, selectedUser])

  const users = [
    ...searchedUsers,
    ...(selectedUser &&
    !searchedUsers.find((u: User) => u.id === selectedUser.id)
      ? [selectedUser]
      : []),
  ]

  const displayUser = users.find((user: User) => user.id === (value || undefined))

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setSearch('')
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={isInvalid}
          disabled={disabled}
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          {displayUser
            ? `${displayUser.firstName} ${displayUser.lastName} (${displayUser.username})`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex border-b px-3 py-2 text-xs text-muted-foreground bg-muted/30">
            Type to search users...
          </div>
          <CommandInput
            placeholder="Search by name or username..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Searching...' : 'No user found.'}
            </CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  value="none"
                  onSelect={() => {
                    onChange(undefined)
                    setOpen(false)
                  }}
                  className="text-muted-foreground italic"
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  Clear selection
                </CommandItem>
              )}
              {users.map((user: any) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => {
                    onChange(user.id)
                    setSelectedUser(user)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === user.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {user.firstName} {user.lastName} ({user.username})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

