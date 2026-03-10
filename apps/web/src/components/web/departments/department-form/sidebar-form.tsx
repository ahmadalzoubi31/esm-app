import { z } from 'zod'
import { DepartmentSchema } from '@/schemas/department.schema'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, LayoutGridIcon, ShieldIcon } from 'lucide-react'
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
          const department = values as z.infer<typeof DepartmentSchema>
          const hasErrors = errors.length > 0 || !isValid

          return (
            <Card className="sticky top-6 border-muted bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Department Preview
                  </CardTitle>
                  {department.active && (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
                    >
                      Active
                    </Badge>
                  )}
                  {!department.active && department.active !== undefined && (
                    <Badge
                      variant="outline"
                      className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Live preview of department details
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <LayoutGridIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="grid gap-0.5 overflow-hidden">
                    <h3 className="font-semibold leading-none truncate">
                      {department.name || 'New Department'}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {department.description || 'No description'}
                    </p>
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
