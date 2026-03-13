import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDepartmentsQuery } from '@/lib/queries/departments.query'
import type { Department } from '@/types'

export interface DepartmentMenuProps {
  value?: string | null
  onChange: (value: string | undefined) => void
  isInvalid?: boolean
  id?: string
}

export function DepartmentMenu({
  value,
  onChange,
  isInvalid,
  id,
}: DepartmentMenuProps) {
  const { data: departmentsItem, isLoading } = useDepartmentsQuery()

  // Unwrap 'data' if the API responds with a nest
  const departments = Array.isArray(departmentsItem)
    ? departmentsItem
    : (departmentsItem as any)?.data || []

  return (
    <Select
      value={value || undefined}
      onValueChange={(val) => onChange(val === 'none' ? undefined : val)}
      disabled={isLoading}
    >
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'Select department'}
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
        {departments.map((dept: Department) => (
          <SelectItem key={dept.id} value={dept.id}>
            {dept.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
