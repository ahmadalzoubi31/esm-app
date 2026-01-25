import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Calendar, Info, Loader2, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import TabTitle from './tab-title'
import { useForm } from '@tanstack/react-form'
import {
  LdapSyncScheduleSchema,
  LdapSyncSchedule,
} from '@/schemas/settings/ldap.schema'
import { useUpdateLdapSyncScheduleMutation } from '@/lib/mutations'
import { useLdapScheduleQuery } from '@/lib/queries'

type Frequency = 'hourly' | 'daily' | 'weekly' | 'monthly'

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday', short: 'Sun' },
  { value: '1', label: 'Monday', short: 'Mon' },
  { value: '2', label: 'Tuesday', short: 'Tue' },
  { value: '3', label: 'Wednesday', short: 'Wed' },
  { value: '4', label: 'Thursday', short: 'Thu' },
  { value: '5', label: 'Friday', short: 'Fri' },
  { value: '6', label: 'Saturday', short: 'Sat' },
]

const PREDEFINED_TEMPLATES = [
  {
    name: 'Every Hour',
    description: 'Sync every hour on the hour',
    frequency: 'hourly' as Frequency,
    minute: '0',
    hour: '0',
    daysOfWeek: ['1'],
    dayOfMonth: '1',
  },
  {
    name: 'Daily at Midnight',
    description: 'Sync once daily at 00:00',
    frequency: 'daily' as Frequency,
    minute: '0',
    hour: '0',
    daysOfWeek: ['1'],
    dayOfMonth: '1',
  },
  {
    name: 'Daily at 2 AM',
    description: 'Sync once daily at 02:00 (recommended)',
    frequency: 'daily' as Frequency,
    minute: '0',
    hour: '2',
    daysOfWeek: ['1'],
    dayOfMonth: '1',
  },
  {
    name: 'Weekdays at 6 AM',
    description: 'Sync Monday-Friday at 06:00',
    frequency: 'weekly' as Frequency,
    minute: '0',
    hour: '6',
    daysOfWeek: ['1', '2', '3', '4', '5'],
    dayOfMonth: '1',
  },
  {
    name: 'Weekly on Sunday',
    description: 'Sync once per week on Sunday at 03:00',
    frequency: 'weekly' as Frequency,
    minute: '0',
    hour: '3',
    daysOfWeek: ['0'],
    dayOfMonth: '1',
  },
  {
    name: 'Monthly on 1st',
    description: 'Sync on the 1st of each month at 00:00',
    frequency: 'monthly' as Frequency,
    minute: '0',
    hour: '0',
    daysOfWeek: ['1'],
    dayOfMonth: '1',
  },
]

export default function SynchronizationTab() {
  const { data: scheduleData } = useLdapScheduleQuery()
  const updateMutation = useUpdateLdapSyncScheduleMutation()

  const [syncEnabled, setSyncEnabled] = useState(false)
  const [frequency, setFrequency] = useState<Frequency>('daily')
  const [minute, setMinute] = useState('0')
  const [hour, setHour] = useState('2')
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['1'])
  const [dayOfMonth, setDayOfMonth] = useState('1')

  const form = useForm({
    defaultValues: {
      syncEnabled: true,
      syncSchedule: '0 2 * * *',
      stagingMode: 'FULL_STAGING',
    } as LdapSyncSchedule,
    validators: {
      onSubmit: LdapSyncScheduleSchema as any,
    },
    onSubmit: async ({ value }) => {
      await updateMutation.mutateAsync(value)
    },
  })

  // Load existing config
  useEffect(() => {
    if (scheduleData?.data) {
      const schedule = scheduleData.data.syncSchedule
      if (schedule) {
        parseCronExpression(schedule)
        form.setFieldValue('syncSchedule', schedule)
      }
      if (scheduleData.data.syncEnabled !== undefined) {
        setSyncEnabled(scheduleData.data.syncEnabled)
        form.setFieldValue('syncEnabled', scheduleData.data.syncEnabled)
      }
      if (scheduleData.data.stagingMode) {
        form.setFieldValue('stagingMode', scheduleData.data.stagingMode)
      }
    }
  }, [scheduleData])

  // Generate cron expression whenever settings change
  useEffect(() => {
    if (syncEnabled) {
      const cron = generateCronExpression()
      form.setFieldValue('syncSchedule', cron)
    }
  }, [frequency, minute, hour, daysOfWeek, dayOfMonth, syncEnabled])

  // Update form when syncEnabled changes
  useEffect(() => {
    form.setFieldValue('syncEnabled', syncEnabled)
  }, [syncEnabled])

  function parseCronExpression(cron: string) {
    const parts = cron.split(' ')
    if (parts.length !== 5) return

    const [min, hr, dom, month, dow] = parts

    // Hourly
    if (hr === '*' && dom === '*' && month === '*' && dow === '*') {
      setFrequency('hourly')
      setMinute(min === '*' ? '0' : min)
      return
    }

    // Daily
    if (dom === '*' && month === '*' && dow === '*') {
      setFrequency('daily')
      setMinute(min)
      setHour(hr)
      return
    }

    // Weekly
    if (dom === '*' && month === '*' && dow !== '*') {
      setFrequency('weekly')
      setMinute(min)
      setHour(hr)
      setDaysOfWeek(dow.split(','))
      return
    }

    // Monthly
    if (dom !== '*' && month === '*' && dow === '*') {
      setFrequency('monthly')
      setMinute(min)
      setHour(hr)
      setDayOfMonth(dom)
      return
    }
  }

  function generateCronExpression(): string {
    switch (frequency) {
      case 'hourly':
        return `${minute} * * * *`
      case 'daily':
        return `${minute} ${hour} * * *`
      case 'weekly':
        return `${minute} ${hour} * * ${daysOfWeek.sort().join(',')}`
      case 'monthly':
        return `${minute} ${hour} ${dayOfMonth} * *`
      default:
        return '0 0 * * *'
    }
  }

  function getNextRunDescription(): string {
    switch (frequency) {
      case 'hourly':
        return `Syncs every hour at minute ${minute}`
      case 'daily':
        return `Syncs every day at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
      case 'weekly':
        const days = daysOfWeek
          .map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label)
          .join(', ')
        return `Syncs every ${days} at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
      case 'monthly':
        return `Syncs on day ${dayOfMonth} of every month at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
      default:
        return ''
    }
  }

  function applyTemplate(template: (typeof PREDEFINED_TEMPLATES)[0]) {
    setFrequency(template.frequency)
    setMinute(template.minute)
    setHour(template.hour)
    setDaysOfWeek(template.daysOfWeek)
    setDayOfMonth(template.dayOfMonth)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <TabTitle
                title="Automatic Synchronization"
                description="Configure when LDAP data should be automatically synchronized with your system."
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="sync-enabled" className="text-sm font-medium">
                {syncEnabled ? 'Enabled' : 'Disabled'}
              </Label>
              <Switch
                id="sync-enabled"
                checked={syncEnabled}
                onCheckedChange={setSyncEnabled}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!syncEnabled && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    Automatic Sync Disabled
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    LDAP data will not be automatically synchronized. You can
                    still trigger manual syncs from the History tab.
                  </p>
                </div>
              </div>
            </div>
          )}

          {syncEnabled && (
            <>
              {/* Predefined Templates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label>Quick Templates</Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PREDEFINED_TEMPLATES.map((template) => (
                    <Button
                      key={template.name}
                      type="button"
                      variant="outline"
                      className="h-auto flex-col items-start p-3 text-left"
                      onClick={() => applyTemplate(template)}
                    >
                      <span className="font-medium text-sm">
                        {template.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {template.description}
                      </span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click a template to quickly configure your sync schedule, or
                  customize below.
                </p>
              </div>

              <div className="border-t pt-6" />

              {/* Staging Mode Settings */}
              <div className="space-y-3">
                <Label>User Staging Mode</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Control how users are synchronized from LDAP. Choose whether
                  users should be reviewed before import or synced directly.
                </div>
                <form.Field
                  name="stagingMode"
                  children={(field) => (
                    <RadioGroup
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as any)
                      }
                      className="grid gap-3"
                    >
                      <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent">
                        <RadioGroupItem
                          value="FULL_STAGING"
                          id="full-staging"
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor="full-staging"
                            className="font-medium cursor-pointer"
                          >
                            Full Staging
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            All users (new and updated) go through staging for
                            review before import. Maximum control and safety.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent">
                        <RadioGroupItem
                          value="NEW_USERS_ONLY"
                          id="new-users-only"
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor="new-users-only"
                            className="font-medium cursor-pointer"
                          >
                            New Users Only
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Only new users go to staging. Existing users sync
                            directly for faster updates.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent">
                        <RadioGroupItem
                          value="DISABLED"
                          id="disabled-mode"
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label
                            htmlFor="disabled-mode"
                            className="font-medium cursor-pointer"
                          >
                            Disabled
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Direct sync - no staging. All users are created or
                            updated immediately (legacy behavior).
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">
                      Recommended:
                    </span>{' '}
                    Use "Full Staging" for production environments to ensure
                    data quality and prevent accidental imports.
                  </p>
                </div>
              </div>

              <div className="border-t pt-6" />

              {/* Frequency Selector */}
              <div className="space-y-3">
                <Label>Frequency</Label>
                <RadioGroup
                  value={frequency}
                  onValueChange={(v: string) => setFrequency(v as Frequency)}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <Label
                        htmlFor="hourly"
                        className="font-normal cursor-pointer"
                      >
                        Hourly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label
                        htmlFor="daily"
                        className="font-normal cursor-pointer"
                      >
                        Daily
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label
                        htmlFor="weekly"
                        className="font-normal cursor-pointer"
                      >
                        Weekly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label
                        htmlFor="monthly"
                        className="font-normal cursor-pointer"
                      >
                        Monthly
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                <FieldDescription className="text-[0.8rem] text-muted-foreground">
                  {frequency === 'hourly' &&
                    'Best for environments with frequent user changes. May increase server load.'}
                  {frequency === 'daily' &&
                    'Recommended for most organizations. Balances freshness with performance.'}
                  {frequency === 'weekly' &&
                    'Suitable for stable environments with infrequent changes.'}
                  {frequency === 'monthly' &&
                    'For organizations with minimal directory changes.'}
                </FieldDescription>
              </div>

              {/* Hourly Settings */}
              {frequency === 'hourly' && (
                <Field>
                  <FieldLabel>Minute of Hour</FieldLabel>
                  <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')} minutes past the hour
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription className="text-[0.8rem] text-muted-foreground">
                    The sync will run at this minute of every hour (e.g., 1:15,
                    2:15, 3:15, etc.)
                  </FieldDescription>
                </Field>
              )}

              {/* Daily Settings */}
              {frequency === 'daily' && (
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Hour (24h format)</FieldLabel>
                    <Select value={hour} onValueChange={setHour}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}:00
                            {i === 0 && ' (Midnight)'}
                            {i === 2 && ' (Recommended)'}
                            {i === 12 && ' (Noon)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription className="text-[0.8rem] text-muted-foreground">
                      Choose a time with low system usage (2-4 AM recommended).
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel>Minute</FieldLabel>
                    <Select value={minute} onValueChange={setMinute}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}

              {/* Weekly Settings */}
              {frequency === 'weekly' && (
                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Days of Week</FieldLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <div
                          key={day.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`day-${day.value}`}
                            checked={daysOfWeek.includes(day.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setDaysOfWeek([...daysOfWeek, day.value])
                              } else {
                                setDaysOfWeek(
                                  daysOfWeek.filter((d) => d !== day.value),
                                )
                              }
                            }}
                          />
                          <Label
                            htmlFor={`day-${day.value}`}
                            className="font-normal cursor-pointer"
                          >
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FieldDescription className="text-[0.8rem] text-muted-foreground">
                      Select one or more days. Weekends are ideal for minimal
                      disruption.
                    </FieldDescription>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Hour (24h format)</FieldLabel>
                      <Select value={hour} onValueChange={setHour}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Minute</FieldLabel>
                      <Select value={minute} onValueChange={setMinute}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              )}

              {/* Monthly Settings */}
              {frequency === 'monthly' && (
                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Day of Month</FieldLabel>
                    <Select value={dayOfMonth} onValueChange={setDayOfMonth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                            {i + 1 === 1 && 'st'}
                            {i + 1 === 2 && 'nd'}
                            {i + 1 === 3 && 'rd'}
                            {i + 1 > 3 && 'th'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription className="text-[0.8rem] text-muted-foreground">
                      For months with fewer days (e.g., February), the sync will
                      run on the last available day.
                    </FieldDescription>
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel>Hour (24h format)</FieldLabel>
                      <Select value={hour} onValueChange={setHour}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Minute</FieldLabel>
                      <Select value={minute} onValueChange={setMinute}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>
              )}

              {/* Schedule Preview */}
              <div className="rounded-md border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {generateCronExpression()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Cron Expression
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {getNextRunDescription()}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              Save Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
