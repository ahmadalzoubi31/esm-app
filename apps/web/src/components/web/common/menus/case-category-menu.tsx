import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCaseCategoriesQuery } from '@/lib/queries/case-categories.query'
import type { CaseCategory } from '@/types'

import { Separator } from '@/components/ui/separator'

export interface CaseCategoryMenuProps {
  value?: string | null
  onChange: (value: string) => void
  isInvalid?: boolean
  id?: string
}

export function CaseCategoryMenu({
  value,
  onChange,
  isInvalid,
  id,
}: CaseCategoryMenuProps) {
  const { data: categoriesItem, isLoading } = useCaseCategoriesQuery()

  const categories = Array.isArray(categoriesItem)
    ? categoriesItem
    : (categoriesItem as any)?.data || []

  return (
    <Select
      value={value || ''}
      onValueChange={(val) => onChange(val === 'none' ? '' : val)}
      disabled={isLoading}
    >
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'Select category'}
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
        {categories.map((category: CaseCategory) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
