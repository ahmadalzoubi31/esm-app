import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'
import { Subcategory } from '@/types'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate } from '@/lib/format-date'
import { InfoIcon, CalendarIcon, HashIcon, AlignLeftIcon } from 'lucide-react'

export function TableCellViewer({ item }: { item: Subcategory }) {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border">
              <HashIcon className="h-6 w-6" />
            </div>
            <div>
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-1">
                Subcategory Details
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            {/* General Information */}
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
                General Information
              </h4>
              <div className="grid grid-cols-1 gap-4 rounded-lg border p-3 bg-muted/30">
                <DetailItem label="ID" value={item.id} />
                <DetailItem label="Name" value={item.name} />
                <DetailItem label="Category" value={item.category?.name} />
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

            {/* System Metadata */}
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

        <DrawerHeader className="border-t mt-auto p-4 sm:p-6">
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link
                to={`/subcategories/$subcategoryId`}
                params={{ subcategoryId: item.id }}
              >
                Edit Subcategory
              </Link>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
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
      <div className="text-xs font-medium text-foreground break-all">
        {children || value || '-'}
      </div>
    </div>
  )
}
