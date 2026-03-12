import type { DataTableConfig } from '@/components/web/common/app-table/types'

export const tableConfig: DataTableConfig<any> = {
  preferenceKey: 'case-subcategories-table-state',
  emptyMessage: 'No case subcategories found',
  searchFilter: {
    columnKey: 'name',
    placeholder: 'Search case subcategories...',
  },
  enableRowSelection: true,
}
