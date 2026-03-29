import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  DatabaseIcon,
  PlusCircle,
  Trash2,
  ListPlus,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { FormInstance } from '@/types'
import { UserDto } from '@repo/shared'

interface UserMetadataProps {
  form: FormInstance<UserDto>
}

const KNOWN_KEYS = [
  'title',
  'company',
  'manager',
  'employeeId',
  'employeeType',
  'userPrincipalName',
  'mobile',
  'location',
  'city',
  'state',
  'country',
]

export function UserMetadata({ form }: UserMetadataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon className="h-5 w-5" />
          Metadata
        </CardTitle>
        <CardDescription>
          Additional user details synced from external directories or added
          manually.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Job Details */}
          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground border-b pb-2">
              Professional Details
            </h4>
          </div>

          <FormField form={form} name="metadata.title" label="Job Title" />
          <FormField form={form} name="metadata.company" label="Company" />
          <FormField
            form={form}
            name="metadata.employeeId"
            label="Employee ID"
          />
          <FormField
            form={form}
            name="metadata.employeeType"
            label="Employee Type"
          />
          <FormField
            form={form}
            name="metadata.userPrincipalName"
            label="Principal Name (UPN)"
          />

          <FormField form={form} name="metadata.mobile" label="Mobile" />

          {/* Contact & Location */}
          <div className="md:col-span-2 lg:col-span-3 mt-4">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground border-b pb-2">
              Location
            </h4>
          </div>

          <FormField form={form} name="metadata.location" label="Location" />
          <FormField form={form} name="metadata.city" label="City" />
          <FormField form={form} name="metadata.state" label="State/Province" />
          <FormField form={form} name="metadata.country" label="Country" />

          {/* Additional Info */}
          {/* <div className="md:col-span-2 lg:col-span-3 mt-4">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground border-b pb-2">
              Other
            </h4>
          </div> */}

          {/* <div className="md:col-span-2 lg:col-span-3">
            <form.Field
              name="metadata.description"
              children={(field: any) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Additional notes or description..."
                      className="min-h-[100px]"
                    />
                  </FieldContent>
                </Field>
              )}
            />
          </div> */}

          {/* Custom Attributes */}
          {/* <div className="md:col-span-2 lg:col-span-3 mt-6">
            <CustomMetadataFields form={form} />
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}

function CustomMetadataFields({ form }: { form: any }) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <form.Field
      name="metadata"
      children={(field: any) => {
        const metadata = field.state.value || {}
        // Identify Custom Keys
        const customKeys = Object.keys(metadata).filter(
          (key) => !KNOWN_KEYS.includes(key),
        )

        const handleAdd = () => {
          if (!newKey.trim()) {
            setError('Key name is required')
            return
          }
          if (KNOWN_KEYS.includes(newKey) || metadata.hasOwnProperty(newKey)) {
            setError('Key already exists or is reserved')
            return
          }

          field.handleChange({
            ...metadata,
            [newKey.trim()]: newValue,
          })
          setNewKey('')
          setNewValue('')
          setError(null)
        }

        const handleRemove = (keyToRemove: string) => {
          const { [keyToRemove]: _, ...rest } = metadata
          field.handleChange(rest)
        }

        // We also need to let user edit values of custom keys
        const handleCustomValueChange = (key: string, val: string) => {
          field.handleChange({
            ...metadata,
            [key]: val,
          })
        }

        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground border-b pb-2">
              <ListPlus className="h-4 w-4" />
              <h4 className="text-sm font-medium">Additional Attributes</h4>
            </div>

            {/* List of Additional Attributes */}
            {customKeys.length > 0 ? (
              <div className="space-y-3 mb-6">
                {customKeys.map((key) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="flex-1">
                      <FieldLabel htmlFor={`attr-${key}`} className="text-xs">
                        {key}
                      </FieldLabel>
                      <Input
                        id={`attr-${key}`}
                        value={metadata[key]}
                        onChange={(e) =>
                          handleCustomValueChange(key, e.target.value)
                        }
                        placeholder="Value"
                        className="h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 h-9 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(key)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic mb-4">
                No additional attributes added.
              </div>
            )}

            {/* Add New Attribute */}
            <div className="rounded-md border border-dashed p-4 bg-muted/20">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Add New Attribute
              </h5>
              <div className="grid gap-3 md:grid-cols-2 items-start">
                <div>
                  <Input
                    placeholder="Key (e.g. departmentCode)"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAdd()
                      }
                    }}
                  />
                  {error && (
                    <div className="flex items-center gap-1 text-destructive text-[10px] mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {error}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="h-9 flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAdd()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAdd}
                    className="h-9 shrink-0"
                  >
                    <PlusCircle className="mr-2 h-3.5 w-3.5" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    />
  )
}

function FormField({
  form,
  name,
  label,
  placeholder,
}: {
  form: any
  name: string
  label: string
  placeholder?: string
}) {
  return (
    <form.Field
      name={name}
      children={(field: any) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <FieldContent>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={placeholder || label}
                aria-invalid={isInvalid}
              />
            </FieldContent>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    />
  )
}
