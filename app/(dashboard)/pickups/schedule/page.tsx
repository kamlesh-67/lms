import { SchedulePickupForm } from "@/components/modules/pickup/SchedulePickupForm"
import { Truck } from "lucide-react"

export default function SchedulePickupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#ff9400]/10">
          <Truck className="h-6 w-6 text-[#ff9400]" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schedule Pickup</h2>
          <p className="text-muted-foreground">
            Create a new pickup request for your shipments.
          </p>
        </div>
      </div>
      <SchedulePickupForm />
    </div>
  )
}
