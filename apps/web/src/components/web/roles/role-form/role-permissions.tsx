import { useMemo } from 'react'
import { usePermissionsQuery } from '@/lib/queries/permissions.query'
import type { ApiResponse } from '@/types/api'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormInstance } from '@/types'
import { Permission, RoleDto } from '@repo/shared'

interface RolePermissionsProps {
  form: FormInstance<RoleDto>
}

export function RolePermissions({ form }: RolePermissionsProps) {
  const { data: allPermissions, isLoading } = usePermissionsQuery()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Permissions
        </CardTitle>
        <CardDescription>
          Select the permissions to assign to this role.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 pl-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-start space-x-3">
                      <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-sm" />
                      <div className="space-y-2 w-full max-w-[200px]">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form.Field
            name="permissionIds"
            children={(field: any) => (
              <PermissionCheckboxes
                field={field}
                allPermissions={allPermissions}
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface PermissionCheckboxesProps {
  field: any
  allPermissions: ApiResponse<Permission[]> | undefined
}

function PermissionCheckboxes({
  field,
  allPermissions,
}: PermissionCheckboxesProps) {
  const selectedPermissions = (field.state.value || []) as string[]

  const groupedPermissions = useMemo(() => {
    if (!allPermissions?.data) return {}

    return allPermissions.data.reduce(
      (acc, permission) => {
        const category = permission.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(permission)
        return acc
      },
      {} as Record<string, Permission[]>,
    )
  }, [allPermissions])

  const handleCheckedChange = (permissionId: string, checked: boolean) => {
    const current = field.state.value || []
    if (checked) {
      field.handleChange([...current, permissionId])
    } else {
      field.handleChange(current.filter((id: string) => id !== permissionId))
    }
  }

  // Handle checking/unchecking all in a category
  const handleCategoryCheckedChange = (
    categoryPermissions: Permission[],
    checked: boolean,
  ) => {
    const current = new Set(field.state.value || []) as Set<string>
    categoryPermissions.forEach((p) => {
      if (checked) {
        current.add(p.id)
      } else {
        current.delete(p.id)
      }
    })
    field.handleChange(Array.from(current))
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedPermissions)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, permissions]) => {
          const allInCategorySelected = permissions.every((p) =>
            selectedPermissions.includes(p.id),
          )
          const someInCategorySelected = permissions.some((p) =>
            selectedPermissions.includes(p.id),
          )

          // Try indeterminate, fallback to false if it's not all but some are selected
          const categoryCheckedState = allInCategorySelected
            ? true
            : someInCategorySelected
              ? 'indeterminate'
              : false

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={categoryCheckedState}
                  onCheckedChange={(checked) =>
                    handleCategoryCheckedChange(permissions, checked === true)
                  }
                />
                <Label
                  htmlFor={`cat-${category}`}
                  className="text-base font-semibold cursor-pointer"
                >
                  {category}
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 pl-6">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={`perm-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) =>
                        handleCheckedChange(permission.id, checked === true)
                      }
                      className="mt-1"
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor={`perm-${permission.id}`}
                        className="font-medium cursor-pointer text-sm"
                      >
                        {permission.key}
                      </Label>
                      {permission.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

      {Object.keys(groupedPermissions).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No permissions found.
        </div>
      )}
    </div>
  )
}
