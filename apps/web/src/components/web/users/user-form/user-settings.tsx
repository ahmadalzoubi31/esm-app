import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel } from '@/components/ui/field'
import { SettingsIcon } from 'lucide-react'

interface UserSettingsProps {
  form: any
}

export function UserSettings({ form }: UserSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Configure account status and licensing options.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Is Active */}
        <form.Field
          name="is_active"
          children={(field: any) => (
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <Checkbox
                id="is_active"
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              <div className="space-y-1 leading-none">
                <FieldLabel htmlFor="is_active">Active Account</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Active users can log in to the system. Disabling this will
                  prevent the user from accessing the application.
                </p>
              </div>
            </div>
          )}
        />

        {/* Is Licensed */}
        <form.Field
          name="is_licensed"
          children={(field: any) => (
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <Checkbox
                id="is_licensed"
                checked={field.state.value}
                onCheckedChange={(checked) => {
                  field.handleChange(checked)
                  if (!checked) {
                    form.setFieldValue('roles', [])
                    form.setFieldValue('permissions', [])
                  }
                }}
              />
              <div className="space-y-1 leading-none">
                <FieldLabel htmlFor="is_licensed">Licensed User</FieldLabel>
                <p className="text-sm text-muted-foreground">
                  Licensed users count towards your subscription quota and can
                  be assigned roles and permissions.
                </p>
              </div>
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}
