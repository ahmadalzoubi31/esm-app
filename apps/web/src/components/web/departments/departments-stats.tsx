import { Building2, UsersIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Department } from '@repo/shared'

interface DepartmentsStatsProps {
  departments: Department[]
}



export function DepartmentsStats({ departments }: DepartmentsStatsProps) {
  const totalDepartments = departments.length
  const activeDepartments = departments.filter((d) => d.active).length

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Departments
          </CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDepartments}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Departments
          </CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeDepartments}</div>
        </CardContent>
      </Card>
      {/* Add more stats if needed */}
    </div>
  )
}
