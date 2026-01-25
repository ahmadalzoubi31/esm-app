import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AppBreadcrumb from '@/components/web/common/app-breadcrumb'
import { AppSidebar } from '@/components/web/common/app-sidebar'
import { getProfileFn } from '@/server/auth.server'
import { AuthUser } from '@/types'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_core')({
  component: RouteComponent,
  loader: async () => {
    try {
      const user = await getProfileFn()
      return { user }
    } catch (error) {
      // If fetching user fails, redirect to login
      throw redirect({ to: '/login' })
    }
  },
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <SidebarProvider>
      <AppSidebar user={user as AuthUser} />
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
