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
    businessLineId: false,
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
        { label: 'Help Desk', value: 'help-desk' },
        { label: 'Tier 1', value: 'tier-1' },
        { label: 'Tier 2', value: 'tier-2' },
        { label: 'Vendor', value: 'vendor' },
      ] as const,
    },
  ],

  loadingRowCount: 3,
  loadingColumnCount: 5,
  enableRowSelection: true,
} as const
