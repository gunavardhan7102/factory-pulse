"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Cpu,
  Boxes,
  Network,
  LineChart,
  Wrench,
  Tablet,
  Bot,
  Bell,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const nav = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "manager"] },
  { title: "Machines", href: "/machines", icon: Cpu, roles: ["manager"] },
  { title: "Digital Twins", href: "/digital-twin", icon: Boxes, roles: ["manager"] },
  { title: "Connectivity", href: "/connectivity", icon: Network, roles: ["manager"] },
  { title: "Analytics", href: "/analytics", icon: LineChart, roles: ["manager"] },
  { title: "Maintenance", href: "/maintenance", icon: Wrench, roles: ["manager"] },
  { title: "Mobile Workspace", href: "/technician", icon: Tablet, roles: ["technician"] },
  { title: "AI Copilot", href: "/copilot", icon: Bot, roles: ["manager"] },
  { title: "Alerts", href: "/alerts", icon: Bell, roles: ["manager"] },
  { title: "User Management", href: "/admin/users", icon: Users, roles: ["admin"] },
  { title: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"] },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
    router.refresh()
  }

  // Filter navigation based on user role
  const filteredNav = nav.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Wrench className="size-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-sidebar-foreground">FactoryPulse AI</span>
            <span className="text-xs text-sidebar-foreground/60">Predictive Maintenance</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNav.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.title}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-3">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex flex-col leading-tight flex-1">
                <span className="text-xs font-medium text-sidebar-foreground">{user.name}</span>
                <span className="text-[11px] text-sidebar-foreground/60 capitalize">{user.role.replace('-', ' ')}</span>
              </div>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
