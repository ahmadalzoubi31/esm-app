import { ColumnDef } from '@tanstack/react-table'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const columns: ColumnDef<any>[] = [
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
          aria-label={`Select case ${row.original.number}`}
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
    accessorKey: 'number',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => {
      return (
        <Link to="/cases/$caseId" params={{ caseId: row.original.id }}>
          <Button
            variant="link"
            className="font-medium hover:underline text-primary whitespace-nowrap w-fit px-0 text-left"
          >
            {row.original.number}
          </Button>
        </Link>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="font-medium truncate max-w-[250px]">
        {row.original.description}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {status}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority
      return (
        <Badge
          variant={priority === 'CRITICAL' ? 'destructive' : 'secondary'}
          className="whitespace-nowrap"
        >
          {priority}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.category?.name || '-'}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'requester',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Requester" />
    ),
    cell: ({ row }) => {
      const r = row.original.requester
      return (
        <div className="text-sm">
          {r ? `${r.first_name} ${r.last_name}` : '-'}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'assignmentGroup',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Assignment Group" />
    ),
    cell: ({ row }) => {
      const assignmentGroup = row.original.assignmentGroup
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{assignmentGroup.name}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'assignee',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee

      return assignee ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{assignee}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">Unassigned</span>
      )
    },
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
