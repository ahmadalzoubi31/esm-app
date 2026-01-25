import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import {
  Loader2,
  RefreshCw,
  Table,
  Badge,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export default function HistoryTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Synchronization History</CardTitle>
          <CardDescription>
            View the results of recent LDAP synchronization jobs.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          {syncMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Sync Now
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingHistory ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Ended At</TableHead>
                <TableHead>Users Synced</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No history available
                  </TableCell>
                </TableRow>
              ) : (
                historyData?.data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.status === 'SUCCESS' ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Success
                        </Badge>
                      ) : item.status === 'RUNNING' ? (
                        <Badge variant="secondary" className="animate-pulse">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />{' '}
                          Running
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="mr-1 h-3 w-3" /> Failed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(item.startedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {item.endedAt
                        ? new Date(item.endedAt).toLocaleString()
                        : '-'}
                    </TableCell>
                    <TableCell>{item.usersSynced}</TableCell>
                    <TableCell
                      className="max-w-[300px] truncate"
                      title={item.details || ''}
                    >
                      {item.details || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
