import { z } from 'zod'
import { UserSchema } from '@/schemas/user.schema'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  LockIcon,
  ShieldIcon,
  UserCogIcon,
  UserIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AuthSource } from '@/types'
import { FieldError } from '@/components/ui/field'

interface SideBarFormProps {
  form: any
}

export function SideBarForm({ form }: SideBarFormProps) {
  return (
    <div className="space-y-6">
      <form.Subscribe
        selector={(state: any) => ({
          values: state.values,
          errors: state.errors,
          isSubmitting: state.isSubmitting,
          isValid: state.isValid,
        })}
      >
        {({ values, errors, isSubmitting, isValid }: any) => {
          const user = values as z.infer<typeof UserSchema>
          const hasErrors = errors.length > 0 || !isValid

          return (
            <Card className="sticky top-6 border-muted bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    User Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    {user.is_active && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
                      >
                        Active
                      </Badge>
                    )}
                    {user.is_licensed && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
                      >
                        Licensed
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>Live preview of user details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid gap-0.5 overflow-hidden">
                    <h3 className="font-semibold leading-none truncate">
                      {user.first_name || user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : 'New User'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email || 'no-email@example.com'}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserCogIcon className="h-4 w-4" />
                      <span>Username</span>
                    </div>
                    <span className="font-medium">{user.username || '-'}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldIcon className="h-4 w-4" />
                      <span>Auth Source</span>
                    </div>
                    <Badge
                      variant={
                        user.auth_source === AuthSource.LDAP
                          ? 'secondary'
                          : 'outline'
                      }
                      className="capitalize"
                    >
                      {user.auth_source?.toLowerCase() || 'Local'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LockIcon className="h-4 w-4" />
                      <span>Password</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {user.password ? '••••••••' : 'Not set'}
                    </span>
                  </div>
                </div>

                {hasErrors && (
                  <div className="rounded-md bg-destructive/10 p-3 text-destructive">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <ShieldIcon className="h-4 w-4" />
                      <span>Validation Issues</span>
                    </div>
                    <FieldError errors={errors.values} />
                    <p className="text-xs opacity-90">
                      {errors.length > 0
                        ? errors
                            .map((m: any) =>
                              typeof m === 'string'
                                ? m
                                : (m?.message ?? JSON.stringify(m)),
                            )
                            .join(', ')
                        : 'Please fix form errors before saving.'}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  className="w-full"
                  disabled={isSubmitting || !isValid}
                  onClick={() => form.handleSubmit()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        }}
      </form.Subscribe>
    </div>
  )
}
