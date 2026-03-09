import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { TrashIcon, CopyIcon, DownloadIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useDeleteBulkRolesMutation } from '@/lib/mutations'

interface RolesTableSelectionActionsProps<TData> {
  table: Table<TData>
}

export function RolesTableSelectionActions<TData>({
  table,
}: RolesTableSelectionActionsProps<TData & { id: string }>) {
  const deleteBulkMutation = useDeleteBulkRolesMutation()
  const selectedCount = table.getSelectedRowModel().rows.length

  const handleDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)
    await deleteBulkMutation.mutateAsync(ids)
    table.resetRowSelection()
  }
  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <TrashIcon className="mr-2 size-4" />
            Delete {selectedCount} row{selectedCount !== 1 ? 's' : ''}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              <span className="font-medium text-destructive">
                {selectedCount}
              </span>{' '}
              selected role{selectedCount !== 1 ? 's' : ''} and remove their
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-destructive-foreground hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button variant="outline" size="sm" className="h-8">
        Copy
        <CopyIcon className="ml-2 size-4" />
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        Export
        <DownloadIcon className="ml-2 size-4" />
      </Button>
    </div>
  )
}
