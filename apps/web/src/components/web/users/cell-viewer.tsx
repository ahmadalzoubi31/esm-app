import { CellViewer } from '@/components/web/common/cell-viewer'
import { DetailItem } from '@/components/web/common/cell-viewer-detail-item'
import { Link } from '@tanstack/react-router'
import { UserSchema } from '@repo/shared'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format-date'
import {
  UserIcon,
  MailIcon,
  ShieldIcon,
  CalendarIcon,
  KeyIcon,
  LockIcon,
  UsersIcon,
  DatabaseIcon,
} from 'lucide-react'

export function TableCellViewer({ item }: { item: UserSchema }) {
  const directPermissions = item.permissions || []

  const userRolePermissions =
    item.roles?.flatMap((role: any) => role.permissions || []) || []
  const groupRolePermissions =
    item.groups?.flatMap(
      (group: any) =>
        group.roles?.flatMap((role: any) => role.permissions || []) || [],
    ) || []
  const groupDirectPermissions =
    item.groups?.flatMap((group: any) => group.permissions || []) || []

  const directKeys = new Set(directPermissions.map((p) => p.key))

  const uniqueRoleInheritedMap = new Map()
  userRolePermissions.forEach((p: any) => {
    if (p && !directKeys.has(p.key)) {
      uniqueRoleInheritedMap.set(p.key, p)
    }
  })
  const inheritedFromRoles = Array.from(uniqueRoleInheritedMap.values())
  const roleInheritedKeys = new Set(inheritedFromRoles.map((p: any) => p.key))

  const uniqueGroupInheritedMap = new Map()
  ;[...groupDirectPermissions, ...groupRolePermissions].forEach((p: any) => {
    if (p && !directKeys.has(p.key) && !roleInheritedKeys.has(p.key)) {
      uniqueGroupInheritedMap.set(p.key, p)
    }
  })
  const inheritedFromGroups = Array.from(uniqueGroupInheritedMap.values())

  return (
    <CellViewer
      triggerLabel={item.displayName || item.username}
      icon={
        <Avatar className="h-10 w-10 border">
          <AvatarImage
            src={item.avatar}
            alt={item.displayName || item.username}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            <UserIcon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      }
      title={item.displayName || item.username}
      description={
        <>
          <MailIcon className="h-3.5 w-3.5" />
          {item.email}
        </>
      }
      editAction={
        <Link to={`/users/$userId`} params={{ userId: item.id }}>
          Edit User
        </Link>
      }
    >
      {/* Account Information */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ShieldIcon className="h-4 w-4 text-muted-foreground" />
          Account Information
        </h4>
        <div className="grid grid-cols-3 gap-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="Username" value={item.username} />
          <DetailItem label="Auth Type">
            <Badge
              variant="outline"
              className="capitalize h-5 px-1.5 text-[10px]"
            >
              {item.authSource}
            </Badge>
          </DetailItem>
          <DetailItem label="Status">
            <Badge
              variant={item.isActive ? 'secondary' : 'destructive'}
              className={`h-5 px-1.5 text-[10px] ${
                item.isActive
                  ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                  : ''
              }`}
            >
              {item.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </DetailItem>
          <DetailItem label="External ID" value={item.externalId || '-'} />
          <DetailItem label="Licensed">
            <Badge
              variant={item.isLicensed ? 'default' : 'secondary'}
              className={`h-5 px-1.5 text-[10px] ${
                item.isLicensed
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                  : ''
              }`}
            >
              {item.isLicensed ? 'Yes' : 'No'}
            </Badge>
          </DetailItem>
        </div>
      </section>

      <Separator />

      {/* Personal Details */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          Personal Details
        </h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="First Name" value={item.firstName} />
          <DetailItem label="Last Name" value={item.lastName} />
          <DetailItem label="Display Name" value={item.displayName} />
          <DetailItem
            label="Department"
            value={
              typeof item.department === 'object' && item.department !== null
                ? (item.department as any).name
                : item.department
            }
          />
          <DetailItem label="Phone" value={item.phone} />
          <DetailItem label="Manager" value={item.manager} />
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

      {/* Direct Permissions */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LockIcon className="h-4 w-4 text-muted-foreground" />
          Direct Permissions
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {directPermissions.length > 0 ? (
            directPermissions.map((permission) => (
              <Badge
                key={`direct-${permission.id}`}
                variant="outline"
                className="h-5 px-1.5 text-[10px] border-primary/20 text-primary"
                title="Direct Permission"
              >
                {permission.key}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No direct permissions assigned.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Inherited from Roles */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LockIcon className="h-4 w-4 text-muted-foreground" />
          Inherited from Roles
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {inheritedFromRoles.length > 0 ? (
            inheritedFromRoles.map((permission: any) => (
              <Badge
                key={`role-inherited-${permission.id}`}
                variant="outline"
                className="h-5 px-1.5 text-[10px] border-blue-500/20 text-blue-600 dark:text-blue-400"
                title="Inherited from Role"
              >
                {permission.key}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No permissions inherited from roles.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Inherited from Groups */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LockIcon className="h-4 w-4 text-muted-foreground" />
          Inherited from Groups
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {inheritedFromGroups.length > 0 ? (
            inheritedFromGroups.map((permission: any) => (
              <Badge
                key={`group-inherited-${permission.id}`}
                variant="outline"
                className="h-5 px-1.5 text-[10px] border-purple-500/20 text-purple-600 dark:text-purple-400"
                title="Inherited from Group"
              >
                {permission.key}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No permissions inherited from groups.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Groups */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          Groups
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px] flex flex-wrap gap-2">
          {item.groups && item.groups.length > 0 ? (
            item.groups.map((group) => (
              <Badge
                key={group.id}
                variant="secondary"
                className="h-5 px-1.5 text-[10px]"
              >
                {group.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No groups assigned.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Metadata */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
          Metadata
        </h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4 rounded-lg border p-3 bg-muted/30 min-h-[60px]">
          {item.metadata && Object.keys(item.metadata).length > 0 ? (
            Object.entries(item.metadata).map(([key, value]) => (
              <DetailItem
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={
                  typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)
                }
                className="col-span-1"
              />
            ))
          ) : (
            <div className="col-span-3 flex items-center">
              <span className="text-xs text-muted-foreground italic">
                No metadata available.
              </span>
            </div>
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
        <div className="grid grid-cols-3 gap-4 text-xs">
          <DetailItem label="Created At" value={formatDate(item.createdAt)} />
          <DetailItem label="Updated At" value={formatDate(item.updatedAt)} />
          <DetailItem
            label="Last Login"
            value={
              item.lastLoginAt
                ? new Date(item.lastLoginAt).toLocaleString()
                : 'Never'
            }
          />
        </div>
      </section>
    </CellViewer>
  )
}
