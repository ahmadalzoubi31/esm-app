import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/sla/columns'
import { useSlaTargetsQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/sla/table-config'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

import { SlaStats } from '@/components/web/sla/sla-stats'
import { SlaTableSelectionActions } from '@/components/web/sla/table-selection-actions'

export const Route = createFileRoute('/_core/sla/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()

  const { data: targets, isLoading } = useSlaTargetsQuery()

  return (
    <div className="space-y-4">
      <SlaStats targets={targets || []} />

      <AppDataTable
        columns={columns}
        data={targets || []}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <SlaTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={targets || []}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/sla/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
