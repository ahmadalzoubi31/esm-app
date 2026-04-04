import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useCreateServiceMutation } from '@/lib/mutations/services.mutation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

export const Route = createFileRoute('/_esm/service-management/create')({
  component: CreateServicePage,
})

function CreateServicePage() {
  const navigate = useNavigate()
  const createMutation = useCreateServiceMutation()

  const form = useForm<ServiceDto>({
    resolver: zodResolver(ServiceWriteSchema),
    defaultValues: {
      name: '',
      description: '',
      longDescription: '',
      lifecycleStatus: ServiceLifecycleStatusEnum.ACTIVE,
    },
  })

  function onSubmit(data: ServiceDto) {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/service-management' })
      },
    })
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
        <h1 className="text-2xl font-bold">New Service</h1>
        <p className="text-muted-foreground mt-1">
          Create a new business service in the catalog
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
                      <Input placeholder="e.g. Email Service" {...field} />
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
                        placeholder="Brief overview..."
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
                        placeholder="Detailed description..."
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
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
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Service'}
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
