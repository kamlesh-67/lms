'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/store/hooks"
import { updatePickupStatus, Pickup } from "@/store/slices/pickupSlice"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PickupStatusUpdateProps {
  pickup: Pickup;
}

const FAILURE_REASONS = [
  "Consignee Not Available",
  "Incorrect Address",
  "Package Not Ready",
  "Shop Closed",
  "Rider Overload",
  "Vehicle Breakdown",
  "Other"
]

export function PickupStatusUpdate({ pickup }: PickupStatusUpdateProps) {
  const dispatch = useAppDispatch()
  const [failDialogOpen, setFailDialogOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async (status: Pickup['status']) => {
    setLoading(true)
    try {
      await dispatch(updatePickupStatus({ id: pickup.id, status })).unwrap()
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFailureSubmit = async () => {
    if (!reason) return;
    setLoading(true)
    try {
      await dispatch(updatePickupStatus({ 
          id: pickup.id, 
          status: 'Failed',
          failureReason: reason,
          remarks: remarks
      })).unwrap()
      setFailDialogOpen(false)
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (pickup.status === 'Failed' || pickup.status === 'Picked') {
      return null; // No actions available for terminal states
  }

  return (
    <div className="flex gap-2">
      {pickup.status === 'Assigned' && (
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleStatusUpdate('Picked')}
            disabled={loading}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Picked
          </Button>
      )}

      {(pickup.status === 'Requested' || pickup.status === 'Assigned') && (
          <>
            <Button 
                variant="destructive"
                onClick={() => setFailDialogOpen(true)}
                disabled={loading}
            >
                <XCircle className="mr-2 h-4 w-4" /> Mark as Failed
            </Button>

            <Dialog open={failDialogOpen} onOpenChange={setFailDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" /> Report Pickup Failure
                        </DialogTitle>
                        <DialogDescription>
                            Please specify the reason for the pickup failure.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Failure Reason</Label>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {FAILURE_REASONS.map((r) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Remarks (Optional)</Label>
                            <Textarea 
                                value={remarks} 
                                onChange={(e) => setRemarks(e.target.value)} 
                                placeholder="Additional details..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFailDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleFailureSubmit} disabled={!reason || loading}>
                            Confirm Failure
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </>
      )}
    </div>
  )
}
