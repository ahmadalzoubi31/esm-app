import { createFileRoute } from '@tanstack/react-router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ConfigurationTab from '@/components/web/settings/ldap/configuration-tab'
import SynchronizationTab from '@/components/web/settings/ldap/synchronization-tab'
import HistoryTab from '@/components/web/settings/ldap/history-tab'
import StagingTab from '@/components/web/settings/ldap/staging-tab'

export const Route = createFileRoute('/_core/settings/ldap/')({
  component: LdapSettingsPage,
})

function LdapSettingsPage() {
  return (
    <div className="px-2 lg:px-3 py-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold tracking-tight">LDAP Management</h3>
          <p className="text-muted-foreground text-sm">
            Configure LDAP connection and synchronization settings.
          </p>
        </div>
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="synchronization">Synchronization</TabsTrigger>
          <TabsTrigger value="staging">Staging</TabsTrigger>
          <TabsTrigger value="history">Sync History</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <ConfigurationTab />
        </TabsContent>

        <TabsContent value="synchronization" className="space-y-4">
          <SynchronizationTab />
        </TabsContent>

        <TabsContent value="staging" className="space-y-4">
          <StagingTab />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
