'use client'

import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Calendar, Phone, User, Package, AlertOctagon, FileDown, Truck } from "lucide-react"
import { format } from "date-fns"
import { AssignRiderDialog } from "@/components/modules/pickup/AssignRiderDialog"
import { PickupStatusUpdate } from "@/components/modules/pickup/PickupStatusUpdate"
import { downloadLabel } from "@/lib/download-util"

export default function PickupDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const pickup = useAppSelector((state) =>
        state.pickups.items.find((p) => p.id === id)
    )

    if (!pickup) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-2xl font-bold">Pickup Not Found</h2>
                <p className="text-muted-foreground">The pickup request with ID {id} could not be found.</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pickups
                </Button>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Requested': return 'secondary';
            case 'Assigned': return 'default';
            case 'Picked': return 'outline';
            case 'Failed': return 'destructive';
            default: return 'secondary';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#ff9400]/10 mr-2">
                    <Truck className="h-6 w-6 text-[#ff9400]" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pickup Details</h2>
                    <p className="text-muted-foreground">Request ID: {pickup.requestId}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" onClick={() => downloadLabel(pickup.id, 'pickup')}>
                        <FileDown className="mr-2 h-4 w-4" /> Label
                    </Button>
                    <Badge className="text-base px-4 py-1" variant={getStatusColor(pickup.status)}>
                        {pickup.status}
                    </Badge>
                    {pickup.status === 'Requested' && (
                        <AssignRiderDialog pickupId={pickup.id} />
                    )}
                    <PickupStatusUpdate pickup={pickup} />
                </div>
            </div>

            {pickup.status === 'Failed' && (
                <div className="bg-destructive/10 rounded-md p-4 text-destructive flex items-start gap-3">
                    <AlertOctagon className="h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-semibold">Pickup Failed</h4>
                        <p className="text-sm mt-1">Reason: {pickup.failureReason}</p>
                        {pickup.remarks && <p className="text-sm mt-1 text-destructive/80">Remarks: {pickup.remarks}</p>}
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Pickup Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" /> Pickup Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                                <p className="font-medium">{pickup.serviceType}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">AWB Number</p>
                                <p className="font-medium">{pickup.awbNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Scheduled Date</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{format(new Date(pickup.scheduledDate), 'PPP')}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Rider Assigned</p>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">
                                    {pickup.riderId ? `Rider ${pickup.riderId}` : 'Not Assigned'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Contact Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Contact Name</p>
                            <p className="font-medium">{pickup.contactName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">{pickup.contactPhone}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pickup Address</p>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                <p className="font-medium">{pickup.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
