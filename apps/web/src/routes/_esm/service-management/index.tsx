import { createFileRoute, Link } from '@tanstack/react-router'
import { useServicesQuery } from '@/lib/queries/services.query'
import { useDeleteServiceMutation } from '@/lib/mutations/services.mutation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import type { ServiceSchema } from '@repo/shared'

export const Route = createFileRoute('/_esm/service-management/')({
  component: ServiceManagementPage,
})

const lifecycleBadgeVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  ACTIVE: 'default',
  DRAFT: 'secondary',
  RETIRED: 'destructive',
}

function ServiceManagementPage() {
  const { data: services, isLoading } = useServicesQuery()
  const deleteMutation = useDeleteServiceMutation()

  function handleDelete(service: ServiceSchema) {
    if (!confirm(`Delete service "${service.name}"?`)) return
    deleteMutation.mutate(service.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage business services in the catalog
          </p>
        </div>
        <Button asChild>
          <Link to="/service-management/create">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Service
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(services ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-12"
                  >
                    No services yet. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                (services ?? []).map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-mono text-sm">
                      {service.code}
                    </TableCell>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {service.description ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lifecycleBadgeVariant[service.lifecycleStatus] ??
                          'outline'
                        }
                      >
                        {service.lifecycleStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            to="/service-management/$serviceId/edit"
                            params={{ serviceId: service.id }}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(service)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2Icon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
