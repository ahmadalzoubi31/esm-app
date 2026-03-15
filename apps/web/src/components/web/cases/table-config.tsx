import type { DataTableConfig } from '@/components/web/common/app-table/types'
import { CaseStatus } from '@/types'

export const tableConfig: DataTableConfig<any> = {
  emptyMessage: 'No cases found',

  defaultColumnVisibility: {
    id: false,
    number: true,
    title: true,
    description: false,
    status: true,
    priority: true,
    category: true,
    subcategory: false,
    businessLine: false,
    requester: true,
    assignee: true,
    assignmentGroup: true,
    createdAt: true,
    updatedAt: false,
  },

  preferenceKey: 'cases-table-state',

  searchFilter: {
    columnKey: 'title',
    placeholder: 'Search cases...',
  },

  facetedFilters: [
    {
      columnKey: 'status',
      title: 'Status',
      options: [
        { label: CaseStatus.NEW, value: CaseStatus.NEW },
        {
          label: CaseStatus.WAITING_FOR_APPROVAL,
          value: CaseStatus.WAITING_FOR_APPROVAL,
        },
        { label: CaseStatus.IN_PROGRESS, value: CaseStatus.IN_PROGRESS },
        { label: CaseStatus.PENDING, value: CaseStatus.PENDING },
        { label: CaseStatus.RESOLVED, value: CaseStatus.RESOLVED },
        { label: CaseStatus.CLOSED, value: CaseStatus.CLOSED },
      ] as const,
    },
    {
      columnKey: 'priority',
      title: 'Priority',
      options: [
        { label: 'Critical', value: 'CRITICAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Medium', value: 'MEDIUM' },
        { label: 'Low', value: 'LOW' },
      ] as const,
    },
  ],

  loadingRowCount: 3,
  loadingColumnCount: 10,
  enableRowSelection: true,
} as const
