import type { DataTableConfig } from '@/components/web/common/app-table'
import { Group } from '@/types'

export const tableConfig: DataTableConfig<Group> = {
  emptyMessage: 'No groups found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    type: true,
    description: true,
    teamLeaderId: false,
    businessLineKey: false,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'groups-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter groups...',
  },

  facetedFilters: [
    {
      columnKey: 'type',
      title: 'Group Type',
      options: [
        { label: 'System', value: 'System' },
        { label: 'Custom', value: 'Custom' },
      ] as const,
    },
  ],

  loadingRowCount: 3,
  loadingColumnCount: 5,
  enableRowSelection: true,
} as const
