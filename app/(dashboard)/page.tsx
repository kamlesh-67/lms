import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, AlertCircle, CheckCircle2, TrendingUp, Clock } from "lucide-react"
import { Overview } from "@/components/dashboard/Overview"
import { RecentSales } from "@/components/dashboard/RecentSales"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your logistics overview</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#ff9400] hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#ff9400]/10">
              <Truck className="h-5 w-5 text-[#ff9400]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3 text-[#ff9400]" />
              <span className="text-[#ff9400] font-medium">+4</span> since last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground mt-1">Active deliveries</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exceptions</CardTitle>
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-red-500 font-medium mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Monthly shipment volume for the current year.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest shipment updates and milestones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/10 shrink-0">
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Shipment #AWB123456 created</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <div className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded">+1</div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Pickup completed for #ORD987</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
                <div className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">Success</div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#ff9400]/10 shrink-0">
                  <Truck className="h-4 w-4 text-[#ff9400]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Rider assigned to #AWB998877</p>
                  <p className="text-xs text-muted-foreground">32 minutes ago</p>
                </div>
                <div className="text-xs font-medium text-[#ff9400] bg-[#ff9400]/10 px-2 py-1 rounded">Assigned</div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500/10 shrink-0">
                  <Package className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Manifest #MAN-005 generated</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <div className="text-xs font-medium text-purple-500 bg-purple-500/10 px-2 py-1 rounded">Docs</div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/10 shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Failed delivery #AWB555444</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
