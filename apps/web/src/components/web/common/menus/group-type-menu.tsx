import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const GROUP_TYPES = [
  { label: 'Help Desk', value: 'help-desk' },
  { label: 'Tier 1', value: 'tier-1' },
  { label: 'Tier 2', value: 'tier-2' },
  { label: 'Vendor', value: 'vendor' },
]

export interface GroupTypeMenuProps {
  value?: string
  onChange: (value: string) => void
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
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        {GROUP_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
