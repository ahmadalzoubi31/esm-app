import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDepartmentsQuery } from '@/lib/queries/departments.query'
import type { Department } from '@/types'

export interface DepartmentMenuProps {
  value?: string
  onChange: (value: string) => void
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
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger id={id} aria-invalid={isInvalid}>
        <SelectValue
          placeholder={isLoading ? 'Loading...' : 'Select department'}
        />
      </SelectTrigger>
      <SelectContent>
        {departments.map((dept: Department) => (
          <SelectItem key={dept.id} value={dept.id}>
            {dept.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
