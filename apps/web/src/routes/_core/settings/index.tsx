import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BusinessLineSettings } from '@/components/web/settings/general/business-lines-settings'

export const Route = createFileRoute('/_core/settings/')({
  component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">General Settings</h2>
          <p className="text-muted-foreground">
            Manage your application's general settings and configurations.
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <BusinessLineSettings />
        </div>
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Overview of the current system status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm font-medium text-muted-foreground">Version</span>
                  <span className="text-sm font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm font-medium text-muted-foreground">Environment</span>
                  <span className="text-sm font-medium">Production</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
