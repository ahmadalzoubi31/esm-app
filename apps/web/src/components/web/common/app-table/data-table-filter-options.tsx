import { Filter } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { FacetedFilterConfig } from './types'

interface AppDataTableFilterOptionsProps<TData> {
  availableFilters: FacetedFilterConfig<TData>[]
  activeFilters: FacetedFilterConfig<TData>[]
  onFiltersChange: (filters: FacetedFilterConfig<TData>[]) => void
}

export function AppDataTableFilterOptions<TData>({
  availableFilters,
  activeFilters,
  onFiltersChange,
}: AppDataTableFilterOptionsProps<TData>) {
  const activeFilterKeys = new Set(
    activeFilters.map((f) => f.columnKey as string),
  )

  const handleToggleFilter = (filter: FacetedFilterConfig<TData>) => {
    const filterKey = filter.columnKey as string
    const isActive = activeFilterKeys.has(filterKey)

    if (isActive) {
      // Remove filter
      onFiltersChange(
        activeFilters.filter((f) => (f.columnKey as string) !== filterKey),
      )
    } else {
      // Add filter
      onFiltersChange([...activeFilters, filter])
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Filter className="mr-2 size-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableFilters.map((filter) => {
          const filterKey = filter.columnKey as string
          const isActive = activeFilterKeys.has(filterKey)

          return (
            <DropdownMenuCheckboxItem
              key={filterKey}
              className="capitalize"
              checked={isActive}
              onCheckedChange={() => handleToggleFilter(filter)}
            >
              {filter.title}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
