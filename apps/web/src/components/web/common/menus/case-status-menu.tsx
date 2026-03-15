import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CASE_STATUS_OPTIONS, CaseStatus } from '@/types/cases'

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
