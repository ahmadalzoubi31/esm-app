import { ColumnDef, VisibilityState } from '@tanstack/react-table'

/**
 * Filter operators for advanced filtering
 */
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  BETWEEN = 'between',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  IN = 'in',
  NOT_IN = 'not_in',
}

/**
 * Filter condition - a single filter rule
 */
export interface FilterCondition<TData> {
  id: string
  field: keyof TData | string
  operator: FilterOperator
  value: any
  value2?: any // For BETWEEN operator
}

/**
 * Filter group - can contain conditions and nested groups
 */
export interface FilterGroup<TData> {
  id: string
  conditions: FilterCondition<TData>[]
  groups?: FilterGroup<TData>[]
  logic: 'AND' | 'OR'
}

/**
 * Saved filter bookmark
 */
export interface FilterBookmark<TData> {
  id: string
  name: string
  description?: string
  filter: FilterGroup<TData>
  isDefault?: boolean
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Configuration for faceted filters in the toolbar
 */
export interface FacetedFilterConfig<TData> {
  columnKey: keyof TData | string
  title: string
  options: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
}

/**
 * Configuration for the search filter in the toolbar
 */
export interface SearchFilterConfig<TData> {
  columnKey: keyof TData | string
  placeholder: string
}

/**
 * Complete DataTable configuration
 */
export interface DataTableConfig<TData> {
  /**
   * Message to display when table is empty
   */
  emptyMessage?: string

  /**
   * Default column visibility state
   */
  defaultColumnVisibility?: VisibilityState

  /**
   * Unique key for storing user preferences in localStorage.
   * If provided, column visibility preferences will be saved per user.
   * Example: "cases-table-columns"
   */
  preferenceKey?: string

  /**
   * Configuration for the search filter
   */
  searchFilter?: SearchFilterConfig<TData>

  /**
   * Configuration for faceted filters
   */
  facetedFilters?: FacetedFilterConfig<TData>[]

  /**
   * Number of skeleton rows to show during loading (default: 10)
   */
  loadingRowCount?: number

  /**
   * Number of skeleton columns to show during loading (default: 8)
   */
  loadingColumnCount?: number

  /**
   * Enable row selection (default: true)
   */
  enableRowSelection?: boolean
}
