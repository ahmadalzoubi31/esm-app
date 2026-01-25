import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save } from 'lucide-react'
import { LdapConfig, LdapConfigSchema } from '@/schemas/settings/ldap.schema'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import TabTitle from './tab-title'
import CustomAttributesSection from './custom-attribute'
import { useLdapConfigQuery } from '@/lib/queries/ldap.query'
import {
  useUpdateLdapConfigMutation,
  useTestLdapConnectionMutation,
  useLdapSyncMutation,
  useLdapPreviewMutation,
} from '@/lib/mutations/ldap.mutation'
import { useForm } from '@tanstack/react-form'

export default function ConfigurationTab() {
  const { data: configData } = useLdapConfigQuery()

  const updateMutation = useUpdateLdapConfigMutation()
  const testMutation = useTestLdapConnectionMutation()
  const syncMutation = useLdapSyncMutation()
  const previewMutation = useLdapPreviewMutation()

  const form = useForm({
    defaultValues: {
      host: '',
      port: 389,
      bindDn: '',
      bindPassword: '',
      baseDn: '',
      userFilter: '(objectClass=person)',
      scopeFilter: 'sub',
      useSsl: false,
      enabled: false,
      attributeMapping: {
        // Required fields
        firstName: 'givenName',
        lastName: 'sn',
        username: 'sAMAccountName',
        // Optional standard fields
        email: 'mail',
        phone: '',
        department: '',
        manager: '',
        // Metadata fields
        mobilePhone: 'mobile',
        title: '',
        company: '',
        employeeId: '',
        employeeType: '',
        location: '',
        city: '',
        state: '',
        country: '',
        userPrincipalName: '',
        customAttributes: {},
      },
    } as LdapConfig,
    validators: {
      onSubmit: LdapConfigSchema,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(value)
    },
  })

  async function onTestConnection() {
    // We can use form.store.state.values to get current values without submission
    const values = form.store.state.values
    await testMutation.mutateAsync(values)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <div className="flex items-center justify-between">
              <TabTitle
                title="Connection Settings"
                description="Configure the connection details for your LDAP server."
              />
              <form.Field
                name="enabled"
                children={(field) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ldap-enabled"
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                    />
                    <label
                      htmlFor="ldap-enabled"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable LDAP
                    </label>
                  </div>
                )}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <form.Field
                name="host"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Host</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="ldap.example.com"
                      />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        LDAP server hostname or IP address.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="port"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Port</FieldLabel>
                      <Input
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        Default: 389 (LDAP), 636 (LDAPS).
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="useSsl"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Security</FieldLabel>
                      <Select
                        value={field.state.value ? 'ssl' : 'none'}
                        onValueChange={(value) =>
                          field.handleChange(value === 'ssl')
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select security" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ssl">SSL/TLS</SelectItem>
                          <SelectItem value="starttls">StartTLS</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        Connection encryption method.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <form.Field
                name="baseDn"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Base DN</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="dc=example,dc=com"
                      />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        The root of the LDAP directory tree to search.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="bindDn"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Bind DN</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="cn=admin,dc=example,dc=com"
                      />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        The Distinguished Name (DN) of the user to bind as.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="bindPassword"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Bind Password</FieldLabel>
                      <Input
                        name={field.name}
                        type="password"
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="********"
                      />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        Update only if you want to change the password.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="userFilter"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>User Filter</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="(objectClass=person)"
                      />
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        LDAP filter to identify user objects.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="scopeFilter"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Scope</FieldLabel>
                      <Select
                        value={field.state.value || 'sub'}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sub">Sub</SelectItem>
                          <SelectItem value="one">One Level</SelectItem>
                          <SelectItem value="base">Base</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription className="text-[0.8rem] text-muted-foreground">
                        Search depth: Sub (all levels), One Level (direct
                        children), or Base (exact match).
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-7">
          <CardHeader>
            <TabTitle
              title="Attribute Mapping"
              description="Map LDAP attributes to user profile fields. Required fields must
              be mapped for LDAP sync to work."
            />
          </CardHeader>
          <CardContent className="space-y-10">
            {/* Required Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">Required Fields</h4>
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="attributeMapping.firstName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          First Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="givenName"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name="attributeMapping.lastName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Last Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="sn"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </div>
              <form.Field
                name="attributeMapping.username"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>
                        Username <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="sAMAccountName"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </div>

            {/* Optional Standard Fields */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">
                Optional Standard Fields
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <form.Field
                  name="attributeMapping.email"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="mail"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.phone"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="telephoneNumber"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.department"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="department"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.manager"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Manager</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="manager"
                      />
                    </Field>
                  )}
                />

                <form.Field
                  name="attributeMapping.mobilePhone"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Mobile Phone</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="mobile"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.title"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="title"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.company"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Company</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="company"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.employeeId"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Employee ID</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="employeeNumber"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.employeeType"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Employee Type</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="employeeType"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.location"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Location</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="physicalDeliveryOfficeName"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.city"
                  children={(field) => (
                    <Field>
                      <FieldLabel>City</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="l"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.state"
                  children={(field) => (
                    <Field>
                      <FieldLabel>State</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="st"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.country"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Country</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="c"
                      />
                    </Field>
                  )}
                />
                <form.Field
                  name="attributeMapping.userPrincipalName"
                  children={(field) => (
                    <Field>
                      <FieldLabel>User Principal Name</FieldLabel>
                      <Input
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="userPrincipalName"
                      />
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* Custom Attributes */}
            <CustomAttributesSection form={form} />
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onTestConnection}
          //   disabled={testMutation.isPending}
        >
          {/* {testMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )} */}
          Test Connection
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </form>
  )
}
