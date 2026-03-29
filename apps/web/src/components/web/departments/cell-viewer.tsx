import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'
import { Department } from '@repo/shared'

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
import { Building2, InfoIcon, CalendarIcon } from 'lucide-react'

// Standardized Department type from shared package
export function TableCellViewer({ item }: { item: Department }) {

  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.code}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[95vh] sm:h-auto sm:max-w-xl">
        <DrawerHeader className="gap-1 border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-1">
                {item.code}
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
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
                <DetailItem label="Code" value={item.code} />
                <DetailItem label="Status">
                  <Badge
                    variant={item.active ? 'secondary' : 'destructive'}
                    className={`h-5 px-1.5 text-[10px] ${
                      item.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                        : ''
                    }`}
                  >
                    {item.active ? 'Active' : 'Inactive'}
                  </Badge>
                </DetailItem>
                <div className="col-span-2">
                  <DetailItem
                    label="Description"
                    value={item.description || '-'}
                  />
                </div>
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
                <DetailItem
                  label="Created At"
                  value={formatDate(item.createdAt)}
                />
                <DetailItem
                  label="Updated At"
                  value={item.updatedAt ? formatDate(item.updatedAt) : '-'}
                />

              </div>
            </section>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              {/* Change this route path as needed when the detail page is created */}
              <Link
                to={`/departments/$departmentId`}
                params={{ departmentId: item.id }}
              >
                Edit Department
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
