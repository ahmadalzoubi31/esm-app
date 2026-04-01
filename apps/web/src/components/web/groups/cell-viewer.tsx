import { CellViewer } from '@/components/web/common/cell-viewer'
import { DetailItem } from '@/components/web/common/cell-viewer-detail-item'
import { Link } from '@tanstack/react-router'
import { GroupSchema } from '@repo/shared'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format-date'
import { UsersIcon, ShieldIcon, CalendarIcon, KeyIcon, LockIcon } from 'lucide-react'

export function TableCellViewer({ item }: { item: GroupSchema }) {
  return (
    <CellViewer
      triggerLabel={item.name}
      icon={
        <Avatar className="h-10 w-10 border">
          <AvatarFallback className="bg-primary/10 text-primary">
            <UsersIcon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      }
      title={item.name}
      description={`${item.type} Group`}
      editAction={
        <Link to={`/groups/$groupId`} params={{ groupId: item.id }}>
          Edit Group
        </Link>
      }
    >
      {/* Group Information */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ShieldIcon className="h-4 w-4 text-muted-foreground" />
          Group Information
        </h4>
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="Name" value={item.name} />
          <DetailItem label="Type">
            <Badge
              variant="outline"
              className="capitalize h-5 px-1.5 text-[10px]"
            >
              {item.type}
            </Badge>
          </DetailItem>
          <DetailItem
            className="col-span-2"
            label="Description"
            value={item.description}
          />
          <DetailItem
            label="Team Leader"
            value={
              item.teamLeader?.displayName || item.teamLeader?.username || '-'
            }
          />
          <DetailItem
            label="Business Line"
            value={item.businessLine?.name || '-'}
          />
        </div>
      </section>

      <Separator />

      {/* Members */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          Members
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {item.users && item.users.length > 0 ? (
            item.users.map((user) => (
              <Badge
                key={user.id}
                variant="secondary"
                className="h-5 px-1.5 text-[10px]"
              >
                {user.displayName || user.username}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No members in this group.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Roles */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <KeyIcon className="h-4 w-4 text-muted-foreground" />
          Roles
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {item.roles && item.roles.length > 0 ? (
            item.roles.map((role) => (
              <Badge
                key={role.id}
                variant="secondary"
                className="h-5 px-1.5 text-[10px]"
              >
                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No roles assigned.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Permissions */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LockIcon className="h-4 w-4 text-muted-foreground" />
          Permissions
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {item.permissions && item.permissions.length > 0 ? (
            item.permissions.map((permission) => (
              <Badge
                key={permission.id}
                variant="outline"
                className="h-5 px-1.5 text-[10px]"
              >
                {permission.key}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No permissions assigned directly.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* System Data */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          System Data
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <DetailItem label="Created At" value={formatDate(item.createdAt)} />
          <DetailItem label="Updated At" value={formatDate(item.updatedAt)} />
        </div>
      </section>
    </CellViewer>
  )
}
