import { CellViewer } from '@/components/web/common/cell-viewer'
import { DetailItem } from '@/components/web/common/cell-viewer-detail-item'
import { Link } from '@tanstack/react-router'
import { DepartmentSchema } from '@repo/shared'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format-date'
import { Building2, InfoIcon, CalendarIcon } from 'lucide-react'

export function TableCellViewer({ item }: { item: DepartmentSchema }) {
  return (
    <CellViewer
      triggerLabel={item.name}
      icon={
        <Avatar className="h-10 w-10 border">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      }
      title={item.name}
      description={item.description}
      editAction={
        <Link
          to={`/departments/$departmentId`}
          params={{ departmentId: item.id }}
        >
          Edit Department
        </Link>
      }
      isActive={item.isActive}
    >
      {/* General Information */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          General Information
        </h4>
        <div className="grid grid-cols-1 gap-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="Description" value={item.description || '-'} />
        </div>
      </section>

      <Separator />

      {/* System Data */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          System Data
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs rounded-lg border p-3 bg-muted/30">
          <DetailItem label="ID" value={item.id} className="col-span-2" />
          <DetailItem label="Created At" value={formatDate(item.createdAt)} />
          <DetailItem
            label="Updated At"
            value={item.updatedAt ? formatDate(item.updatedAt) : '-'}
          />
        </div>
      </section>
    </CellViewer>
  )
}
