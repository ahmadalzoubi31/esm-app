import type { DataTableConfig } from '@/components/web/common/app-table'

export const tableConfig: DataTableConfig<any> = {
  emptyMessage: 'No departments found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    description: true,
    active: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'departments-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter departments...',
  },

  facetedFilters: [],

  loadingRowCount: 3,
  loadingColumnCount: 6,
  enableRowSelection: true,
} as const
