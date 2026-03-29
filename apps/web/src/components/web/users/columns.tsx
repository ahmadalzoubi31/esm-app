import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, PhoneIcon, User as UserIcon } from 'lucide-react'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { TableCellViewer } from './cell-viewer'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { User } from '@/types'
import { formatDate } from '@/lib/format-date'

export const columns: ColumnDef<User>[] = [
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
          aria-label={`Select user ${row.original.username}`}
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
    accessorKey: 'displayName',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Display Name" />
    ),
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm">{row.original.username}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email
      return email ? (
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">No email</span>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const department = row.original.department
      const displayDepartment = department?.name
      return displayDepartment ? (
        <div className="flex items-center gap-2">
          <span className="text-sm">{displayDepartment}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">
          No department
        </span>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone
      return phone ? (
        <div className="flex items-center gap-2">
          <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{phone}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">
          ###-###-####
        </span>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'authSource',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Auth Source" />
    ),
    cell: ({ row }) => {
      const authSource = row.original.authSource

      return (
        <div className="w-32 text-base">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {authSource}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <div className="w-32 text-base">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {isActive ? (
              <CheckCircleIcon className="fill-green-500 dark:fill-green-400" />
            ) : (
              <XCircleIcon className="fill-red-500 dark:fill-red-400" />
            )}
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean
      return value.includes(String(isActive))
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'externalId',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="External ID" />
    ),
    cell: ({ row }) => {
      const externalId = row.original.externalId
      return externalId ? (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{externalId}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">-</span>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'lastLoginAt',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Last Login At" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">
        {row.original.lastLoginAt && formatDate(row.original.lastLoginAt)}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'isLicensed',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Is Licensed" />
    ),
    cell: ({ row }) => {
      const isLicensed = row.original.isLicensed
      return (
        <div className="w-32 text-base">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {isLicensed ? (
              <CheckCircleIcon className="fill-green-500 dark:fill-green-400" />
            ) : (
              <XCircleIcon className="fill-red-500 dark:fill-red-400" />
            )}
            {isLicensed ? 'Licensed' : 'Not Licensed'}
          </Badge>
        </div>
      )
    },
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
        {row.original.createdAt && formatDate(row.original.createdAt)}
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
        {row.original.updatedAt && formatDate(row.original.updatedAt)}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
]

export default columns
