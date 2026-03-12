import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSearchCaseSubcategoriesQuery } from '@/lib/queries/case-subcategories.query'
import type { CaseSubcategory } from '@/types'

export interface CaseSubcategoryMenuProps {
  value?: string
  onChange: (value: string) => void
  isInvalid?: boolean
  id?: string
  categoryId?: string
}

export function CaseSubcategoryMenu({
  value,
  onChange,
  isInvalid,
  id,
  categoryId,
}: CaseSubcategoryMenuProps) {
  const { data: subcategoriesItem, isLoading } = useSearchCaseSubcategoriesQuery(
    categoryId ? { categoryId } : '',
    { enabled: !!categoryId }
  )

  const subcategories = Array.isArray(subcategoriesItem)
    ? subcategoriesItem
    : (subcategoriesItem as any)?.data || []

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading || !categoryId}>
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={!categoryId ? 'Select category first' : isLoading ? 'Loading...' : 'Select subcategory'}
        />
      </SelectTrigger>
      <SelectContent>
        {subcategories.map((sub: CaseSubcategory) => (
          <SelectItem key={sub.id} value={sub.id}>
            {sub.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
