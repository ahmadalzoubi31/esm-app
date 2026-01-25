import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AppDataTable } from '@/components/web/common/app-table/data-table'
import { AppDataTableAdvancedFilter } from '@/components/web/common/app-table'
import type { FilterGroup } from '@/components/web/common/app-table/types'
import columns from '@/components/web/permissions/columns'
import { usePermissionsQuery } from '@/lib/queries'
import { tableConfig } from '@/components/web/permissions/table-config'
import { PermissionsStats } from '@/components/web/permissions/permissions-stats'

export const Route = createFileRoute('/_core/permissions/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<any> | undefined
  >()
  const { data: permissions, isLoading } = usePermissionsQuery(
    advancedFilter ? JSON.stringify(advancedFilter) : undefined,
  )

  const permissionData = permissions?.data || []

  return (
    <div className="px-2 lg:px-3 py-4 space-y-4">
      <PermissionsStats permissions={permissionData} />

      <AppDataTable
        columns={columns}
        data={permissionData}
        isLoading={isLoading}
        config={tableConfig}
        advancedFilter={advancedFilter}
        renderLeftActions={() => (
          <AppDataTableAdvancedFilter
            columns={columns}
            data={permissionData}
            activeFilter={advancedFilter}
            onFilterChange={setAdvancedFilter}
          />
        )}
      />
    </div>
  )
}
