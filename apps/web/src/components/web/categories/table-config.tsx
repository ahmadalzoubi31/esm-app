import type { DataTableConfig } from '@/components/web/common/app-table'
import { Category } from '@/types'

export const tableConfig: DataTableConfig<Category> = {
  emptyMessage: 'No categories found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    description: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'categories-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter categories...',
  },

  facetedFilters: [],

  loadingRowCount: 3,
  loadingColumnCount: 3,
  enableRowSelection: true,
} as const
