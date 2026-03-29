import { SlaTarget } from '@repo/shared'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityIcon, CheckCircleIcon, ClockIcon } from 'lucide-react'

interface SlaStatsProps {
  targets: SlaTarget[]
}

export function SlaStats({ targets }: SlaStatsProps) {
  const activeCount = targets.filter((t) => t.isActive).length
  const inactiveCount = targets.length - activeCount

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Targets</CardTitle>
          <ActivityIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{targets.length}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <CheckCircleIcon className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCount}</div>
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveCount}</div>
        </CardContent>
      </Card>
    </div>
  )
}
