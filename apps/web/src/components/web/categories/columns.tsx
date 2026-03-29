import { ColumnDef } from '@tanstack/react-table'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Category } from '@/types'
import { TableCellViewer } from './cell-viewer'

export const columns: ColumnDef<Category>[] = [
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
          aria-label={`Select category ${row.original.name}`}
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
    accessorKey: 'tier',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Tier" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">{row.original.tier}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'parent',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Parent Category" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {row.original.parent ? row.original.parent.name : '-'}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'children',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Subcategories" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {row.original.children?.length || 0}
        </span>
      </div>
    ),
    enableSorting: false,
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
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
]

export default columns
