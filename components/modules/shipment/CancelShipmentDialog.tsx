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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/store/hooks"
import { cancelShipment } from "@/store/slices/shipmentSlice"
import { AlertTriangle, XCircle } from "lucide-react"

interface CancelShipmentDialogProps {
  shipmentId: string;
}

export function CancelShipmentDialog({ shipmentId }: CancelShipmentDialogProps) {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCancel = async () => {
    if (!reason.trim()) return;

    setLoading(true)
    try {
      await dispatch(cancelShipment({ id: shipmentId, reason })).unwrap()
      setOpen(false)
      setReason("")
    } catch (error) {
      console.error("Failed to cancel shipment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle className="mr-2 h-4 w-4" /> Cancel Shipment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
             <AlertTriangle className="h-5 w-5" /> Cancel Shipment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this shipment? This action cannot be undone.
            Please provide a reason for cancellation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Cancellation Reason</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Customer request, Incorrect details..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={!reason.trim() || loading}
          >
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
