import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ShipmentList } from "@/components/modules/shipment/ShipmentList"

export default function ShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Shipments</h2>
        <Link href="/shipments/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Shipment
          </Button>
        </Link>
      </div>
      <ShipmentList />
    </div>
  )
}
