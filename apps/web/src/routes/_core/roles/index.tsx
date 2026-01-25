import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/roles/columns'
import { useRolesQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/roles/table-config'

import { RolesTableSelectionActions } from '@/components/web/roles/table-selection-actions'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { RolesStats } from '@/components/web/roles/roles-stats'

export const Route = createFileRoute('/_core/roles/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()
  const { data: roles, isLoading } = useRolesQuery(
    advancedFilter ? JSON.stringify(advancedFilter) : undefined,
  )

  const roleData = roles?.data || []

  return (
    <div className="px-2 lg:px-3 py-4 space-y-4">
      <RolesStats roles={roleData} />

      <AppDataTable
        columns={columns}
        data={roleData}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <RolesTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={roleData}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/roles">
              {/* <Link to="/roles/create"> */}
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
