import { FormInstance } from '@/types'
import { LdapConfig } from '@/schemas/settings/ldap.schema'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FieldLabel, FieldDescription, Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Trash2, PlusCircle } from 'lucide-react'

export default function CustomAttributesSection({
  form,
}: {
  form: FormInstance<LdapConfig>
}) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  return (
    <form.Field
      name="attributeMapping.customAttributes"
      children={(field) => {
        const customAttributes =
          (field.state.value as Record<string, string>) || {}
        const customKeys = Object.keys(customAttributes)

        const handleAdd = () => {
          if (!newKey.trim() || !newValue.trim()) return

          field.handleChange({
            ...customAttributes,
            [newKey.trim()]: newValue.trim(),
          })
          setNewKey('')
          setNewValue('')
        }

        const handleRemove = (keyToRemove: string) => {
          const { [keyToRemove]: _, ...rest } = customAttributes
          field.handleChange(rest)
        }

        const handleValueChange = (key: string, value: string) => {
          field.handleChange({
            ...customAttributes,
            [key]: value,
          })
        }

        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Custom Attributes</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Map additional Active Directory attributes to user metadata
                fields.
              </p>
            </div>

            {/* List of Custom Attributes */}
            {customKeys.length > 0 && (
              <div className="space-y-3">
                {customKeys.map((key) => (
                  <div key={key} className="grid grid-cols-2 gap-4 items-start">
                    <Field>
                      <FieldLabel>Field Name</FieldLabel>
                      <Input value={key} disabled className="bg-muted" />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        This will appear in user metadata.
                      </FieldDescription>
                    </Field>
                    <div className="flex gap-2">
                      <Field className="flex-1">
                        <FieldLabel>AD Attribute</FieldLabel>
                        <Input
                          value={customAttributes[key]}
                          onChange={(e) =>
                            handleValueChange(key, e.target.value)
                          }
                          placeholder="e.g., extensionAttribute1"
                        />
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8 h-10 w-10 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Custom Attribute */}
            <div className="rounded-md border border-dashed p-4 bg-muted/20">
              <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Add Custom Attribute
              </h5>
              <div className="grid grid-cols-2 gap-4 items-end">
                <Field>
                  <FieldLabel>Field Name</FieldLabel>
                  <Input
                    placeholder="e.g., badgeNumber"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAdd()
                      }
                    }}
                  />
                </Field>
                <div className="flex gap-2">
                  <Field className="flex-1">
                    <FieldLabel>AD Attribute</FieldLabel>
                    <Input
                      placeholder="e.g., extensionAttribute1"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAdd()
                        }
                      }}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAdd}
                    className="h-10 shrink-0"
                    disabled={!newKey.trim() || !newValue.trim()}
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
