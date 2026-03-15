import { Button } from '@/components/ui/button'
import {
  FilterGroup,
  AppDataTable,
  AppDataTableAdvancedFilter,
} from '@/components/web/common/app-table'
import columns from '@/components/web/groups/columns'
import { tableConfig } from '@/components/web/groups/table-config'
import { GroupsTableSelectionActions } from '@/components/web/groups/table-selection-actions'
import { GroupsStats } from '@/components/web/groups/groups-stats'
import { useGroupsQuery } from '@/lib/queries'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_core/groups/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()
  const { data: groups, isLoading } = useGroupsQuery()

  return (
    <div className="space-y-4">
      <GroupsStats groups={groups || []} />

      <AppDataTable
        columns={columns}
        data={groups || []}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <GroupsTableSelectionActions table={table as any} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={groups || []}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/groups/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
