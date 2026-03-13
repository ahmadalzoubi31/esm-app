import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CaseCategoryMenu } from '@/components/web/common/menus/case-category-menu'
import { CaseSubcategoryMenu } from '@/components/web/common/menus/case-subcategory-menu'
import { BusinessLineMenu } from '@/components/web/common/menus/business-line-menu'
import { CaseSchema } from '@/schemas/case.schema'
import { CasePriority, CaseStatus, FormInstance } from '@/types'
import z from 'zod'
import { BookOpen } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { CaseStatusMenu } from '../../common/menus/case-status-menu'
import { CasePriorityMenu } from '../../common/menus/case-priority-menu'
import { Textarea } from '@/components/ui/textarea'

interface CaseBasicInfoProps {
  form: FormInstance<z.infer<typeof CaseSchema>>
}

export function CaseBasicInfo({ form }: CaseBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Case Information
        </CardTitle>
        <CardDescription>
          Provide the details and assignees for this case.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator />

        {/* Title */}
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                  placeholder="Brief summary of the issue"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        {/* Description */}
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
                  className="min-h-[100px]"
                  placeholder="Detailed description of the issue"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        {/* Status and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="status"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <CaseStatusMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val as CaseStatus)}
                    isInvalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="priority"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                  <CasePriorityMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val as CasePriority)}
                    isInvalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="categoryId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                  <CaseCategoryMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    isInvalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Subscribe
            selector={(state) => [state.values.categoryId]}
            children={([categoryId]) => (
              <form.Field
                name="subcategoryId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Subcategory</FieldLabel>
                      <CaseSubcategoryMenu
                        id={field.name}
                        value={field.state.value}
                        categoryId={categoryId}
                        onChange={(val) => field.handleChange(val)}
                        isInvalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            )}
          />
        </div>

        {/* Affected Service and Business Line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="affectedServiceId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Affected Service</FieldLabel>
                  <BusinessLineMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                    isInvalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="businessLineId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Business Line</FieldLabel>
                  <BusinessLineMenu
                    id={field.name}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val as any)}
                    isInvalid={isInvalid}
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
