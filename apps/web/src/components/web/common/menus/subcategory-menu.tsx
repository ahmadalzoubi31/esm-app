import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useCategoriesQuery } from '@/lib/queries/categories.query'
import type { Category } from '@/types'

export interface SubcategoryMenuProps {
  value?: string | null
  onChange: (value: string | undefined) => void
  isInvalid?: boolean
  id?: string
  categoryId?: string
}

export function SubcategoryMenu({
  value,
  onChange,
  isInvalid,
  id,
  categoryId,
}: SubcategoryMenuProps) {
  const { data: subcategoriesItem, isLoading } = useCategoriesQuery(
    2,
    categoryId,
    {
      enabled: !!categoryId,
    },
  )

  const subcategories = Array.isArray(subcategoriesItem)
    ? subcategoriesItem
    : (subcategoriesItem as any)?.data || []

  return (
    <Select
      value={value || ''}
      onValueChange={(val) => onChange(val === 'none' ? '' : val)}
      disabled={isLoading || !categoryId}
    >
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={
            !categoryId
              ? 'Select category first'
              : isLoading
                ? 'Loading...'
                : 'Select subcategory'
          }
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
        {subcategories.map((sub: Category) => (
          <SelectItem key={sub.id} value={sub.id}>
            {sub.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
