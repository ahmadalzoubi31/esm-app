import { XIcon } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppDataTableViewOptions } from './data-table-view-options'
import { AppDataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableConfig } from './types'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  config?: DataTableConfig<TData>
  renderSelectionActions?: (table: Table<TData>) => React.ReactNode
  renderToolbarActions?: (table: Table<TData>) => React.ReactNode
  renderLeftActions?: (table: Table<TData>) => React.ReactNode
}

export function AppDataTableToolbar<TData>({
  table,
  config,
  renderSelectionActions,
  renderToolbarActions,
  renderLeftActions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const searchFilter = config?.searchFilter
  const facetedFilters = config?.facetedFilters || []
  const hasSelection = table.getSelectedRowModel().rows.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {hasSelection && renderSelectionActions ? (
          renderSelectionActions(table)
        ) : (
          <>
            {searchFilter && (
              <Input
                placeholder={searchFilter.placeholder}
                value={
                  (table
                    .getColumn(searchFilter.columnKey as string)
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table
                    .getColumn(searchFilter.columnKey as string)
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
            )}

            {renderLeftActions && renderLeftActions(table)}

            {facetedFilters.map((filterConfig) => {
              const columnKey = filterConfig.columnKey as string
              if (!columnKey) return null

              const column = table.getColumn(columnKey)
              if (!column) return null

              return (
                <AppDataTableFacetedFilter
                  key={columnKey}
                  column={column}
                  title={filterConfig.title}
                  options={filterConfig.options}
                />
              )
            })}

            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 lg:px-3"
              >
                Reset
                <XIcon className="ml-2 size-4" />
              </Button>
            )}
          </>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {renderToolbarActions && renderToolbarActions(table)}
        <AppDataTableViewOptions table={table} />
      </div>
    </div>
  )
}
