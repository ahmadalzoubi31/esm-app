import { CellViewer } from '@/components/web/common/cell-viewer'
import { DetailItem } from '@/components/web/common/cell-viewer-detail-item'
import { PermissionSchema } from '@repo/shared'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/format-date'
import { LockIcon, TagIcon, ShieldIcon, CalendarIcon, FileCodeIcon } from 'lucide-react'

export function TableCellViewer({ item }: { item: PermissionSchema }) {
  return (
    <CellViewer
      triggerLabel={
        <span className="font-mono font-bold">{item.key}</span>
      }
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LockIcon className="h-6 w-6" />
        </div>
      }
      title={<span className="font-mono">{item.key}</span>}
      description="View permission details and usage guidelines"
    >
      {/* Description */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <TagIcon className="h-4 w-4 text-muted-foreground" />
          Description
        </h4>
        <div className="rounded-lg border p-4 bg-muted/30 text-sm leading-relaxed">
          {item.description || 'No description provided'}
        </div>
      </section>

      <Separator />

      {/* Details */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ShieldIcon className="h-4 w-4 text-muted-foreground" />
          Details
        </h4>
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
          <DetailItem label="Subject" value={item.subject} />
          <DetailItem label="Action" value={item.action} />
          <DetailItem label="Category">
            <Badge variant="outline">{item.category}</Badge>
          </DetailItem>
        </div>
      </section>

      {item.conditions && Object.keys(item.conditions).length > 0 && (
        <>
          <Separator />

          {/* Conditions (ABAC) */}
          <section className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileCodeIcon className="h-4 w-4 text-muted-foreground" />
              Conditions
            </h4>
            <div className="rounded-lg border p-3 bg-muted/30">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(item.conditions, null, 2)}
              </pre>
            </div>
          </section>
        </>
      )}

      <Separator />

      {/* System Data */}
      <section className="space-y-3">
        <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          System Data
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <DetailItem
            label="ID"
            value={item.id}
            className="col-span-2 font-mono"
          />
          <DetailItem label="Created At" value={formatDate(item.createdAt)} />
          <DetailItem label="Updated At" value={formatDate(item.updatedAt)} />
        </div>
      </section>
    </CellViewer>
  )
}
