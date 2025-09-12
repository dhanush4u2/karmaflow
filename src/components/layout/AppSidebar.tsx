import { 
  LayoutDashboard, 
  Activity, 
  ShoppingCart, 
  FileText, 
  Settings,
  Leaf,
  Brain,
  Shield,
  LogOut
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "AI Analysis", url: "/ai-analysis", icon: Brain },
  { title: "Emissions Monitoring", url: "/monitoring", icon: Activity },
  { title: "Carbon Marketplace", url: "/marketplace", icon: ShoppingCart },
  { title: "Compliance & Reports", url: "/reporting", icon: FileText },
]

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"
  const { signOut } = useAuth()

  const isActive = (path: string) => currentPath === path
  
  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `${isActive 
      ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary" 
      : "hover:bg-accent hover:text-accent-foreground"
    } transition-all duration-200 rounded-r-lg`

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border"
    >
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-foreground">Carbon Platform</span>
            <span className="text-xs text-muted-foreground">Karnataka Industries</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className={getNavClasses}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className={getNavClasses}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 space-y-4 group-data-[collapsible=icon]:hidden">
          <div className="rounded-lg bg-success/10 border border-success/20 p-3">
            <div className="flex items-center gap-2 text-success">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Compliant</span>
            </div>
            <p className="text-xs text-success/80 mt-1">
              All emissions within regulatory limits
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}