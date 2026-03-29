import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { FacetedFilterConfig } from './types'

interface AppDataTableFilterBuilderProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  activeFilters: FacetedFilterConfig<TData>[]
  onFiltersChange: (filters: FacetedFilterConfig<TData>[]) => void
  predefinedFilters?: FacetedFilterConfig<TData>[]
}

export function AppDataTableFilterBuilder<TData>({
  columns,
  data,
  activeFilters,
  onFiltersChange,
  predefinedFilters = [],
}: AppDataTableFilterBuilderProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

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
    const title =
      (column?.header as string) ||
      selectedColumn.charAt(0).toUpperCase() + selectedColumn.slice(1)

    const newFilter: FacetedFilterConfig<TData> = {
      columnKey: selectedColumn,
      title,
      options,
    }

    onFiltersChange([...activeFilters, newFilter])
    setSelectedColumn('')
    setSelectedOptions([])
    setIsOpen(false)
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
    <div className="flex items-center gap-2">
      {/* Active Filters with Remove Buttons */}
      {activeFilters.map((filter) => (
        <div
          key={filter.columnKey as string}
          className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm"
        >
          <span>{filter.title}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => handleRemoveFilter(filter.columnKey as string)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}

      {/* Add Filter Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="mr-2 h-4 w-4" />
            Add Filter
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Filter</DialogTitle>
            <DialogDescription>
              Select a column to create a filter for
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="column-select">Column</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger id="column-select">
                  <SelectValue placeholder="Select a column" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((col) => {
                    const key = (col.id as string) || ''
                    const title =
                      (col.header as string) ||
                      key.charAt(0).toUpperCase() + key.slice(1) ||
                      ''
                    return (
                      <SelectItem key={key} value={key || ''}>
                        {title}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedColumn && currentOptions.length > 0 && (
              <div className="space-y-2">
                <Label>
                  Filter Options ({currentOptions.length} available)
                </Label>
                <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                  <div className="text-sm text-muted-foreground mb-2">
                    All values will be available in the filter. You can select
                    specific values after adding the filter.
                  </div>
                  <div className="space-y-1">
                    {currentOptions.slice(0, 10).map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Checkbox checked={true} disabled />
                        <span>{option.label}</span>
                      </div>
                    ))}
                    {currentOptions.length > 10 && (
                      <div className="text-xs text-muted-foreground pt-1">
                        ... and {currentOptions.length - 10} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedColumn && currentOptions.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No values found for this column in the current data.
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFilter}
              disabled={!selectedColumn || currentOptions.length === 0}
            >
              Add Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

