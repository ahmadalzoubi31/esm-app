import { useMemo, useState } from 'react'
import { useQueries, type UseQueryOptions } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { roleKeys, useRolesQuery } from '@/lib/queries/roles.query'
import { usePermissionsQuery } from '@/lib/queries/permissions.query'
import type { ApiResponse } from '@/types/api'
import type { GroupDto, Permission } from '@repo/shared'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Shield,
  ShieldCheck,
  X,
  ChevronRight,
  PlusCircle,
  FolderIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { FormInstance } from '@/types'

interface GroupPermissionsProps {
  form: FormInstance<GroupDto>
}

export function GroupPermissions({ form }: GroupPermissionsProps) {
  return (
    <form.Subscribe
      selector={(state: any) => [state.values.roles]}
      children={([roles]: any) => (
        <GroupPermissionsContent form={form} selectedRoleIds={roles || []} />
      )}
    />
  )
}

function GroupPermissionsContent({
  form,
  selectedRoleIds,
}: GroupPermissionsProps & { selectedRoleIds: string[] }) {
  const { data: allPermissions, isLoading: isLoadingAll } =
    usePermissionsQuery()
  const { data: rolesList } = useRolesQuery()

  const rolePermissionsQueries = useQueries({
    queries: selectedRoleIds.map((roleId) => ({
      queryKey: roleKeys.permissions(roleId),
      queryFn: () => api.roles.findPermissions(roleId),
    })) as UseQueryOptions<ApiResponse<Permission[]>>[],
  })

  const roleNameMap = useMemo(() => {
    const map = new Map<string, string>()
    rolesList?.data?.forEach((role) => {
      map.set(role.id, role.name)
    })
    return map
  }, [rolesList])

  const inheritedPermissionsMetadata = useMemo(() => {
    const map = new Map<string, string[]>()

    rolePermissionsQueries.forEach((query, index) => {
      if (query.data?.data) {
        const roleId = selectedRoleIds[index]
        const roleName = roleNameMap.get(roleId) || 'Unknown Role'

        query.data.data.forEach((p: any) => {
          const current = map.get(p.id) || []
          if (!current.includes(roleName)) {
            current.push(roleName)
          }
          map.set(p.id, current)
        })
      }
    })
    return map
  }, [rolePermissionsQueries, selectedRoleIds, roleNameMap])

  const isLoading =
    isLoadingAll || rolePermissionsQueries.some((q) => q.isLoading)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissions
        </CardTitle>
        <CardDescription>
          Manage additional direct permissions for this group.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <form.Field
            name="permissions"
            children={(field: any) => (
              <PermissionSelector
                field={field}
                allPermissions={allPermissions}
                inheritedPermissionsMetadata={inheritedPermissionsMetadata}
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}

interface PermissionSelectorProps {
  field: any
  allPermissions: ApiResponse<Permission[]> | undefined
  inheritedPermissionsMetadata: Map<string, string[]>
}

function PermissionSelector({
  field,
  allPermissions,
  inheritedPermissionsMetadata,
}: PermissionSelectorProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const selectedPermissions = (field.state.value || []) as string[]

  const { inherited, groupedAvailable } = useMemo(() => {
    const inherited: Permission[] = []
    const available: Permission[] = []

    if (!allPermissions?.data)
      return { inherited, available, groupedAvailable: {} }

    allPermissions.data.forEach((permission) => {
      const isInherited = inheritedPermissionsMetadata.has(permission.id)

      if (isInherited) {
        inherited.push(permission)
        return
      }

      if (selectedPermissions.includes(permission.id)) {
        return
      }

      available.push(permission)
    })

    const groupedAvailable = available.reduce(
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

    return { inherited, available, groupedAvailable }
  }, [allPermissions, inheritedPermissionsMetadata, selectedPermissions])

  const handleSelect = (permissionId: string) => {
    const current = field.state.value || []
    field.handleChange([...current, permissionId])
  }

  const handleRemove = (permissionId: string) => {
    const current = field.state.value || []
    field.handleChange(current.filter((id: string) => id !== permissionId))
  }

  return (
    <div className="space-y-6">
      {inherited.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Shield className="h-4 w-4" />
            Inherited Permissions ({inherited.length})
          </div>
          <div className="flex flex-wrap gap-2 rounded-md border p-3 bg-muted/20">
            {inherited.map((permission) => {
              const sources = inheritedPermissionsMetadata.get(permission.id)
              return (
                <TooltipProvider key={permission.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="cursor-help hover:bg-muted-foreground/20"
                      >
                        {permission.key}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{permission.description}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Source: {sources?.join(', ')}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Direct Permissions
        </div>

        {selectedPermissions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedPermissions.map((id) => {
              const permission = allPermissions?.data?.find((p) => p.id === id)
              if (!permission) return null
              return (
                <Badge
                  key={id}
                  variant="default"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {permission.key}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full p-0 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                    onClick={() => handleRemove(id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              )
            })}
          </div>
        )}

        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) setActiveCategory(null)
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <PlusCircle className="h-4 w-4" />
                Add Permission...
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search permissions..." />
              <CommandList>
                <CommandEmpty>No permissions found.</CommandEmpty>

                {!activeCategory && (
                  <CommandGroup heading="Categories">
                    {Object.keys(groupedAvailable)
                      .sort()
                      .map((category) => (
                        <CommandItem
                          key={category}
                          onSelect={() => setActiveCategory(category)}
                          className="cursor-pointer"
                        >
                          <FolderIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{category}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {groupedAvailable[category].length}
                          </Badge>
                          <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
                        </CommandItem>
                      ))}
                    {Object.keys(groupedAvailable).length === 0 && (
                      <div className="p-4 text-sm text-center text-muted-foreground">
                        All permissions assigned.
                      </div>
                    )}
                  </CommandGroup>
                )}

                {activeCategory && (
                  <>
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setActiveCategory(null)}
                        className="font-medium text-muted-foreground cursor-pointer"
                      >
                        <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                        Back to Categories
                      </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading={activeCategory}>
                      {groupedAvailable[activeCategory] ? (
                        groupedAvailable[activeCategory].map((permission) => (
                          <CommandItem
                            key={permission.id}
                            value={`${permission.key} ${permission.description}`}
                            onSelect={() => handleSelect(permission.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span>{permission.key}</span>
                              <span className="text-xs text-muted-foreground">
                                {permission.description}
                              </span>
                            </div>
                          </CommandItem>
                        ))
                      ) : (
                        <div className="p-4 text-sm text-center text-muted-foreground">
                          All permissions in this category assigned.
                        </div>
                      )}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
