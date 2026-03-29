import {
  UsersIcon,
  FolderOpenIcon,
  ShieldIcon,
  ServerIcon,
  DatabaseIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Group } from '@repo/shared'

interface GroupsStatsProps {
  groups: Group[]
}

export function GroupsStats({ groups }: GroupsStatsProps) {
  const totalGroups = groups.length

  return (
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGroups}</div>
        </CardContent>
      </Card>
    </div>
  )
}
