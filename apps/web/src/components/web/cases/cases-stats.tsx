import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquareIcon, AlertCircleIcon, CheckCircle2Icon, BriefcaseIcon } from 'lucide-react'

interface CasesStatsProps {
  cases: any[]
}

export function CasesStats({ cases }: CasesStatsProps) {
  const ongoing = cases.filter(c => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length
  const critical = cases.filter(c => c.priority === 'CRITICAL').length
  const resolved = cases.filter(c => c.status === 'RESOLVED').length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
          <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cases.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
          <CheckSquareIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ongoing}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Priority</CardTitle>
          <AlertCircleIcon className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{critical}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          <CheckCircle2Icon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolved}</div>
        </CardContent>
      </Card>
    </div>
  )
}
