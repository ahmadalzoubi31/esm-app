import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'
import { User } from '@/types'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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

export function TableCellViewer({ item }: { item: User }) {
  const isMobile = useIsMobile()

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
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.display_name || item.username}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="h-[95vh] sm:h-auto sm:max-w-xl"
        data-vaul-no-drag
      >
        <DrawerHeader className="gap-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src={item.avatar}
                alt={item.display_name || item.username}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                <UserIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle>{item.display_name || item.username}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-1">
                <MailIcon className="h-3.5 w-3.5" />
                {item.email}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
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
                    {item.auth_source}
                  </Badge>
                </DetailItem>
                <DetailItem label="Status">
                  <Badge
                    variant={item.is_active ? 'secondary' : 'destructive'}
                    className={`h-5 px-1.5 text-[10px] ${
                      item.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                        : ''
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </DetailItem>
                <DetailItem
                  label="External ID"
                  value={item.external_id || '-'}
                />
                <DetailItem label="Licensed">
                  <Badge
                    variant={item.is_licensed ? 'default' : 'secondary'}
                    className={`h-5 px-1.5 text-[10px] ${
                      item.is_licensed
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                        : ''
                    }`}
                  >
                    {item.is_licensed ? 'Yes' : 'No'}
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
                <DetailItem label="First Name" value={item.first_name} />
                <DetailItem label="Last Name" value={item.last_name} />
                <DetailItem label="Display Name" value={item.display_name} />
                <DetailItem label="Department" value={item.department} />
                <DetailItem label="Phone" value={item.phone} />
                <DetailItem label="Manager" value={item.manager} />
              </div>
            </section>

            <Separator />

            {/* Roles Placeholder */}
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

            {/* Groups Placeholder */}
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

            {/* System Metadata */}
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                System Data
              </h4>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <DetailItem
                  label="Created At"
                  value={formatDate(item.createdAt)}
                />
                <DetailItem
                  label="Updated At"
                  value={formatDate(item.updatedAt)}
                />
                <DetailItem
                  label="Last Login"
                  value={
                    item.last_login_at
                      ? new Date(item.last_login_at).toLocaleString()
                      : 'Never'
                  }
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link to={`/users/$userId`} params={{ userId: item.id }}>
                Edit User
              </Link>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function DetailItem({
  label,
  value,
  children,
  className,
}: {
  label: string
  value?: string | number | null
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="text-xs font-medium text-foreground">
        {children || value || '-'}
      </div>
    </div>
  )
}
