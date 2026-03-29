import type { DataTableConfig } from '@/components/web/common/app-table'
import { SlaTarget } from '@repo/shared'

export const tableConfig: DataTableConfig<SlaTarget> = {
  emptyMessage: 'No SLA targets found.',

  defaultColumnVisibility: {
    id: false,
    name: true,
    key: true,
    goalMs: true,
    rules: false,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'sla-targets-table-columns',

  searchFilter: {
    columnKey: 'name',
    placeholder: 'Filter SLA targets...',
  },

  facetedFilters: [],

  loadingRowCount: 3,
  loadingColumnCount: 7,
  enableRowSelection: true,
} as const
