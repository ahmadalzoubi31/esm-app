import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { DepartmentSchema } from '@repo/shared'
import { formatDate } from '@/lib/format-date'
import { format } from 'path/win32'

export const columns: ColumnDef<DepartmentSchema>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select department ${row.original.name}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="flex space-x-2">{row.original.id}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm truncate max-w-[300px]">
        {row.original.description || '-'}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.isActive ? (
          <CheckCircleIcon className="fill-green-500 dark:fill-green-400" />
        ) : (
          <XCircleIcon className="fill-red-500 dark:fill-red-400" />
        )}
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {formatDate(new Date(row.original.createdAt))}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
]

export default columns
