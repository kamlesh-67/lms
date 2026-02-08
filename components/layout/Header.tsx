'use client'

import { Bell, User, LogOut, Settings, UserCircle, AlertCircle, Keyboard, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CommandMenu } from '@/components/layout/CommandMenu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

import { handleSignOut } from '@/lib/actions'
import { ThemeCustomizer } from "@/components/theme-customizer"
import { ModeToggle } from "@/components/theme-toggle"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onToggleShortcutsHelp: () => setShortcutsOpen(prev => !prev),
  })

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 shadow-sm">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
            <Package className="h-6 w-6 text-[#ff9400]" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-primary tracking-tight">LMS Portal</h1>
            <p className="text-[10px] text-muted-foreground leading-none">Emirates Logistics Express</p>
          </div>
        </div>

        {/* Search */}
        <CommandMenu />
        <div className="ml-auto flex items-center gap-2">
          {/* Keyboard Shortcuts Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShortcutsOpen(true)}
            className="hidden md:flex"
          >
            <Keyboard className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* <ThemeCustomizer /> */}
          <ModeToggle />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ff9400] border-2 border-background animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-1 p-2 max-h-[400px] overflow-y-auto">
                <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/10 shrink-0">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Shipment Delayed</p>
                    <p className="text-xs text-muted-foreground">AWB-123456 is stuck at customs.</p>
                    <p className="text-[10px] text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 shrink-0">
                    <UserCircle className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">New Rider Assigned</p>
                    <p className="text-xs text-muted-foreground">Ahmed joined the fleet.</p>
                    <p className="text-[10px] text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer justify-center text-primary font-medium"
                onClick={() => router.push('/notifications')}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ⌘P
                </kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/account')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  ⌘S
                </kbd>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSignOut()} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  )
}
