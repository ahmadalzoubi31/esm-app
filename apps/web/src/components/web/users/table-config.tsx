import type { DataTableConfig } from '@/components/web/common/app-table'
import { AuthSource, User } from '@/types'

export const tableConfig: DataTableConfig<User> = {
  emptyMessage: 'No users found.',

  defaultColumnVisibility: {
    id: false,
    display_name: true,
    username: true,
    email: true,
    department: true,
    phone: true,
    auth_source: true,
    is_active: true,
    external_id: false,
    last_login_at: false,
    is_licensed: false,
    permissions: false,
    createdAt: true,
    createdByName: false,
    updatedAt: false,
    updatedByName: false,
  },

  preferenceKey: 'users-table-columns',

  searchFilter: {
    columnKey: 'username',
    placeholder: 'Filter users...',
  },

  facetedFilters: [
    {
      columnKey: 'auth_source',
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
