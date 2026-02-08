'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppDispatch } from "@/store/hooks"
import { updatePickupStatus } from "@/store/slices/pickupSlice"
import { Bike, User } from "lucide-react"

interface AssignRiderDialogProps {
  pickupId: string;
}

const MOCK_RIDERS = [
  { id: 'R001', name: 'Ahmed Khan', status: 'Available' },
  { id: 'R002', name: 'John Smith', status: 'Busy' },
  { id: 'R003', name: 'Ali Hassan', status: 'Available' },
]

export function AssignRiderDialog({ pickupId }: AssignRiderDialogProps) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [riderId, setRiderId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAssign = async () => {
    if (!riderId) return;

    setLoading(true)
    try {
      await dispatch(updatePickupStatus({ id: pickupId, status: 'Assigned', riderId })).unwrap()
      setOpen(false)
      setRiderId("")
    } catch (error) {
      console.error("Failed to assign rider:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Bike className="mr-2 h-4 w-4" /> Assign Rider
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
             <User className="h-5 w-5" /> Assign Rider
          </DialogTitle>
          <DialogDescription>
            Select a rider to assign to this pickup request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rider">Select Rider</Label>
            <Select value={riderId} onValueChange={setRiderId}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a rider" />
                </SelectTrigger>
                <SelectContent>
                    {MOCK_RIDERS.map((rider) => (
                        <SelectItem key={rider.id} value={rider.id}>
                            <div className="flex items-center justify-between w-full min-w-[200px]">
                                <span>{rider.name} ({rider.id})</span>
                                <span className={`text-xs ml-2 ${rider.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {rider.status}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!riderId || loading}
          >
            {loading ? 'Assigning...' : 'Assign Rider'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
