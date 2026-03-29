import { ColumnDef } from '@tanstack/react-table'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/format-date'
import { TableCellViewer } from './cell-viewer'
import { SlaTarget } from '@repo/shared'

export const columns: ColumnDef<SlaTarget>[] = [
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
          aria-label={`Select SLA ${row.original.name}`}
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
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: 'goalMs',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Goal" />
    ),
    cell: ({ row }) => {
      const hours = row.original.goalMs / (1000 * 60 * 60)
      return (
        <div className="text-sm">
          {hours}h ({row.original.goalMs}ms)
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.updatedAt && formatDate(row.original.updatedAt)}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
]

export default columns
