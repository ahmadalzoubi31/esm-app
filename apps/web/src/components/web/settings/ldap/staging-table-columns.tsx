import { ColumnDef } from '@tanstack/react-table'
import { LdapUserPreview } from '@/schemas/settings/ldap.schema'
import { Badge } from '@/components/ui/badge'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { Checkbox } from '@/components/ui/checkbox'

export const stagingTableColumns: ColumnDef<LdapUserPreview>[] = [
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
    accessorKey: 'dn',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="DN" />
    ),
    cell: ({ row }) => {
      return (
        <div
          className="max-w-[300px] truncate font-mono text-xs"
          title={row.getValue('dn')}
        >
          {row.getValue('dn')}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Username" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="First Name" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Last Name" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Email" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Phone" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'department',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Department" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'manager',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Manager" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Title" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'company',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Company" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Location" />
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'exists',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const exists = row.getValue('exists') as boolean
      return exists ? (
        <Badge variant="secondary">Existing</Badge>
      ) : (
        <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
      )
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(String(row.getValue(id)))
    },
  },
]
