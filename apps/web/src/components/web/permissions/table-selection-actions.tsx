import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { TrashIcon, CopyIcon, DownloadIcon } from 'lucide-react'

interface PermissionsTableSelectionActionsProps<TData> {
  table: Table<TData>
}

export function PermissionsTableSelectionActions<TData>({
  table,
}: PermissionsTableSelectionActionsProps<TData>) {
  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8">
        <TrashIcon className="mr-2 size-4" />
        Delete {selectedCount} row{selectedCount !== 1 ? 's' : ''}
      </Button>
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
