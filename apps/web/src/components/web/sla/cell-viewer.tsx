import { Link } from '@tanstack/react-router'
import { useIsMobile } from '@/hooks/use-mobile'
import { SlaTarget, SlaTrigger } from '@repo/shared'

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
import { formatDate } from '@/lib/format-date'
import {
  TimerIcon,
  CalendarIcon,
  PlayIcon,
  SquareIcon,
  PauseIcon,
  ActivityIcon,
} from 'lucide-react'

export function TableCellViewer({ item }: { item: SlaTarget }) {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-primary/10 text-primary">
              <TimerIcon className="h-6 w-6" />
            </div>
            <div>
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerDescription className="flex items-center gap-1 font-mono text-xs">
                {item.type}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            {/* General Information */}
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                General Information
              </h4>
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-3 bg-muted/30">
                <DetailItem label="Name" value={item.name} />
                <DetailItem
                  label="Key"
                  value={item.type}
                  className="font-mono"
                />
                <DetailItem label="Goal" value={formatMs(item.goalMs)} />
                <DetailItem label="Status">
                  <Badge
                    variant={item.isActive ? 'secondary' : 'destructive'}
                    className={`h-5 px-1.5 text-[10px] ${
                      item.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                        : ''
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </DetailItem>
              </div>
            </section>

            <Separator />

            {/* Triggers */}
            <TriggerSection
              title="Start Triggers"
              icon={<PlayIcon className="h-4 w-4 text-green-500" />}
              triggers={item.rules?.startTriggers}
            />
            <Separator />
            <TriggerSection
              title="Stop Triggers"
              icon={<SquareIcon className="h-4 w-4 text-red-500" />}
              triggers={item.rules?.stopTriggers}
            />
            <Separator />
            <TriggerSection
              title="Pause Triggers"
              icon={<PauseIcon className="h-4 w-4 text-orange-500" />}
              triggers={item.rules?.pauseTriggers}
            />
            <Separator />
            <TriggerSection
              title="Resume Triggers"
              icon={<PlayIcon className="h-4 w-4 text-blue-500" />}
              triggers={item.rules?.resumeTriggers}
            />

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

        <DrawerFooter className="border-t pt-4">
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link to="/sla/$slaId" params={{ slaId: item.id }}>
                Edit SLA Target
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

function TriggerSection({
  title,
  icon,
  triggers,
}: {
  title: string
  icon: React.ReactNode
  triggers?: SlaTrigger[]
}) {
  return (
    <section className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {title}
      </h4>
      <div className="rounded-lg border p-3 bg-muted/30 min-h-[50px] space-y-3">
        {triggers && triggers.length > 0 ? (
          triggers.map((trigger, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-2 border-b last:border-0 pb-3 last:pb-0"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono py-0">
                  {trigger.event}
                </Badge>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  {trigger.action}
                </span>
              </div>
              {trigger.conditions && trigger.conditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-3 border-l-2 border-muted-foreground/20">
                  {trigger.conditions.map((condition, cIdx) => (
                    <Badge
                      key={cIdx}
                      variant="secondary"
                      className="text-[9px] h-4 px-1 leading-none bg-muted hover:bg-muted"
                    >
                      <span className="text-muted-foreground mr-1">
                        {condition.field}
                      </span>
                      <span className="text-primary font-bold mr-1">
                        {condition.operator}
                      </span>
                      <span>{JSON.stringify(condition.value)}</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <span className="text-xs text-muted-foreground italic">
            No triggers defined.
          </span>
        )}
      </div>
    </section>
  )
}

function formatMs(ms: number) {
  if (!ms && ms !== 0) return '-'
  if (ms === 0) return '0s'

  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.join(' ') || '0s'
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
      <span className="text-xs font-medium text-muted-foreground tracking-tight">
        {label}
      </span>
      <div className="text-xs font-semibold text-foreground">
        {children || value || '-'}
      </div>
    </div>
  )
}
