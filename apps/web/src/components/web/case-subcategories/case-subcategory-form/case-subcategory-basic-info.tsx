import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldError } from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BasicInfoFormProps } from '@/types/form'
import { CaseCategoryMenu } from '@/components/web/common/menus/case-category-menu'

export function CaseSubcategoryBasicInfo({ form }: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide the basic details for this case subcategory.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.Field
          name="name"
          children={(field: any) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Subcategory Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Broken Screen"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
            </div>
          )}
        />

        <form.Field
          name="category_id"
          children={(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Parent Category</Label>
                <CaseCategoryMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={isInvalid}
                />
                {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
              </div>
            )
          }}
        />

        <form.Field
          name="description"
          children={(field: any) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Brief description of this subcategory"
                className="min-h-[100px]"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && <FieldError errors={field.state.meta.errors} />}
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}
