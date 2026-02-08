'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Plug, CreditCard, Settings as SettingsIcon, FileText } from "lucide-react"

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
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notifications-email" className="flex flex-col space-y-1">
                    <span>Email Notifications</span>
                    <span className="font-normal text-xs text-muted-foreground">Receive daily summaries and critical alerts via email.</span>
                  </Label>
                  <Switch id="notifications-email" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notifications-sms" className="flex flex-col space-y-1">
                    <span>SMS Notifications</span>
                    <span className="font-normal text-xs text-muted-foreground">Get real-time updates for shipments on your phone.</span>
                  </Label>
                  <Switch id="notifications-sms" />
                </div>
                <Separator />
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="notifications-push" className="flex flex-col space-y-1">
                    <span>Push Notifications</span>
                    <span className="font-normal text-xs text-muted-foreground">Receive push notifications in your browser.</span>
                  </Label>
                  <Switch id="notifications-push" defaultChecked />
                </div>
                <div className="pt-4">
                  <Button variant="outline">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your security settings and password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="pt-2">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="2fa-toggle" className="flex flex-col space-y-1">
                    <span>Enable 2FA</span>
                    <span className="font-normal text-xs text-muted-foreground">Secure your account with an authentication app.</span>
                  </Label>
                  <Switch id="2fa-toggle" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>Manage your third-party integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">S</div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Shopify</p>
                      <p className="text-sm text-muted-foreground">Sync orders and shipments.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">W</div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">WooCommerce</p>
                      <p className="text-sm text-muted-foreground">Connect your WordPress store.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">Sl</div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Slack</p>
                      <p className="text-sm text-muted-foreground">Receive notifications in your channel.</p>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">Connected</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Manage your API keys for custom integrations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Public Key</Label>
                  <div className="flex space-x-2">
                    <Input readOnly value="pk_live_51M..." className="font-mono text-sm" />
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Copy</span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006V2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00006H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006L2.5 1.00006C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50006C5 4.67163 5.67157 4.00006 6.5 4.00006H13.5C14.3284 4.00006 15 4.67163 15 5.50006V12.5001C15 13.3285 14.3284 14.0001 13.5 14.0001H6.5C5.67157 14.0001 5 13.3285 5 12.5001V5.50006ZM6 5.50006H14V12.5001H6V5.50006Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan & Billing</CardTitle>
                <CardDescription>Manage your subscription and payment method.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Professional Plan</p>
                    <p className="text-sm text-muted-foreground">$49/month, billed monthly</p>
                  </div>
                  <Button variant="outline" size="sm">Change Plan</Button>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">Payment Method</h4>
                  <div className="flex items-center space-x-4">
                    <div className="h-8 w-12 bg-slate-100 rounded border flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-500">VISA</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Visa ending in 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/2026</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">Invoice #0012</p>
                      <p className="text-xs text-muted-foreground">Paid on Feb 01, 2026</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">$49.00</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">Invoice #0011</p>
                      <p className="text-xs text-muted-foreground">Paid on Jan 01, 2026</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">$49.00</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

    </div>
  )
}
