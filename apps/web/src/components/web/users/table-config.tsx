import type { DataTableConfig } from '@/components/web/common/app-table'
import { AuthSource, User } from '@/types'

export const tableConfig: DataTableConfig<User> = {
  emptyMessage: 'No users found.',

  defaultColumnVisibility: {
    id: false,
    displayName: true,
    username: true,
    email: true,
    department: true,
    phone: true,
    authSource: true,
    isActive: true,
    externalId: false,
    lastLoginAt: false,
    isLicensed: false,
    permissions: false,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'users-table-columns',

  searchFilter: {
    columnKey: 'username',
    placeholder: 'Filter users...',
  },

  facetedFilters: [
    {
      columnKey: 'authSource',
      title: 'Auth Source',
      options: [
        { label: 'Local', value: AuthSource.LOCAL },
        { label: 'LDAP', value: AuthSource.LDAP },
      ] as const,
    },
    {
      columnKey: 'status',
      title: 'Status',
      options: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
      ] as const,
    },
  ],

  loadingRowCount: 3,
  loadingColumnCount: 7,
  enableRowSelection: true,
} as const

