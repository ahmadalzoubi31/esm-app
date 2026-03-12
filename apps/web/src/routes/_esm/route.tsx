import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AppBreadcrumb from '@/components/web/common/app-breadcrumb'
import { AppSidebar } from '@/components/web/common/app-sidebar'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { getContextUser } from '@/server/auth.server'

export const Route = createFileRoute('/_esm')({
  loader: async () => {
    const user = await getContextUser()
    return user
  },
  component: RouteComponent,
})

function RouteComponent() {
  const user = Route.useLoaderData()

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
