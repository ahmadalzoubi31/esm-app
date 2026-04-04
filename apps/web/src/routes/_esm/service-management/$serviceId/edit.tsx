import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useServiceQuery } from '@/lib/queries/services.query'
import { useUpdateServiceMutation } from '@/lib/mutations/services.mutation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ServiceWriteSchema,
  ServiceLifecycleStatusEnum,
  type ServiceDto,
} from '@repo/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect } from 'react'

export const Route = createFileRoute('/_esm/service-management/$serviceId/edit')(
  {
    component: EditServicePage,
  },
)

function EditServicePage() {
  const { serviceId } = Route.useParams()
  const navigate = useNavigate()
  const { data: service, isLoading } = useServiceQuery(serviceId)
  const updateMutation = useUpdateServiceMutation()

  const form = useForm<ServiceDto>({
    resolver: zodResolver(ServiceWriteSchema),
    defaultValues: {
      name: '',
      description: '',
      longDescription: '',
      lifecycleStatus: ServiceLifecycleStatusEnum.ACTIVE,
    },
  })

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description ?? '',
        longDescription: service.longDescription ?? '',
        lifecycleStatus: service.lifecycleStatus,
      })
    }
  }, [service, form])

  function onSubmit(data: ServiceDto) {
    updateMutation.mutate(
      { id: serviceId, data },
      {
        onSuccess: () => {
          navigate({ to: '/service-management' })
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Service not found.</p>
        <Button variant="link" asChild>
          <Link to="/service-management">Back to Services</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/service-management">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground mt-1 font-mono text-sm">
          {service.code}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lifecycleStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ServiceLifecycleStatusEnum).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" type="button" asChild>
                  <Link to="/service-management">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
