import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useBusinessLinesQuery } from '@/lib/queries/business-lines.query'
import { BusinessLine } from '@/types/business-lines'

export interface BusinessLineMenuProps {
  value?: string | null
  onChange: (value: string | undefined) => void
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
    <Select
      value={value || ''}
      onValueChange={(val) => onChange(val === 'none' ? '' : val)}
      disabled={isLoading}
    >
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'Select business line'}
        />
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
        {businessLines.map((bl: BusinessLine) => (
          <SelectItem key={bl.key} value={bl.id}>
            {bl.name} ({bl.key})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
