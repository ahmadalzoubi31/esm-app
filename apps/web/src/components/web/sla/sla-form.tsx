import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { FieldError } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SlaTarget, SlaTargetWriteSchema, SlaTargetDto } from '@repo/shared'

interface SlaFormProps {
  initialData?: SlaTarget | null
  onSubmit: (values: SlaTargetDto) => void
  isLoading?: boolean
}

export function SlaForm({ initialData, onSubmit, isLoading }: SlaFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData!.name,
      type: initialData!.type,
      description: initialData?.description || '',
      goalMs: initialData?.goalMs || 0,
      rules: initialData?.rules || {
        startTriggers: [],
        stopTriggers: [],
        pauseTriggers: [],
        resumeTriggers: [],
      },
      isActive: initialData?.isActive ?? true,
    } as SlaTargetDto,
    validators: {
      onSubmit: SlaTargetWriteSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide the basic details for this SLA target.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <form.Field
              name="name"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Response SLA (4h)"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </div>
              )}
            />
            <form.Field
              name="type"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Type</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select SLA Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="respond">Response</SelectItem>
                      <SelectItem value="resolution">Resolution</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Whether this target applies to the first response or full
                    resolution.
                  </p>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </div>
              )}
            />
          </div>

          <form.Field
            name="goalMs"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Goal (Milliseconds)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Duration after which the SLA is considered breached.
                </p>
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />

          <form.Field
            name="rules"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>SLA Rules (JSON)</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  placeholder="{ ... }"
                  className="font-mono h-[300px]"
                  value={JSON.stringify(field.state.value, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      field.handleChange(parsed)
                    } catch (err) {
                      // Allow invalid JSON while typing
                    }
                  }}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Configure triggers for starting, stopping, pausing, and
                  resuming the SLA.
                </p>
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />

          <form.Field
            name="isActive"
            children={(field) => (
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Active Status</Label>
                  <p className="text-[0.8rem] text-muted-foreground">
                    Whether this SLA target is currently being evaluated for new
                    cases.
                  </p>
                </div>
                <Switch
                  checked={field.state.value}
                  onCheckedChange={(val) => field.handleChange(val)}
                />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {initialData ? 'Update SLA Target' : 'Create SLA Target'}
        </Button>
      </div>
    </form>
  )
}
