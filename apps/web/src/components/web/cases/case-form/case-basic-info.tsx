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
import { CaseSubcategoryMenu } from '@/components/web/common/menus/case-subcategory-menu'
import { UserMenu } from '@/components/web/common/menus/user-menu'
import { BusinessLineMenu } from '@/components/web/common/menus/business-line-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CaseStatus, CasePriority } from '@/types/cases'
import { GroupMenu } from '../../common/menus/group-menu'

export function CaseBasicInfo({ form }: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Information</CardTitle>
        <CardDescription>
          Provide the details and assignees for this case.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.Field
          name="title"
          children={(field: any) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Brief summary of the issue"
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
                placeholder="Detailed description of the issue"
                className="min-h-[100px]"
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <FieldError errors={field.state.meta.errors} />
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="status"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Status</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(val) => field.handleChange(val as CaseStatus)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CaseStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />

          <form.Field
            name="priority"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Priority</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(val) =>
                    field.handleChange(val as CasePriority)
                  }
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CasePriority).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="category_id"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Category</Label>
                <CaseCategoryMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </div>
            )}
          />

          <form.Subscribe
            selector={(state: any) => [state.values.category_id]}
            children={([categoryId]: any) => (
              <form.Field
                name="subcategory_id"
                children={(field: any) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Subcategory</Label>
                    <CaseSubcategoryMenu
                      id={field.name}
                      value={field.state.value}
                      categoryId={categoryId}
                      onChange={(val) => field.handleChange(val)}
                      isInvalid={field.state.meta.errors.length > 0}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                )}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form.Field
            name="business_line_id"
            children={(field: any) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Business Line</Label>
                <BusinessLineMenu
                  id={field.name}
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                  isInvalid={field.state.meta.errors.length > 0}
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
