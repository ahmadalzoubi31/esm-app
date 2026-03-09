import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserCog as RoleIcon } from 'lucide-react'
import { FormInstance } from '@/types'
import { RoleSchema } from '@/schemas/role.schema'
import { z } from 'zod'

interface RoleBasicInfoProps {
  form: FormInstance<z.infer<typeof RoleSchema>>
}

export function RoleBasicInfo({ form }: RoleBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RoleIcon className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>Enter the role's basic details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          {/* Name */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      field.handleChange(e.target.value)
                    }}
                    aria-invalid={isInvalid}
                    autoComplete="off"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          {/* Description */}
          <div className="md:col-span-2">
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      className="resize-none"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
