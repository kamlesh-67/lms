'use client'

import { ShipmentList } from "@/components/modules/shipment/ShipmentList"
import { RotateCcw } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500/10">
            <RotateCcw className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Returns Management</h2>
            <p className="text-muted-foreground">Track and manage RTO (Return to Origin) shipments.</p>
          </div>
        </div>
      </div>

      <ShipmentList defaultStatus="RTO" hideStatusFilter />
    </div>
  )
}
