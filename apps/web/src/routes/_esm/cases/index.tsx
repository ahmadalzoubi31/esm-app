import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/cases/columns'
import { useCasesQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/cases/table-config'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { CasesStats } from '@/components/web/cases/cases-stats'
import { CasesTableSelectionActions } from '@/components/web/cases/table-selection-actions'

export const Route = createFileRoute('/_esm/cases/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()

  const { data: cases, isLoading } = useCasesQuery()

  return (
    <div className="space-y-4">
      <CasesStats cases={cases || []} />

      <AppDataTable
        columns={columns}
        data={cases || []}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <CasesTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={cases || []}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/cases/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
