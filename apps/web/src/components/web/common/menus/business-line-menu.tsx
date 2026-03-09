import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBusinessLinesQuery } from '@/lib/queries/business-lines.query'
import { BusinessLine } from '@/types/business-lines'

export interface BusinessLineMenuProps {
  value?: string
  onChange: (value: string) => void
  isInvalid?: boolean
  id?: string
}

export function BusinessLineMenu({
  value,
  onChange,
  isInvalid,
  id,
}: BusinessLineMenuProps) {
  const { data: businessLinesItem, isLoading } = useBusinessLinesQuery()

  // Unwrap 'data' if the API responds with a nest, though useBusinessLinesQuery
  // in business-lines.query.ts already does `return res.data`
  const businessLines = Array.isArray(businessLinesItem)
    ? businessLinesItem
    : (businessLinesItem as any)?.data || []

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'Select business line'}
        />
      </SelectTrigger>
      <SelectContent>
        {businessLines.map((bl: BusinessLine) => (
          <SelectItem key={bl.key} value={bl.id}>
            {bl.name} ({bl.key})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
