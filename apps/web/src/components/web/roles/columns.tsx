import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RoleSchema } from '@repo/shared'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { TableCellViewer } from './cell-viewer'

export const columns: ColumnDef<RoleSchema>[] = [
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
          aria-label={`Select role ${row.original.name}`}
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
    cell: ({ row }) => <TableCellViewer item={row.original} />,

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
    accessorKey: 'permissionCount',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Permissions" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{row.original.permissionCount}</Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'userCount',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="outline">{row.original.userCount}</Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.updatedAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
]

export default columns
