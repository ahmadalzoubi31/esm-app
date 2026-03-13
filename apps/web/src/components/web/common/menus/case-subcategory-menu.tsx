import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useSearchCaseSubcategoriesQuery } from '@/lib/queries'
import { CaseSubcategory } from '@/types'

export interface CaseSubcategoryMenuProps {
  value?: string | null
  onChange: (value: string | undefined) => void
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
  const { data: subcategoriesItem, isLoading } =
    useSearchCaseSubcategoriesQuery(categoryId ? { categoryId } : '', {
      enabled: !!categoryId,
    })

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
        {subcategories.map((sub: CaseSubcategory) => (
          <SelectItem key={sub.id} value={sub.id}>
            {sub.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
