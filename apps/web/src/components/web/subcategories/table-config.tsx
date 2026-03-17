import type { DataTableConfig } from '@/components/web/common/app-table'
import { Subcategory } from '@/types'

export const tableConfig: DataTableConfig<Subcategory> = {
  emptyMessage: 'No subcategories found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    description: true,
    category: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'subcategories-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter subcategories...',
  },

  facetedFilters: [],

  loadingRowCount: 3,
  loadingColumnCount: 4,
  enableRowSelection: true,
} as const
