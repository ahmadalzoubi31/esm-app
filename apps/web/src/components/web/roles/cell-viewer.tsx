import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'
import { Role } from '@/types'
import { useRolePermissionsQuery } from '@/lib/queries'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ShieldIcon,
  CalendarIcon,
  UsersIcon,
  LockIcon,
  FingerprintIcon,
} from 'lucide-react'

export function TableCellViewer({ item }: { item: Role }) {
  const isMobile = useIsMobile()
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useRolePermissionsQuery(item.id)

  const permissions = permissionsResponse?.data || []

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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldIcon className="h-6 w-6" />
            </div>
            <div>
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-1">
                {item.key}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            {/* General Information */}
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FingerprintIcon className="h-4 w-4 text-muted-foreground" />
                General Information
              </h4>
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
                <DetailItem label="Role Name" value={item.name} />
                <DetailItem label="Key" value={item.key} />
                <DetailItem
                  label="Description"
                  value={item.description}
                  className="col-span-2"
                />
              </div>
            </section>

            <Separator />

            {/* Statistics */}
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                Associations
              </h4>
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
                <DetailItem label="Assigned Users">
                  <Badge variant="outline">{item.userCount}</Badge>
                </DetailItem>
                <DetailItem label="Permissions Count">
                  <Badge variant="secondary">{item.permissionCount}</Badge>
                </DetailItem>
              </div>
            </section>

            <Separator />

            {/* Permissions List */}
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <LockIcon className="h-4 w-4 text-muted-foreground" />
                Assigned Permissions
              </h4>
              <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px]">
                {isLoadingPermissions ? (
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ) : permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((perm) => (
                      <Badge
                        key={perm.id}
                        variant="outline"
                        className="font-mono text-[10px]"
                        title={perm.description}
                      >
                        {perm.key}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No permissions assigned.
                  </span>
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
              <div className="grid grid-cols-2 gap-4 text-xs">
                <DetailItem
                  label="Created At"
                  value={new Date(item.createdAt).toLocaleString()}
                />
                <DetailItem
                  label="Updated At"
                  value={new Date(item.updatedAt).toLocaleString()}
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link to={`/roles`} params={{ id: item.id }}>
                Edit Role
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
