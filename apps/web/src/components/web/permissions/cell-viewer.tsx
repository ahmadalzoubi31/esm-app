import { Permission } from '@/types'
import { useIsMobile } from '@/hooks/use-mobile'
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
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format-date'
import {
  LockIcon,
  TagIcon,
  ShieldIcon,
  CalendarIcon,
  FileCodeIcon,
} from 'lucide-react'

export function TableCellViewer({ item }: { item: Permission }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          <span className="font-mono font-bold">{item.key}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[95vh] sm:h-auto sm:max-w-xl">
        <DrawerHeader className="gap-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LockIcon className="h-6 w-6" />
            </div>
            <div>
              <DrawerTitle className="font-mono">{item.key}</DrawerTitle>
              <DrawerDescription>
                View permission details and usage guidelines
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
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

            {/* General Information */}
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

            <Separator />

            {/* Conditions (ABAC) */}
            {item.conditions && Object.keys(item.conditions).length > 0 && (
              <>
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
                <Separator />
              </>
            )}

            {/* System Metadata */}
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
