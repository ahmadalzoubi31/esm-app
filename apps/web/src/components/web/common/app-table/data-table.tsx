import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { applyAdvancedFilter } from '@/lib/filters/utils'
import { AppDataTablePagination } from './data-table-pagination'
import { AppDataTableToolbar } from './data-table-toolbar'
import { AppDataTableLoading } from './data-table-loading'
import { DataTableConfig, FilterGroup } from './types'
import { useTableColumnPreferences } from '@/hooks/use-table-column-preferences'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
  config?: DataTableConfig<TData>
  advancedFilter?: FilterGroup<TData>
  renderSelectionActions?: (table: TanstackTable<TData>) => React.ReactNode
  renderToolbarActions?: (table: TanstackTable<TData>) => React.ReactNode
  renderLeftActions?: (table: TanstackTable<TData>) => React.ReactNode
}

export function AppDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  config,
  advancedFilter,
  renderSelectionActions,
  renderToolbarActions,
  renderLeftActions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const defaultVisibility = config?.defaultColumnVisibility || {}
  const { columnVisibility, setColumnVisibility } = useTableColumnPreferences({
    preferenceKey: config?.preferenceKey,
    defaultVisibility,
  })
  const [sorting, setSorting] = React.useState<SortingState>([])
  // Apply advanced filter to data
  const filteredData = React.useMemo(() => {
    if (advancedFilter) {
      return applyAdvancedFilter(data, advancedFilter)
    }
    return data
  }, [data, advancedFilter])

  const [pageSize] = React.useState<number>(() => {
    if (typeof window === 'undefined') return 10
    const stored = localStorage.getItem('app-table-page-size')
    return stored ? Number(stored) : 10
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility: columnVisibility ?? config?.defaultColumnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (updater) => {
      setTimeout(() => setColumnVisibility(updater), 0)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      <AppDataTableToolbar
        table={table}
        config={config}
        renderSelectionActions={renderSelectionActions}
        renderToolbarActions={renderToolbarActions}
        renderLeftActions={renderLeftActions}
      />
      <div className="rounded-md border">
        <Table>
          {/* <TableHeader className="bg-muted sticky top-0 z-10"> */}
          <TableHeader className="bg-muted ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AppDataTableLoading
                columnCount={config?.loadingColumnCount || 0}
                rowCount={config?.loadingRowCount}
              />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="h-4"
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-4 py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-4 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <AppDataTablePagination table={table} />
    </div>
  )
}
