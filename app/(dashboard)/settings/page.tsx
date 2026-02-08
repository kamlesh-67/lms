'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Plug, CreditCard, Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your platform preferences and system configurations.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/5 min-w-[200px]">
          <Tabs defaultValue="general" orientation="vertical" className="h-full w-full">
            <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-1 md:items-stretch w-full">
              <TabsTrigger
                value="general"
                className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
              >
                <User className="mr-2 h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
              >
                <Plug className="mr-2 h-4 w-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Content would be rendered outside the list but Tabs component usually wraps both. 
                Standard Tabs structure:
                <Tabs>
                  <TabsList>...</TabsList>
                  <TabsContent>...</TabsContent>
                </Tabs>
                Here I split layout with flex. The TabsContent needs to be children of Tabs.
                Wait, TabsContent must be inside Tabs.
                So I should wrap the flex container INSIDE Tabs?
                Or move Tabs up.
            */}
            <div className="hidden">
              {/* Dummy content to satisfy TS if needed, but actually I need to restructure */}
            </div>
          </Tabs>
        </aside>

        <div className="flex-1">
          {/* We need the Tabs context to control content. Re-structuring: */}
          <Tabs defaultValue="general" orientation="vertical" className="flex flex-col md:flex-row gap-8 w-full">
            <aside className="md:w-1/5 min-w-[200px]">
              <TabsList className="flex md:flex-col h-auto bg-transparent p-0 gap-1 md:items-stretch w-full">
                <TabsTrigger
                  value="general"
                  className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
                >
                  <User className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
                >
                  <Plug className="mr-2 h-4 w-4" />
                  Integrations
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="justify-start px-3 py-2 h-9 data-[state=active]:bg-muted data-[state=active]:text-foreground shadow-none rounded-md w-full"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </TabsTrigger>
              </TabsList>
            </aside>

            <div className="flex-1 space-y-6">
              <TabsContent value="general" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Profile</h3>
                  <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
                </div>
                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Details</CardTitle>
                    <CardDescription>Make changes to your platform configuration here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform-name">Platform Name</Label>
                      <Input id="platform-name" defaultValue="LMD Logistics Portal" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Support Email</Label>
                      <Input id="support-email" defaultValue="support@lmd.com" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    </div>
                    <div className="pt-4">
                      <Button>Save changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Configure how you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Notification settings content...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your security settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Security settings content...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>Connect with third-party services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Integrations settings content...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your billing information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Billing settings content...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
