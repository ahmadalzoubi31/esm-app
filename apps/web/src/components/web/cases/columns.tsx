import { ColumnDef } from '@tanstack/react-table'
import { AppDataTableColumnHeader } from '@/components/web/common/app-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CASE_PRIORITY_OPTIONS, CASE_STATUS_OPTIONS, CaseStatus } from '@/types'
import { GroupIcon, User2, UserIcon, Users, UsersIcon } from 'lucide-react'

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
    enableHiding: true,
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
    cell: ({ row }) => <div className="text-sm">{row.original.title}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm min-w-[300px] max-w-[300px] truncate cursor-help">
                {description}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[400px] p-0 overflow-hidden border shadow-lg">
              <div className="bg-muted px-3 py-1.5 border-b flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Full Description
                </span>
              </div>
              <div className="p-3 text-sm leading-relaxed whitespace-pre-wrap">
                {description}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
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
      const status = row.original.status
      return (
        <div className="w-32 text-base">
          {CASE_STATUS_OPTIONS.filter((option) => option.value === status).map(
            (option) => {
              const Icon = option.icon
              return (
                <Badge
                  key={option.value}
                  variant="outline"
                  className="text-muted-foreground px-1.5"
                >
                  <Icon className={option.color} />
                  {option.label}
                </Badge>
              )
            },
          )}
        </div>
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
        <div className="w-32 text-base">
          {CASE_PRIORITY_OPTIONS.filter(
            (option) => option.value === priority,
          ).map((option) => {
            const Icon = option.icon
            return (
              <Badge
                key={option.value}
                variant="outline"
                className="text-muted-foreground px-1.5"
              >
                <Icon className={option.color} />
                {option.label}
              </Badge>
            )
          })}
        </div>
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
    accessorKey: 'subCategory',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Sub Category" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.subCategory?.name || '-'}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'businessLine',
    header: ({ column }) => (
      <AppDataTableColumnHeader column={column} title="Business Line" />
    ),
    cell: ({ row }) => (
      <div className="text-sm">{row.original.businessLine?.name || '-'}</div>
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
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {r
              ? r.display_name ||
                `${r.first_name || ''} ${r.last_name || ''}`.trim()
              : '-'}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
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
          <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{assignmentGroup?.name || '-'}</span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
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
          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />

          <span className="text-sm">
            {assignee.display_name ||
              `${assignee.first_name} ${assignee.last_name}`}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">Unassigned</span>
      )
    },
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
