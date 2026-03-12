import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import { useDeleteBulkCaseSubcategoriesMutation } from '@/lib/mutations'
import { toast } from 'sonner'
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
import { useState } from 'react'

interface CaseSubcategoriesTableSelectionActionsProps<TData> {
  table: Table<TData>
}

export function CaseSubcategoriesTableSelectionActions<TData>({
  table,
}: CaseSubcategoriesTableSelectionActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const deleteBulkMutation = useDeleteBulkCaseSubcategoriesMutation()
  const [isDeleting, setIsDeleting] = useState(false)

  if (selectedRows.length === 0) return null

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const ids = selectedRows.map((row) => (row.original as any).id)
      await deleteBulkMutation.mutateAsync(ids)
      table.toggleAllRowsSelected(false)
    } catch (error) {
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-muted-foreground mr-2 border-r pr-4">
        {selectedRows.length} selected
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isDeleting}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedRows.length} case subcategories.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
