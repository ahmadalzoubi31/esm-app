import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export const GROUP_TYPES = [
  { label: 'Help Desk', value: 'help-desk' },
  { label: 'Tier 1', value: 'tier-1' },
  { label: 'Tier 2', value: 'tier-2' },
  { label: 'Vendor', value: 'vendor' },
]

export interface GroupTypeMenuProps {
  value?: string | null
  onChange: (value: string | undefined) => void
  isInvalid?: boolean
  id?: string
}

export function GroupTypeMenu({
  value,
  onChange,
  isInvalid,
  id,
}: GroupTypeMenuProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={(val) => onChange(val === 'none' ? undefined : val)}
    >
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue placeholder="Select type" />
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
        {GROUP_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
