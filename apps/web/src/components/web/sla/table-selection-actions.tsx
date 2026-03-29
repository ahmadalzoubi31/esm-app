import { Table } from '@tanstack/react-table'
import { SlaTarget } from '@repo/shared'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { useDeleteSlaTargetMutation } from '@/lib/mutations'
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

interface SlaTableSelectionActionsProps {
  table: Table<SlaTarget>
}

export function SlaTableSelectionActions({
  table,
}: SlaTableSelectionActionsProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const deleteMutation = useDeleteSlaTargetMutation()

  const handleDelete = async () => {
    for (const row of selectedRows) {
      await deleteMutation.mutateAsync(row.original.id)
    }
    table.resetRowSelection()
  }

  if (selectedRows.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedRows.length} selected
      </span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {selectedRows.length} SLA target(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
