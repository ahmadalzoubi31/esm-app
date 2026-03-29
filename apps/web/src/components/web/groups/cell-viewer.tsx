import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'
import { Group } from '@/types'
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/format-date'
import {
  UsersIcon,
  ShieldIcon,
  CalendarIcon,
  KeyIcon,
  LockIcon,
} from 'lucide-react'

export function TableCellViewer({ item }: { item: Group }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[95vh] sm:h-auto sm:max-w-xl">
        <DrawerHeader className="gap-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                <UsersIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-1">
                {item.type} Group
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
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
                    item.teamLeader?.displayName ||
                    item.teamLeader?.username ||
                    '-'
                  }
                />
                <DetailItem
                  label="Business Line"
                  value={item.businessLine?.name || '-'}
                />
              </div>
            </section>

            <Separator />

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

            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                System Data
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <DetailItem
                  label="Created At"
                  value={formatDate(item.createdAt)}
                />
                <DetailItem
                  label="Updated At"
                  value={formatDate(item.updatedAt)}
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link to={`/groups/$groupId`} params={{ groupId: item.id }}>
                Edit Group
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

