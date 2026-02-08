'use client'

import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { ShipmentForm } from "@/components/modules/shipment/ShipmentForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function EditShipmentPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const shipment = useAppSelector((state) => 
    state.shipments.items.find((s) => s.id === id)
  )

  if (!shipment) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold">Shipment Not Found</h2>
            <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
    )
  }

  const isEditable = ['Created', 'Pickup Assigned'].includes(shipment.status);

  if (!isEditable) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h2 className="text-2xl font-bold">Editing Not Allowed</h2>
            <p className="text-muted-foreground text-center max-w-md">
                This shipment cannot be edited because it is already <strong>{shipment.status}</strong>. 
                Only shipments in "Created" or "Pickup Assigned" status can be modified.
            </p>
            <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Shipment</h2>
      </div>
      <div className="max-w-2xl">
        <ShipmentForm initialData={shipment} isEdit={true} />
      </div>
    </div>
  )
}
