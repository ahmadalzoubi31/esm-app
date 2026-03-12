import type { DataTableConfig } from '@/components/web/common/app-table/types'

export const tableConfig: DataTableConfig<any> = {
  preferenceKey: 'case-categories-table-state',
  emptyMessage: 'No case categories found',
  searchFilter: {
    columnKey: 'name',
    placeholder: 'Search case categories...',
  },
  enableRowSelection: true,
}
