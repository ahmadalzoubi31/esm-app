import { CellViewer } from '@/components/web/common/cell-viewer'
import { DetailItem } from '@/components/web/common/cell-viewer-detail-item'
import { Link } from '@tanstack/react-router'
import { RoleSchema } from '@repo/shared'
import { useRolePermissionsQuery } from '@/lib/queries'
import { formatDate } from '@/lib/format-date'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ShieldIcon,
  CalendarIcon,
  UsersIcon,
  LockIcon,
  FingerprintIcon,
} from 'lucide-react'

export function TableCellViewer({ item }: { item: RoleSchema }) {
  const { data: permissionsResponse, isLoading: isLoadingPermissions } =
    useRolePermissionsQuery(item.id)

  const permissions = permissionsResponse?.data || []

  return (
    <CellViewer
      triggerLabel={item.name}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldIcon className="h-6 w-6" />
        </div>
      }
      title={item.name}
      description={item.description}
      editAction={
        <Link to="/roles/$roleId" params={{ roleId: item.id }}>
          Edit Role
        </Link>
      }
    >
      {/* General Information */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FingerprintIcon className="h-4 w-4 text-muted-foreground" />
          General Information
        </h4>
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="Role Name" value={item.name} className="col-span-2" />
          <DetailItem
            label="Description"
            value={item.description}
            className="col-span-2"
          />
        </div>
      </section>

      <Separator />

      {/* Associations */}
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

      {/* Assigned Permissions */}
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
