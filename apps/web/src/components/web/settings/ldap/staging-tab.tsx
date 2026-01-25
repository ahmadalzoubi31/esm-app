import { Card, CardContent, CardHeader } from '@/components/ui/card'
import TabTitle from './tab-title'
import { Button } from '@/components/ui/button'
import { EyeIcon, Loader2, RefreshCw } from 'lucide-react'
import { useLdapSyncMutation, useLdapPreviewMutation } from '@/lib/mutations'
import { useLdapSyncStatusQuery, ldapKeys } from '@/lib/queries/ldap.query'
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AppDataTable } from '@/components/web/common/app-table'
import { stagingTableColumns } from './staging-table-columns'

export default function StagingTab() {
  const [syncJobId, setSyncJobId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const syncMutation = useLdapSyncMutation()
  const previewMutation = useLdapPreviewMutation()
  const syncStatusQuery = useLdapSyncStatusQuery(syncJobId)

  // Monitor sync status and invalidate users when complete
  useEffect(() => {
    if (syncStatusQuery.data?.data?.status === 'completed') {
      toast.success('LDAP Sync Completed', {
        description: 'User data has been updated.',
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ldapKeys.history() })
      setSyncJobId(null) // Stop polling
    } else if (syncStatusQuery.data?.data?.status === 'failed') {
      toast.error('LDAP Sync Failed', {
        description:
          syncStatusQuery.data?.data?.error || 'Unknown error occurred.',
      })
      setSyncJobId(null) // Stop polling
    }
  }, [syncStatusQuery.data?.data?.status, queryClient])

  async function onSync() {
    const result = await syncMutation.mutateAsync()
    if (result.data.jobId) {
      setSyncJobId(result.data.jobId)
    }
  }

  async function onPreview() {
    // Empty object implies using saved config on backend
    await previewMutation.mutateAsync({})
  }

  const isSyncing = syncMutation.isPending || !!syncJobId
  const previewUsers = previewMutation.data?.data || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <TabTitle
          title="Staging Preview"
          description="Preview users found in LDAP based on current configuration."
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPreview}
            size="sm"
            disabled={previewMutation.isPending || isSyncing}
          >
            {previewMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <EyeIcon className="mr-2 h-5 w-5" />
            Preview
          </Button>
          <Button
            variant="default"
            onClick={onSync}
            size="sm"
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {!!syncJobId ? 'Syncing...' : 'Start Sync'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!!syncJobId && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sync Status:</span>
              <Badge variant="outline" className="capitalize">
                {syncStatusQuery.data?.data?.status || 'Initiating...'}
              </Badge>
            </div>
            {syncStatusQuery.data?.data?.progress !== undefined && (
              <Progress value={syncStatusQuery.data.data.progress} />
            )}
          </div>
        )}

        <AppDataTable
          columns={stagingTableColumns}
          data={previewUsers}
          isLoading={previewMutation.isPending}
          config={{
            defaultColumnVisibility: {
              manager: false,
              title: false,
              company: false,
              location: false,
            },
            searchFilter: {
              placeholder: 'Filter by username...',
              columnKey: 'username',
            },
          }}
        />
      </CardContent>
    </Card>
  )
}
