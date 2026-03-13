import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CaseStatus } from '@/types/cases'

import {
  Circle,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  UserCheck,
} from 'lucide-react'

export const CASE_STATUS_OPTIONS = [
  { label: 'New', value: CaseStatus.NEW, icon: Circle, color: 'text-blue-500' },
  {
    label: 'Waiting for Approval',
    value: CaseStatus.WAITING_FOR_APPROVAL,
    icon: UserCheck,
    color: 'text-yellow-500',
  },
  {
    label: 'Pending',
    value: CaseStatus.PENDING,
    icon: Clock,
    color: 'text-orange-500',
  },
  {
    label: 'In Progress',
    value: CaseStatus.IN_PROGRESS,
    icon: PlayCircle,
    color: 'text-indigo-500',
  },
  {
    label: 'Resolved',
    value: CaseStatus.RESOLVED,
    icon: CheckCircle2,
    color: 'text-green-500',
  },
  {
    label: 'Closed',
    value: CaseStatus.CLOSED,
    icon: CheckCircle2,
    color: 'text-gray-500',
  },
  {
    label: 'Canceled',
    value: CaseStatus.CANCELED,
    icon: XCircle,
    color: 'text-red-500',
  },
]

import { Separator } from '@/components/ui/separator'

export interface CaseStatusMenuProps {
  value?: CaseStatus | null
  onChange: (value: CaseStatus | undefined) => void
  isInvalid?: boolean
  id?: string
  placeholder?: string
}

export function CaseStatusMenu({
  value,
  onChange,
  isInvalid,
  id,
  placeholder = 'Select status...',
}: CaseStatusMenuProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(val) =>
        onChange(val === 'none' ? undefined : (val as CaseStatus))
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
        {CASE_STATUS_OPTIONS.map((status) => {
          const Icon = status.icon
          return (
            <SelectItem key={status.value} value={status.value}>
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${status.color}`} />
                <span>{status.label}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
