import { PickupList } from "@/components/modules/pickup/PickupList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PickupsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Pickup Requests</h2>
            <p className="text-muted-foreground">
            Manage your pickup requests and rider assignments.
            </p>
        </div>
        <Link href="/pickups/schedule">
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Schedule Pickup
            </Button>
        </Link>
      </div>
      <PickupList />
    </div>
  )
}
