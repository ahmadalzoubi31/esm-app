import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/case-categories/columns'
import { useCaseCategoriesQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/case-categories/table-config'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { CaseCategoriesStats } from '@/components/web/case-categories/case-categories-stats'
import { CaseCategoriesTableSelectionActions } from '@/components/web/case-categories/table-selection-actions'

export const Route = createFileRoute('/_esm/case-categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()
  
  // Note: search component will need advanced hook usage if filters are stringified, assuming same as users/departments
  const { data: response, isLoading } = useCaseCategoriesQuery()

  const categoriesData = response || []

  return (
    <div className="px-2 lg:px-3 py-4 space-y-4">
      <CaseCategoriesStats categories={categoriesData} />

      <AppDataTable
        columns={columns}
        data={categoriesData}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <CaseCategoriesTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={categoriesData}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/case-categories/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
