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
import { ScrollArea } from '@/components/ui/scroll-area'
import { StringOrTemplateHeader } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

interface CellViewerProps {
  triggerLabel: string
  triggerClassName?: string
  icon: React.ReactNode
  title: string
  description?: string
  isActive?: boolean
  children: React.ReactNode
  editAction?: React.ReactNode
  editLabel?: string
}

export function CellViewer({
  triggerLabel,
  triggerClassName,
  icon,
  title,
  description,
  isActive,
  children,
  editAction,
  editLabel = 'Edit',
}: CellViewerProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className={triggerClassName ?? 'text-foreground w-fit px-0 text-left'}
        >
          {triggerLabel}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[95vh] sm:h-auto sm:max-w-xl">
        <DrawerHeader className="gap-1 border-b pb-4">
          <div className="flex items-center gap-2">
            {icon}
            <div className="grow">
              <DrawerTitle>{title}</DrawerTitle>
              {description && description.length < 50 && (
                <DrawerDescription className="flex items-center gap-1">
                  {description}
                </DrawerDescription>
              )}
            </div>
            <div>
              {isActive && (
                <DrawerDescription className="flex items-center gap-1">
                  <Badge
                    variant={isActive ? 'secondary' : 'destructive'}
                    className={`h-5 px-1.5 text-[10px] ${
                      isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                        : ''
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </DrawerDescription>
              )}
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">{children}</div>
        </ScrollArea>

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2">
            {editAction && (
              <Button className="flex-1" asChild>
                {editAction}
              </Button>
            )}
            <DrawerClose asChild>
              <Button
                variant={editAction ? 'outline' : 'default'}
                className="flex-1"
              >
                Close
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
