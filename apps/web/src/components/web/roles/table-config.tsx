import type { DataTableConfig } from '@/components/web/common/app-table'
import { RoleSchema } from '@repo/shared'

export const tableConfig: DataTableConfig<RoleSchema> = {
  emptyMessage: 'No roles found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    description: true,
    permissionCount: true,
    userCount: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'roles-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter roles...',
  },

  facetedFilters: [],

  loadingRowCount: 3,
  loadingColumnCount: 6,
  enableRowSelection: true,
} as const
