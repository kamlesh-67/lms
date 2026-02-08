import { ShipmentForm } from "@/components/modules/shipment/ShipmentForm"
import { PackagePlus } from "lucide-react"

export default function CreateShipmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
          <PackagePlus className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Shipment</h2>
      </div>
      <div className="max-w-2xl">
        <ShipmentForm />
      </div>
    </div>
  )
}
