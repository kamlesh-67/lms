'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { AlertTriangle, Clock, XCircle } from "lucide-react"

export function ExceptionDashboard() {
  const { items: shipments } = useAppSelector((state) => state.shipments)

  const delayedShipments = shipments.filter(s => s.status === 'Delayed' || s.isDelayed)
  const rtoShipments = shipments.filter(s => s.status === 'RTO' || s.isRTO)
  const failedShipments = shipments.filter(s => s.status === 'Failed')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delayed Shipments</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{delayedShipments.length}</div>
          <p className="text-xs text-muted-foreground">
            Shipments running behind schedule
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RTO (Return to Origin)</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rtoShipments.length}</div>
          <p className="text-xs text-muted-foreground">
            Shipments returning to hub
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{failedShipments.length}</div>
          <p className="text-xs text-muted-foreground">
            Delivery attempts failed
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
