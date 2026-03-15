import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/case-subcategories/columns'
import { useCaseSubcategoriesQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/case-subcategories/table-config'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { CaseSubcategoriesStats } from '@/components/web/case-subcategories/case-subcategories-stats'
import { CaseSubcategoriesTableSelectionActions } from '@/components/web/case-subcategories/table-selection-actions'

export const Route = createFileRoute('/_esm/case-subcategories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()

  const { data: response, isLoading } = useCaseSubcategoriesQuery()

  const subcategoriesData = response || []

  return (
    <div className="space-y-4">
      <CaseSubcategoriesStats subcategories={subcategoriesData} />

      <AppDataTable
        columns={columns}
        data={subcategoriesData}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <CaseSubcategoriesTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={subcategoriesData}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/case-subcategories/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
