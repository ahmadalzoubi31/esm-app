import { Label } from '@/components/ui/label'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserMenu } from '@/components/web/common/menus/user-menu'
import { GroupMenu } from '@/components/web/common/menus/group-menu'
import { FormInstance } from '@/types'
import z from 'zod'
import { CaseSchema } from '@/schemas/case.schema'
import { UserCheck2Icon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface CaseAssignmentInfoProps {
  form: FormInstance<z.infer<typeof CaseSchema>>
}

export function CaseAssignmentInfo({ form }: CaseAssignmentInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck2Icon className="h-5 w-5" />
          Assignment Information
        </CardTitle>
        <CardDescription>
          Designate the assignee and assignment group responsible for this case.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        {/* Assignee and Assignment Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="assignmentGroupId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Assignment Group</FieldLabel>
                  <GroupMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val as any)}
                    isInvalid={isInvalid}
                    placeholder="Select Assignment Group..."
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="assigneeId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
                  <UserMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    isInvalid={isInvalid}
                    placeholder="Select Assignee..."
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
