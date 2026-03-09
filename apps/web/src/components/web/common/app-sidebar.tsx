import {
  BookOpen,
  Bot,
  Command,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Search,
  Send,
  Settings2,
  SquareTerminal,
  Sun,
} from 'lucide-react'

import { NavMain } from '@/components/web/common/nav-main'
import { NavProjects } from '@/components/web/common/nav-projects'
import { NavSecondary } from '@/components/web/common/nav-secondary'
import { NavUser } from '@/components/web/common/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Suspense } from 'react'
import { AuthUser } from '@/types'

const nav_items = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Foundation Data',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: 'Users',
          url: '/users',
        },
        {
          title: 'Groups',
          url: '/groups',
        },
        {
          title: 'Departments',
          url: '#',
        },
        {
          title: 'Roles',
          url: '/roles',
        },
        {
          title: 'Permissions',
          url: '/permissions',
        },
      ],
    },
    {
      title: 'Self Service',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Catalog',
          url: '#',
        },
        {
          title: 'My Requests',
          url: '#',
        },
        {
          title: 'My Approvals',
          url: '#',
        },
      ],
    },
    {
      title: 'Case Management',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'All Cases',
          url: '#',
        },
        {
          title: 'Create Case',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/settings',
        },
        {
          title: 'LDAP Management',
          url: '/settings/ldap',
        },
        {
          title: 'Email Mailboxes',
          url: '#',
        },
        {
          title: 'Notifications Manager',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
    {
      title: 'Theme',
      url: '#',
      icon: Sun,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
}

export function AppSidebar({ user }: { user?: AuthUser }) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">QoreDesk</span>
                  <span className="truncate text-xs">Enterprise Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={nav_items.navMain} />
        <NavProjects projects={nav_items.projects} />
        <NavSecondary items={nav_items.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div>Loading...</div>}>
          <NavUser user={user} />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  )
}
