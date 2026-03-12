import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BasicInfoFormProps } from '@/types/form'
import { UserMenu } from '@/components/web/common/menus/user-menu'
import { GroupMenu } from '@/components/web/common/menus/group-menu'

export function CaseAssignmentInfo({ form }: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Information</CardTitle>
        <CardDescription>
          Designate the assignee and assignment group responsible for this case.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="assignee_id"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Assignee</Label>
                <UserMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={field.state.meta.errors.length > 0}
                  placeholder="Select assignee..."
                />
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />

          <form.Field
            name="assignment_group_id"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Assignment Group</Label>
                <GroupMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={field.state.meta.errors.length > 0}
                  placeholder="Select  assignemt group..."
                />
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
