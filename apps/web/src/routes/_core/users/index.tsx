import { Button } from '@/components/ui/button'
import {
  FilterGroup,
  AppDataTable,
  AppDataTableAdvancedFilter,
} from '@/components/web/common/app-table'
import columns from '@/components/web/users/columns'
import { tableConfig } from '@/components/web/users/table-config'
import { UsersTableSelectionActions } from '@/components/web/users/table-selection-actions'
import { UsersStats } from '@/components/web/users/users-stats'
import { useUsersQuery } from '@/lib/queries'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_core/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()
  const { data: users, isLoading } = useUsersQuery()

  return (
    <div className="space-y-4">
      <UsersStats users={users || []} />

      <AppDataTable
        columns={columns}
        data={users || []}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderSelectionActions={(table) => (
          <UsersTableSelectionActions table={table} />
        )}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={users || []}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
        renderToolbarActions={() => (
          <Button variant="default" size="sm" asChild>
            <Link to="/users/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        )}
      />
    </div>
  )
}
