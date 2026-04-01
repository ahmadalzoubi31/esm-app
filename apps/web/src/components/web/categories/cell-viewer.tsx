import { CellViewer } from '@/components/web/common/cell-viewer'
import { DetailItem } from '@/components/web/common/cell-viewer-detail-item'
import { Link } from '@tanstack/react-router'
import { CategorySchema } from '@repo/shared'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format-date'
import { InfoIcon, CalendarIcon, HashIcon, AlignLeftIcon, FolderTreeIcon } from 'lucide-react'

export function TableCellViewer({ item }: { item: CategorySchema }) {
  return (
    <CellViewer
      triggerLabel={item.name}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border">
          <HashIcon className="h-6 w-6" />
        </div>
      }
      title={item.name}
      description="Category Details"
      editAction={
        <Link
          to={`/categories/$categoryId`}
          params={{ categoryId: item.id }}
        >
          Edit Category
        </Link>
      }
    >
      {/* General Information */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          General Information
        </h4>
        <div className="grid grid-cols-1 gap-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="ID" value={item.id} />
          <DetailItem label="Name" value={item.name} />
        </div>
      </section>

      <Separator />

      {/* Description */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <AlignLeftIcon className="h-4 w-4 text-muted-foreground" />
          Description
        </h4>
        <div className="rounded-lg border p-3 bg-muted/30 min-h-[60px]">
          {item.description ? (
            <p className="text-sm text-foreground leading-relaxed">
              {item.description}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No description available.
            </span>
          )}
        </div>
      </section>

      <Separator />

      {/* Subcategories */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FolderTreeIcon className="h-4 w-4 text-muted-foreground" />
          Subcategories ({item.children?.length || 0})
        </h4>
        <div className="flex flex-wrap gap-2 rounded-lg border p-3 bg-muted/30 min-h-[60px]">
          {item.children && item.children.length > 0 ? (
            item.children.map((sub: CategorySchema) => (
              <Badge key={sub.id} variant="secondary" className="font-normal">
                {sub.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              No subcategories available.
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
