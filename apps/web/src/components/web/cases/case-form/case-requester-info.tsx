import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserMenu } from '@/components/web/common/menus/user-menu'
import { useUserQuery } from '@/lib/queries/users.query'
import { Skeleton } from '@/components/ui/skeleton'
import { MailIcon, UserIcon, BriefcaseIcon, PhoneIcon } from 'lucide-react'
import { FormInstance } from '@/types'
import z from 'zod'
import { CaseSchema } from '@/schemas/case.schema'
import { Separator } from '@/components/ui/separator'

interface CaseRequesterInfoProps {
  form: FormInstance<z.infer<typeof CaseSchema>>
}

export function CaseRequesterInfo({ form }: CaseRequesterInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Requester Information
        </CardTitle>
        <CardDescription>
          Select the requester and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />

        {/* Requester */}
        <form.Field
          name="requesterId"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Requester</FieldLabel>
                <UserMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={isInvalid}
                  placeholder="Select requester..."
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Subscribe
          selector={(state: any) => [state.values.requesterId]}
          children={([requesterId]: any) => (
            <>{requesterId && <RequesterDetails requesterId={requesterId} />}</>
          )}
        />
      </CardContent>
    </Card>
  )
}

function RequesterDetails({ requesterId }: { requesterId: string }) {
  const { data: user, isLoading } = useUserQuery(requesterId)

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 p-4 rounded-lg border bg-muted/20">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const departmentName =
    typeof user.department === 'object' && user.department !== null
      ? (user.department as any).name
      : user.department || '-'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-muted/20 mt-4">
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">
            Username
          </span>
          <span className="text-sm">{user.username}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <MailIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">
            Email
          </span>
          <span className="text-sm truncate" title={user.email}>
            {user.email || '-'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">
            Department
          </span>
          <span className="text-sm truncate" title={departmentName}>
            {departmentName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">
            Phone
          </span>
          <span className="text-sm truncate" title={user.phone}>
            {user.phone || '-'}
          </span>
        </div>
      </div>
    </div>
  )
}
