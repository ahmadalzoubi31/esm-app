import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CasePriority } from '@/types/cases'

import {
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUpCircle,
  AlertOctagon,
} from 'lucide-react'

export const CASE_PRIORITY_OPTIONS = [
  {
    label: 'Low',
    value: CasePriority.LOW,
    icon: ArrowDownCircle,
    color: 'text-blue-500',
  },
  {
    label: 'Medium',
    value: CasePriority.MEDIUM,
    icon: ArrowRightCircle,
    color: 'text-green-500',
  },
  {
    label: 'High',
    value: CasePriority.HIGH,
    icon: ArrowUpCircle,
    color: 'text-orange-500',
  },
  {
    label: 'Critical',
    value: CasePriority.CRITICAL,
    icon: AlertOctagon,
    color: 'text-red-500',
  },
]

import { Separator } from '@/components/ui/separator'

export interface CasePriorityMenuProps {
  value?: CasePriority | null
  onChange: (value: CasePriority | undefined) => void
  isInvalid?: boolean
  id?: string
  placeholder?: string
}

export function CasePriorityMenu({
  value,
  onChange,
  isInvalid,
  id,
  placeholder = 'Select priority',
}: CasePriorityMenuProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(val) =>
        onChange(val === 'none' ? undefined : (val as CasePriority))
      }
    >
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <div className="flex items-center gap-2">
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {value && (
          <>
            <SelectItem value="none" className="text-muted-foreground italic">
              Clear selection
            </SelectItem>
            <Separator className="my-1" />
          </>
        )}
        {CASE_PRIORITY_OPTIONS.map((priority) => {
          const Icon = priority.icon
          return (
            <SelectItem key={priority.value} value={priority.value}>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${priority.color}`} />
                <span>{priority.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
