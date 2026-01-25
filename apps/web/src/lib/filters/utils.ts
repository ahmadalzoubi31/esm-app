import {
  FilterCondition,
  FilterGroup,
  FilterOperator,
} from '@/components/web/common/app-table'

/**
 * Apply a filter condition to a single row
 */
function applyCondition<TData>(
  row: TData,
  condition: FilterCondition<TData>,
): boolean {
  const fieldValue = (row as any)[condition.field]
  const { operator, value, value2 } = condition

  // Handle null/undefined values
  if (fieldValue === null || fieldValue === undefined) {
    if (operator === FilterOperator.IS_EMPTY) return true
    if (operator === FilterOperator.IS_NOT_EMPTY) return false
    return false // Other operators fail on null/undefined
  }

  const fieldStr = String(fieldValue).toLowerCase()
  const valueStr = String(value).toLowerCase()

  switch (operator) {
    case FilterOperator.EQUALS:
      return fieldStr === valueStr

    case FilterOperator.NOT_EQUALS:
      return fieldStr !== valueStr

    case FilterOperator.CONTAINS:
      return fieldStr.includes(valueStr)

    case FilterOperator.NOT_CONTAINS:
      return !fieldStr.includes(valueStr)

    case FilterOperator.STARTS_WITH:
      return fieldStr.startsWith(valueStr)

    case FilterOperator.ENDS_WITH:
      return fieldStr.endsWith(valueStr)

    case FilterOperator.GREATER_THAN:
      return Number(fieldValue) > Number(value)

    case FilterOperator.LESS_THAN:
      return Number(fieldValue) < Number(value)

    case FilterOperator.GREATER_THAN_OR_EQUAL:
      return Number(fieldValue) >= Number(value)

    case FilterOperator.LESS_THAN_OR_EQUAL:
      return Number(fieldValue) <= Number(value)

    case FilterOperator.BETWEEN:
      if (value2 === undefined || value2 === null) return false
      const num = Number(fieldValue)
      const min = Number(value)
      const max = Number(value2)
      return num >= min && num <= max

    case FilterOperator.IS_EMPTY:
      return (
        fieldValue === null || fieldValue === undefined || fieldValue === ''
      )

    case FilterOperator.IS_NOT_EMPTY:
      return (
        fieldValue !== null && fieldValue !== undefined && fieldValue !== ''
      )

    case FilterOperator.IN:
      if (!Array.isArray(value)) return false
      return (
        value.includes(fieldValue) ||
        value.map(String).includes(String(fieldValue))
      )

    case FilterOperator.NOT_IN:
      if (!Array.isArray(value)) return true
      return (
        !value.includes(fieldValue) &&
        !value.map(String).includes(String(fieldValue))
      )

    default:
      return true
  }
}

/**
 * Apply a filter group to a single row
 */
function applyFilterGroup<TData>(
  row: TData,
  group: FilterGroup<TData>,
): boolean {
  if (group.conditions.length === 0) return true

  const conditionResults = group.conditions.map((condition) =>
    applyCondition(row, condition),
  )

  const groupResults =
    group.groups?.map((subGroup) => applyFilterGroup(row, subGroup)) || []

  const allResults = [...conditionResults, ...groupResults]

  if (group.logic === 'AND') {
    return allResults.every((result) => result === true)
  } else {
    // OR logic
    return allResults.some((result) => result === true)
  }
}

/**
 * Filter data based on a filter group
 */
export function applyAdvancedFilter<TData>(
  data: TData[],
  filterGroup?: FilterGroup<TData>,
): TData[] {
  if (!filterGroup || filterGroup.conditions.length === 0) {
    return data
  }

  return data.filter((row) => applyFilterGroup(row, filterGroup))
}

/**
 * Convert filter group to a human-readable string
 */
export function filterGroupToString<TData>(group: FilterGroup<TData>): string {
  if (group.conditions.length === 0) return ''

  const conditionStrings = group.conditions.map((condition) => {
    const { field, operator, value, value2 } = condition
    const operatorLabels: Record<FilterOperator, string> = {
      [FilterOperator.EQUALS]: 'is',
      [FilterOperator.NOT_EQUALS]: 'is not',
      [FilterOperator.CONTAINS]: 'contains',
      [FilterOperator.NOT_CONTAINS]: 'does not contain',
      [FilterOperator.STARTS_WITH]: 'starts with',
      [FilterOperator.ENDS_WITH]: 'ends with',
      [FilterOperator.GREATER_THAN]: '>',
      [FilterOperator.LESS_THAN]: '<',
      [FilterOperator.GREATER_THAN_OR_EQUAL]: '>=',
      [FilterOperator.LESS_THAN_OR_EQUAL]: '<=',
      [FilterOperator.BETWEEN]: 'between',
      [FilterOperator.IS_EMPTY]: 'is empty',
      [FilterOperator.IS_NOT_EMPTY]: 'is not empty',
      [FilterOperator.IN]: 'is one of',
      [FilterOperator.NOT_IN]: 'is not one of',
    }

    let valueStr = String(value)
    if (value2 !== undefined) {
      valueStr += ` and ${String(value2)}`
    }

    return `${String(field)} ${operatorLabels[operator]} ${valueStr}`
  })

  return conditionStrings.join(` ${group.logic} `)
}
