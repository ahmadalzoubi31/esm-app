import type { DataTableConfig } from '@/components/web/common/app-table'
import { Permission } from '@/types'

export const tableConfig: DataTableConfig<Permission> = {
  emptyMessage: 'No permissions found.',

  defaultColumnVisibility: {
    id: false,
    key: true,
    category: true,
    subject: true,
    action: true,
    description: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'permissions-table-columns',

  searchFilter: {
    columnKey: 'key',
    placeholder: 'Filter permissions...',
  },

  facetedFilters: [],

  loadingRowCount: 3,
  loadingColumnCount: 7,
  enableRowSelection: false,
} as const
