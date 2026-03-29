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
import { z } from 'zod'
import { FormInstance } from '@/types'
import { CategorySchema } from '@/schemas/category.schema'
import { CategoryMenu } from '@/components/web/common/menus/category-menu'

interface CategoryBasicInfoProps {
  form: FormInstance<z.infer<typeof CategorySchema>>
}

export function CategoryBasicInfo({ form }: CategoryBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Provide the basic details for this category.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.Field
          name="name"
          children={(field: any) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Category Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Hardware Issues"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
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
                placeholder="Brief description of this category"
                className="min-h-[100px]"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        />

        <form.Field
          name="parentId"
          children={(field: any) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Parent Category (Optional)</Label>
              <div className="text-sm text-muted-foreground mb-1">
                Select a parent category if this should be a subcategory.
              </div>
              <CategoryMenu
                id={field.name}
                value={field.state.value}
                tier={1}
                onChange={(val) => field.handleChange(val)}
                isInvalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        />
      </CardContent>
    </Card>
  )
}
