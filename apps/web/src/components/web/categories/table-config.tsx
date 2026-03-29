import type { DataTableConfig } from '@/components/web/common/app-table'
import { Category } from '@/types'

export const tableConfig: DataTableConfig<Category> = {
  emptyMessage: 'No categories found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    description: true,
    tier: true,
    parent: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'categories-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter categories...',
  },

  facetedFilters: [
    {
      columnKey: 'tier',
      title: 'Tier',
      options: [
        { label: 'Tier 1', value: '1' },
        { label: 'Tier 2', value: '2' },
        { label: 'Tier 3', value: '3' },
      ] as const,
    },
  ],

  loadingRowCount: 3,
  loadingColumnCount: 3,
  enableRowSelection: true,
} as const
