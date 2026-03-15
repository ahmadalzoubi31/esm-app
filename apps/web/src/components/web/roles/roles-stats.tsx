import { ShieldIcon, UsersIcon, LockIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Role } from '@/types/roles'

interface RolesStatsProps {
  roles: Role[]
}

export function RolesStats({ roles }: RolesStatsProps) {
  const totalRoles = roles.length
  const rolesWithUsers = roles.filter((r) => r.userCount > 0).length
  const rolesWithPermissions = roles.filter((r) => r.permissionCount > 0).length

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
          <ShieldIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRoles}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assigned Roles</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rolesWithUsers}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Permissions
          </CardTitle>
          <LockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rolesWithPermissions}</div>
        </CardContent>
      </Card>
    </div>
  )
}
