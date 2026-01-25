import { useState } from 'react'
import { Filter, Plus, X } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Separator } from '@/components/ui/separator'

import {
  FilterBookmark,
  FilterCondition,
  FilterGroup,
  FilterOperator,
} from './types'

interface AppDataTableAdvancedFilterProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  activeFilter?: FilterGroup<TData>
  onFilterChange: (filter: FilterGroup<TData> | undefined) => void
  bookmarks?: FilterBookmark<TData>[]
  onBookmarkSave?: (
    bookmark: Omit<FilterBookmark<TData>, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void
  onBookmarkDelete?: (bookmarkId: string) => void
  onBookmarkLoad?: (bookmark: FilterBookmark<TData>) => void
}

// Operator options based on field type - tailored for compact layout
const getOperatorsForField = (
  fieldType: 'text' | 'number' | 'date' | 'boolean' | 'array',
) => {
  const textOperators = [
    { value: FilterOperator.EQUALS, label: '=' },
    { value: FilterOperator.NOT_EQUALS, label: '!=' },
    { value: FilterOperator.CONTAINS, label: 'contains' },
    { value: FilterOperator.NOT_CONTAINS, label: 'not contains' },
    { value: FilterOperator.STARTS_WITH, label: 'starts with' },
    { value: FilterOperator.ENDS_WITH, label: 'ends with' },
    { value: FilterOperator.IS_EMPTY, label: 'is empty' },
    { value: FilterOperator.IS_NOT_EMPTY, label: 'is not empty' },
  ]

  const numberOperators = [
    { value: FilterOperator.EQUALS, label: '=' },
    { value: FilterOperator.NOT_EQUALS, label: '!=' },
    { value: FilterOperator.GREATER_THAN, label: '>' },
    { value: FilterOperator.LESS_THAN, label: '<' },
    { value: FilterOperator.GREATER_THAN_OR_EQUAL, label: '>=' },
    { value: FilterOperator.LESS_THAN_OR_EQUAL, label: '<=' },
    { value: FilterOperator.BETWEEN, label: 'between' },
  ]

  const dateOperators = [
    { value: FilterOperator.EQUALS, label: 'is' },
    { value: FilterOperator.NOT_EQUALS, label: 'is not' },
    { value: FilterOperator.GREATER_THAN, label: 'after' },
    { value: FilterOperator.LESS_THAN, label: 'before' },
    { value: FilterOperator.BETWEEN, label: 'between' },
  ]

  switch (fieldType) {
    case 'text':
      return textOperators
    case 'number':
      return numberOperators
    case 'date':
      return dateOperators
    case 'boolean':
      return [
        { value: FilterOperator.EQUALS, label: 'is' },
        { value: FilterOperator.NOT_EQUALS, label: 'is not' },
      ]
    case 'array':
      return [
        { value: FilterOperator.IN, label: 'in' },
        { value: FilterOperator.NOT_IN, label: 'not in' },
        { value: FilterOperator.IS_EMPTY, label: 'is empty' },
        { value: FilterOperator.IS_NOT_EMPTY, label: 'is not empty' },
      ]
    default:
      return textOperators
  }
}

// Detect field type from data
const detectFieldType = (
  data: any[],
  field: string,
): 'text' | 'number' | 'date' | 'boolean' | 'array' => {
  if (data.length === 0) return 'text'

  const sample = data[0]
  const value = (sample as any)[field]

  if (value === null || value === undefined) return 'text'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (Array.isArray(value)) return 'array'
  if (
    value instanceof Date ||
    (typeof value === 'string' && !isNaN(Date.parse(value)))
  )
    return 'date'
  return 'text'
}

export function AppDataTableAdvancedFilter<TData>({
  columns,
  data,
  activeFilter,
  onFilterChange,
}: AppDataTableAdvancedFilterProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterGroup, setFilterGroup] = useState<FilterGroup<TData>>(
    activeFilter || {
      id: 'root',
      conditions: [],
      logic: 'AND',
    },
  )

  // Helper to get column title
  const getColumnTitle = (col: ColumnDef<TData>): string => {
    if (typeof col.header === 'string') return col.header
    const key = ((col as any).accessorKey as string) || (col.id as string) || ''
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Get filterable columns
  const filterableColumns = columns.filter((col) => {
    const key = ((col as any).accessorKey as string) || (col.id as string) || ''
    return key && key !== 'select' && key !== 'actions'
  })

  // Add new condition
  const addCondition = () => {
    const firstCol = filterableColumns[0]
    const key =
      ((firstCol as any)?.accessorKey as string) ||
      (firstCol?.id as string) ||
      ''

    const newCondition: FilterCondition<TData> = {
      id: `condition-${Date.now()}`,
      field: key,
      operator: FilterOperator.EQUALS,
      value: '',
    }
    setFilterGroup({
      ...filterGroup,
      conditions: [...filterGroup.conditions, newCondition],
    })
  }

  // Update condition
  const updateCondition = (
    id: string,
    updates: Partial<FilterCondition<TData>>,
  ) => {
    setFilterGroup({
      ...filterGroup,
      conditions: filterGroup.conditions.map((cond) =>
        cond.id === id ? { ...cond, ...updates } : cond,
      ),
    })
  }

  // Remove condition
  const removeCondition = (id: string) => {
    setFilterGroup({
      ...filterGroup,
      conditions: filterGroup.conditions.filter((cond) => cond.id !== id),
    })
  }

  // Apply filter
  const applyFilter = () => {
    if (filterGroup.conditions.length === 0) {
      onFilterChange(undefined)
    } else {
      onFilterChange(filterGroup)
    }
    setIsOpen(false)
  }

  // Clear filter
  const clearFilter = () => {
    setFilterGroup({
      id: 'root',
      conditions: [],
      logic: 'AND',
    })
    onFilterChange(undefined)
  }

  // Get field type for a condition
  const getFieldType = (field: string) => {
    return detectFieldType(data, field)
  }

  // Check if operator needs value input
  const needsValue = (operator: FilterOperator) => {
    return ![FilterOperator.IS_EMPTY, FilterOperator.IS_NOT_EMPTY].includes(
      operator,
    )
  }

  // Check if operator needs second value (BETWEEN)
  const needsSecondValue = (operator: FilterOperator) => {
    return operator === FilterOperator.BETWEEN
  }

  const activeConditionsCount = filterGroup.conditions.length

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline" className="h-8">
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {activeConditionsCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeConditionsCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Match</span>
            <Select
              value={filterGroup.logic}
              onValueChange={(value: 'AND' | 'OR') =>
                setFilterGroup({ ...filterGroup, logic: value })
              }
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AND">All</SelectItem>
                <SelectItem value="OR">Any</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              of the following:
            </span>
          </div>

          <div className="space-y-4">
            {filterGroup.conditions.map((condition) => {
              const fieldType = getFieldType(condition.field as string)
              const operators = getOperatorsForField(fieldType)

              return (
                <div key={condition.id} className="flex items-center gap-2">
                  {/* Field */}
                  <div className="">
                    <Select
                      value={condition.field as string}
                      onValueChange={(value) =>
                        updateCondition(condition.id, {
                          field: value,
                          operator: FilterOperator.EQUALS,
                          value: '',
                        })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterableColumns.map((col) => {
                          const key =
                            ((col as any).accessorKey as string) ||
                            (col.id as string) ||
                            ''
                          return (
                            <SelectItem key={key} value={key}>
                              {getColumnTitle(col)}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operator */}
                  <div className="">
                    <Select
                      value={condition.operator}
                      onValueChange={(value: FilterOperator) =>
                        updateCondition(condition.id, { operator: value })
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value */}
                  <div className="flex-1 min-w-0">
                    {needsValue(condition.operator) && (
                      <div className="flex items-center gap-2">
                        <Input
                          type={
                            fieldType === 'number'
                              ? 'number'
                              : fieldType === 'date'
                                ? 'date'
                                : 'text'
                          }
                          className="h-8"
                          placeholder="Enter a value"
                          value={condition.value || ''}
                          onChange={(e) =>
                            updateCondition(condition.id, {
                              value: e.target.value,
                            })
                          }
                        />
                        {needsSecondValue(condition.operator) && (
                          <Input
                            type={
                              fieldType === 'number'
                                ? 'number'
                                : fieldType === 'date'
                                  ? 'date'
                                  : 'text'
                            }
                            className="h-8"
                            placeholder="Value 2"
                            value={condition.value2 || ''}
                            onChange={(e) =>
                              updateCondition(condition.id, {
                                value2: e.target.value,
                              })
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeCondition(condition.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed justify-start text-muted-foreground"
            onClick={addCondition}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add filter
          </Button>
        </div>

        <Separator />

        <div className="p-3 flex justify-between items-center bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            disabled={filterGroup.conditions.length === 0}
          >
            Clear
          </Button>
          <Button size="sm" onClick={applyFilter}>
            Apply filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
