import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/departments/columns'
import { useDepartmentsQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/departments/table-config'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { DepartmentsStats } from '@/components/web/departments/departments-stats'
import { DepartmentsTableSelectionActions } from '@/components/web/departments/table-selection-actions'

export const Route = createFileRoute('/_core/departments/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()
  const { data: departmentsResponse, isLoading } = useDepartmentsQuery(
    advancedFilter ? JSON.stringify(advancedFilter) : undefined,
  )

  const departmentData = departmentsResponse?.data || []

  return (
    <div className="px-2 lg:px-3 py-4 space-y-4">
      <DepartmentsStats departments={departmentData} />

      <AppDataTable
        columns={columns}
        data={departmentData}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <DepartmentsTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={departmentData}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/departments/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
