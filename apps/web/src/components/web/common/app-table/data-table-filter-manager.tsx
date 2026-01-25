import { useState } from 'react'
import { Filter, GripVertical, Plus, X } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FacetedFilterConfig } from './types'

interface AppDataTableFilterManagerProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  activeFilters: FacetedFilterConfig<TData>[]
  onFiltersChange: (filters: FacetedFilterConfig<TData>[]) => void
  predefinedFilters?: FacetedFilterConfig<TData>[]
}

export function AppDataTableFilterManager<TData>({
  columns,
  data,
  activeFilters,
  onFiltersChange,
  predefinedFilters = [],
}: AppDataTableFilterManagerProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>('')

  // Helper to get column title from column definition
  const getColumnTitle = (col: ColumnDef<TData>): string => {
    // Check if header is a string
    if (typeof col.header === 'string') {
      return col.header
    }

    // Check meta property for title
    if (col.meta && typeof col.meta === 'object' && 'title' in col.meta) {
      return String(col.meta.title)
    }

    // For function headers, try to extract from common patterns
    // Most columns use DataTableColumnHeader with a title prop
    // We'll use the accessorKey/id as fallback
    const key = (col.id as string) || ''

    // Format the key nicely (e.g., "createdAt" -> "Created At")
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim()
  }

  // Get filterable columns (columns with accessorKey or id, excluding select column)
  const filterableColumns = columns.filter((col) => {
    const key = (col.id as string) || ''
    return key && key !== 'select' && key !== 'actions'
  })

  // Get available columns that aren't already filtered
  const activeFilterKeys = new Set(
    activeFilters.map((f) => f.columnKey as string),
  )
  const availableColumns = filterableColumns.filter((col) => {
    const key = (col.id as string) || ''
    return !activeFilterKeys.has(key)
  })

  // Get unique values for a column
  const getUniqueValues = (
    columnKey: string,
  ): Array<{ label: string; value: string }> => {
    const values = new Map<string, string>() // Map value -> display label

    data.forEach((row: any) => {
      const value = row[columnKey]
      if (value !== null && value !== undefined && value !== '') {
        let displayValue: string
        let filterValue: string

        // Handle nested objects (e.g., requester.displayName)
        if (typeof value === 'object' && !Array.isArray(value)) {
          displayValue =
            value.displayName ||
            value.name ||
            value.email ||
            value.title ||
            String(value.id || '')
          filterValue =
            value.id || value.key || displayValue || JSON.stringify(value)
        } else if (Array.isArray(value)) {
          // For arrays, use the first item or join
          displayValue = value.length > 0 ? String(value[0]) : ''
          filterValue = displayValue
        } else {
          displayValue = String(value)
          filterValue = displayValue
        }

        if (displayValue && filterValue) {
          values.set(filterValue, displayValue)
        }
      }
    })

    return Array.from(values.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ label, value }))
  }

  // Check if column has predefined options
  const getPredefinedOptions = (columnKey: string) => {
    return predefinedFilters.find((f) => f.columnKey === columnKey)?.options
  }

  // Handle adding a new filter
  const handleAddFilter = () => {
    if (!selectedColumn) return

    const predefined = getPredefinedOptions(selectedColumn)
    const options = predefined || getUniqueValues(selectedColumn)

    if (options.length === 0) {
      alert(
        'No values found for this column. Please select a different column.',
      )
      return
    }

    // Get column title from column definition
    const column = filterableColumns.find(
      (col) => ((col.id as string) || '') === selectedColumn,
    )
    const title = column
      ? getColumnTitle(column)
      : selectedColumn.charAt(0).toUpperCase() + selectedColumn.slice(1)

    const newFilter: FacetedFilterConfig<TData> = {
      columnKey: selectedColumn,
      title,
      options: Array.isArray(options) ? options : [],
    }

    onFiltersChange([...activeFilters, newFilter])
    setSelectedColumn('')
  }

  // Handle removing a filter
  const handleRemoveFilter = (columnKey: string) => {
    onFiltersChange(activeFilters.filter((f) => f.columnKey !== columnKey))
  }

  // Get options for selected column
  const currentOptions = selectedColumn
    ? getPredefinedOptions(selectedColumn) || getUniqueValues(selectedColumn)
    : []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilters.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Manage Filters</DialogTitle>
          <DialogDescription>
            Add or remove filters to customize your table view
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Active Filters */}
          <div className="space-y-2">
            <Label>Active Filters ({activeFilters.length})</Label>
            {activeFilters.length > 0 ? (
              <ScrollArea className="h-48 rounded-md border p-3">
                <div className="space-y-2">
                  {activeFilters.map((filter) => (
                    <div
                      key={filter.columnKey as string}
                      className="flex items-center justify-between rounded-md border bg-muted/50 p-2"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">
                            {filter.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {filter.options?.length || 0} options
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          handleRemoveFilter(filter.columnKey as string)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                No filters active. Add a filter below to get started.
              </div>
            )}
          </div>

          {/* Add New Filter */}
          <div className="space-y-4 border-t pt-4">
            <Label>Add New Filter</Label>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="column-select">Select Column</Label>
                <Select
                  value={selectedColumn}
                  onValueChange={setSelectedColumn}
                >
                  <SelectTrigger id="column-select">
                    <SelectValue placeholder="Choose a column to filter" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.length > 0 ? (
                      availableColumns.map((col) => {
                        const key = (col.id as string) || ''
                        const title = getColumnTitle(col)
                        return (
                          <SelectItem key={key} value={key}>
                            {title}
                          </SelectItem>
                        )
                      })
                    ) : (
                      <SelectItem value="none" disabled>
                        No more columns available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedColumn && currentOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>
                    Filter Options ({currentOptions.length} available)
                  </Label>
                  <ScrollArea className="h-40 rounded-md border p-3">
                    <div className="text-sm text-muted-foreground mb-2">
                      All values will be available in the filter dropdown. You
                      can select specific values after adding the filter.
                    </div>
                    <div className="space-y-1">
                      {currentOptions.slice(0, 20).map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 text-sm py-1"
                        >
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{option.label}</span>
                        </div>
                      ))}
                      {currentOptions.length > 20 && (
                        <div className="text-xs text-muted-foreground pt-2">
                          ... and {currentOptions.length - 20} more options
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {selectedColumn && currentOptions.length === 0 && (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No values found for this column in the current data.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button
            onClick={handleAddFilter}
            disabled={!selectedColumn || currentOptions.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
