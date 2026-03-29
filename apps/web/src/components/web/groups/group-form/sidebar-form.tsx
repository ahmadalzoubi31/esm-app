import { z } from 'zod'
import { Group, GroupDto } from '@repo/shared'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, UsersIcon, ShieldIcon, UserCogIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FieldError } from '@/components/ui/field'
import { SideBarFormProps } from '@/types/form'

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
          const group = values as GroupDto
          const hasErrors = errors.length > 0 || !isValid

          return (
            <Card className="sticky top-6 border-muted bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Group Preview
                  </CardTitle>
                </div>
                <CardDescription>Live preview of group details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UsersIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid gap-0.5 overflow-hidden">
                    <h3 className="font-semibold leading-none truncate">
                      {group.name || 'New Group'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {group.type || 'Custom Type'}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UserCogIcon className="h-4 w-4" />
                      <span>Roles Attached</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {group.roles?.length || 0}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldIcon className="h-4 w-4" />
                      <span>Permissions</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {group.permissions?.length || 0}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UsersIcon className="h-4 w-4" />
                      <span>Members</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {group.users?.length || 0}
                    </Badge>
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
