'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  )

  const demoUsers = [
    { name: 'Admin', email: 'admin@lmd.com', role: 'Full Access', color: 'bg-primary' },
    { name: 'Operations', email: 'ops.manager@lmd.com', role: 'Operations', color: 'bg-[#ff9400]' },
    { name: 'Supervisor', email: 'supervisor@lmd.com', role: 'Team Mgmt', color: 'bg-green-600' },
    { name: 'Warehouse', email: 'warehouse@lmd.com', role: 'Inventory', color: 'bg-blue-600' },
    { name: 'Driver', email: 'driver@lmd.com', role: 'Deliveries', color: 'bg-purple-600' },
    { name: 'Support', email: 'cs@lmd.com', role: 'Customer Service', color: 'bg-cyan-600' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-[#ff9400]/5 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10">
              <Package className="h-10 w-10 text-[#ff9400]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary tracking-tight">LMD Portal</h1>
              <p className="text-muted-foreground">Emirates Logistics Express</p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Enterprise Logistics Management</h2>
            <p className="text-muted-foreground text-lg">
              Streamline your logistics operations with our comprehensive platform for shipment tracking,
              fleet management, and delivery optimization.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Active Shipments</div>
              </div>
              <div className="p-4 rounded-lg bg-[#ff9400]/10">
                <div className="text-3xl font-bold text-[#ff9400]">15</div>
                <div className="text-sm text-muted-foreground">Manifests</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10">
                <div className="text-3xl font-bold text-green-600">10</div>
                <div className="text-sm text-muted-foreground">Active Riders</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10">
                <div className="text-3xl font-bold text-blue-600">6</div>
                <div className="text-sm text-muted-foreground">User Roles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@lmd.com"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password@123"
                    required
                    disabled={isPending}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Users Quick Login */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Demo Users - Quick Login</CardTitle>
              <CardDescription>All users use password: Password@123</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {demoUsers.map((user) => (
                  <form key={user.email} action={formAction}>
                    <input type="hidden" name="email" value={user.email} />
                    <input type="hidden" name="password" value="Password@123" />
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full p-3 rounded-lg border hover:border-primary transition-all text-left hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`h-2 w-2 rounded-full ${user.color}`} />
                        <div className="text-sm font-medium group-hover:text-primary transition-colors">
                          {user.name}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </button>
                  </form>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            © 2026 Emirates Logistics Express. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
