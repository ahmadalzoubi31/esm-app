import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategoriesQuery } from '@/lib/queries/categories.query'
import type { Category } from '@/types'

import { Separator } from '@/components/ui/separator'

export interface CategoryMenuProps {
  value?: string | null
  onChange: (value: string) => void
  isInvalid?: boolean
  id?: string
  tier?: number
  parentId?: string
}

export function CategoryMenu({
  value,
  onChange,
  isInvalid,
  id,
  tier = 1,
  parentId,
}: CategoryMenuProps) {
  const { data: categoriesItem, isLoading } = useCategoriesQuery(tier, parentId)

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
        {categories.map((category: Category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
