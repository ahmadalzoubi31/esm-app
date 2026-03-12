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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useGroupsQuery,
  useSearchGroupsQuery,
} from '@/lib/queries/groups.query'
import { cn } from '@/lib/utils'
import type { Group } from '@/types'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface GroupMenuProps {
  value?: string
  onChange: (value: string) => void
  isInvalid?: boolean
  id?: string
  placeholder?: string
}

export function GroupMenu({
  value,
  onChange,
  isInvalid,
  id,
  placeholder = 'Select group...',
}: GroupMenuProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: groupsResponse, isLoading } = useSearchGroupsQuery({
    search: debouncedSearch,
    limit: '10',
  })

  const searchedGroups = groupsResponse || []
  const [selectedGroup, setSelectedGroup] = useState<Group>()

  useEffect(() => {
    if (value && !selectedGroup) {
      const match = searchedGroups.find((u: Group) => u.id === value)
      if (match) setSelectedGroup(match)
    }
  }, [searchedGroups, value, selectedGroup])

  const groups = [
    ...searchedGroups,
    ...(selectedGroup &&
    !searchedGroups.find((g: Group) => g.id === selectedGroup.id)
      ? [selectedGroup]
      : []),
  ]

  const displayGroup = groups.find((Group: Group) => Group.id === value)

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
          className={cn(
            'w-full justify-between font-normal',
            !value && 'text-muted-foreground',
          )}
        >
          {displayGroup
            ? `${displayGroup.name} (${displayGroup.type})`
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex border-b px-3 py-2 text-xs text-muted-foreground bg-muted/30">
            Type to search groups...
          </div>
          <CommandInput
            placeholder="Search by name or type..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Searching...' : 'No group found.'}
            </CommandEmpty>
            <CommandGroup>
              {groups.map((group: any) => (
                <CommandItem
                  key={group.id}
                  value={group.id}
                  onSelect={() => {
                    onChange(group.id)
                    setSelectedGroup(group)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === group.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {group.name} ({group.type})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
