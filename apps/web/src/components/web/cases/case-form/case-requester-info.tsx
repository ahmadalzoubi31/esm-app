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
import { useUserQuery } from '@/lib/queries/users.query'
import { Skeleton } from '@/components/ui/skeleton'
import { MailIcon, UserIcon, BriefcaseIcon, PhoneIcon } from 'lucide-react'

export function CaseRequesterInfo({ form }: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requester Information</CardTitle>
        <CardDescription>
          Select the requester and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.Field
          name="requester_id"
          children={(field: any) => (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={field.name}>Requester</Label>
                <UserMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={field.state.meta.errors.length > 0}
                  placeholder="Select requester..."
                />
                {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
              </div>

              {field.state.value && (
                <RequesterDetails requesterId={field.state.value} />
              )}
            </div>
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
          <span className="text-xs text-muted-foreground font-medium">Username</span>
          <span className="text-sm">{user.username}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <MailIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Email</span>
          <span className="text-sm truncate" title={user.email}>{user.email || '-'}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Department</span>
          <span className="text-sm truncate" title={departmentName}>{departmentName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Phone</span>
          <span className="text-sm truncate" title={user.phone}>{user.phone || '-'}</span>
        </div>
      </div>
    </div>
  )
}
