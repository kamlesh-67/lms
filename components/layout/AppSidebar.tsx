"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Truck,
  Package,
  RotateCcw,
  FileText,
  BarChart3,
  MapPin,
  ShieldAlert,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

interface Route {
  name: string;
  path: string;
  icon: any;
  roles?: string[];
  shortcut?: string;
}

const routes: Route[] = [
  { name: 'Dashboard', path: '/', icon: BarChart3, shortcut: 'D' },
  { name: 'Shipments', path: '/shipments', icon: Package, shortcut: 'S' },
  { name: 'Pickups', path: '/pickups', icon: Truck, shortcut: 'P' },
  { name: 'Tracking', path: '/tracking', icon: MapPin, shortcut: 'T' },
  { name: 'Returns', path: '/returns', icon: RotateCcw, shortcut: 'R' },
  { name: 'Documents', path: '/documents', icon: FileText, roles: ['Admin', 'Operations'], shortcut: 'O' },
  { name: 'Settings', path: '/settings', icon: Settings, shortcut: ',' },
]

const adminRoutes: Route[] = [
  { name: 'Audit Logs', path: '/admin/audit', icon: ShieldAlert, shortcut: 'A' },
  { name: 'API History', path: '/admin/api-history', icon: Activity, shortcut: 'H' },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const userRole = session?.user?.role
  const isLoading = status === 'loading'
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  const filteredRoutes = routes.filter(route =>
    !route.roles || (userRole && route.roles.includes(userRole))
  )

  const filteredAdminRoutes = userRole === 'Admin' ? adminRoutes : []

  const showExpanded = !isCollapsed || isHovered

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-sidebar-border bg-card transition-all duration-300 ease-in-out",
        showExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => isCollapsed && setIsHovered(false)}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center shadow-sm transition-all duration-300 p-4",
        showExpanded ? "justify-end" : "justify-center"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="h-8 w-8"
        >
          {showExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {filteredRoutes.map((route) => (
          <Link key={route.path} href={route.path}>
            <Button
              variant={pathname === route.path ? 'default' : 'ghost'}
              className={cn(
                "w-full gap-3 transition-all duration-200",
                showExpanded ? "justify-start px-3" : "justify-center px-0",
                pathname === route.path && "shadow-sm"
              )}
              size={showExpanded ? "default" : "icon"}
            >
              <div className={cn(
                "flex items-center justify-center rounded-lg transition-all",
                pathname === route.path
                  ? "bg-[#ff9400]/10 text-[#ff9400] p-1.5"
                  : "text-[#061359] dark:text-muted-foreground p-1.5 hover:text-[#ff9400]"
              )}>
                <route.icon className="h-5 w-5" />
              </div>
              {showExpanded && (
                <span className="flex-1 text-left font-medium">{route.name}</span>
              )}
              {showExpanded && route.shortcut && (
                <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {route.shortcut}
                </kbd>
              )}
            </Button>
          </Link>
        ))}

        {filteredAdminRoutes.length > 0 && (
          <>
            {showExpanded && (
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </p>
              </div>
            )}
            {!showExpanded && (
              <div className="h-px bg-border my-2" />
            )}
            {filteredAdminRoutes.map((route) => (
              <Link key={route.path} href={route.path}>
                <Button
                  variant={pathname === route.path ? 'default' : 'ghost'}
                  className={cn(
                    "w-full gap-3 transition-all duration-200",
                    showExpanded ? "justify-start px-3" : "justify-center px-0",
                    pathname === route.path && "shadow-sm"
                  )}
                  size={showExpanded ? "default" : "icon"}
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-lg transition-all",
                    pathname === route.path
                      ? "bg-[#ff9400]/10 text-[#ff9400] p-1.5"
                      : "text-[#061359] p-1.5 hover:text-[#ff9400]"
                  )}>
                    <route.icon className="h-5 w-5" />
                  </div>
                  {showExpanded && (
                    <span className="flex-1 text-left font-medium">{route.name}</span>
                  )}
                  {showExpanded && route.shortcut && (
                    <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {route.shortcut}
                    </kbd>
                  )}
                </Button>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className={cn(
        "border-t border-sidebar-border p-3 transition-all duration-300",
        showExpanded ? "" : "flex justify-center"
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors",
          !showExpanded && "justify-center"
        )}>
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          {showExpanded && (
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate text-sm">
                {isLoading ? <Skeleton className="h-4 w-24" /> : (session?.user?.name || 'User')}
              </p>
              <p className="text-xs text-muted-foreground capitalize truncate">
                {isLoading ? <Skeleton className="h-3 w-16 mt-1" /> : (userRole || '')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
