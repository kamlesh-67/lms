'use client'

import { useParams, useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, MapPin, Calendar, Truck, User, Edit, XCircle, FileDown } from "lucide-react"
import Link from "next/link"
import { CancelShipmentDialog } from "@/components/modules/shipment/CancelShipmentDialog"
import { downloadShipmentLabel } from "@/lib/download-util"

export default function ShipmentDetailsPage() {
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
                <p className="text-muted-foreground">The shipment with ID {id} could not be found.</p>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
                </Button>
            </div>
        )
    }

    const isEditable = ['Created', 'Pickup Assigned'].includes(shipment.status);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mr-2">
                    <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Shipment Details</h2>
                    <p className="text-muted-foreground">AWB: {shipment.awb}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" onClick={() => downloadShipmentLabel(shipment)}>
                        <FileDown className="mr-2 h-4 w-4" /> Label
                    </Button>
                    <Badge className="text-base px-4 py-1" variant={shipment.status === 'Delivered' ? 'default' : 'secondary'}>
                        {shipment.status}
                    </Badge>
                    {isEditable && (
                        <>
                            <Link href={`/shipments/${id}/edit`}>
                                <Button variant="outline">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                            </Link>
                            <CancelShipmentDialog shipmentId={id} />
                        </>
                    )}
                </div>
            </div>

            {shipment.status === 'Cancelled' && shipment.cancellationReason && (
                <div className="bg-destructive/10 rounded-md p-4 text-destructive flex items-start gap-3">
                    <XCircle className="h-5 w-5 mt-0.5" />
                    <div>
                        <h4 className="font-semibold">Shipment Cancelled</h4>
                        <p className="text-sm mt-1">Reason: {shipment.cancellationReason}</p>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Shipment Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" /> Shipment Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                                <p className="font-medium">{shipment.orderId}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                                <p className="font-medium">{shipment.serviceType}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Weight</p>
                                <p className="font-medium">{shipment.weight} kg</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                <p className="font-medium">{new Date(shipment.timeline[0].timestamp).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Consignee Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Consignee Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Name</p>
                            <p className="font-medium">{shipment.consigneeName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="font-medium">{shipment.consigneePhone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                <p className="font-medium">{shipment.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" /> Shipment Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative ml-4 space-y-8 pb-4">
                        {[...shipment.timeline]
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Newest first for "tracking" feel, or oldest first? "Chronological" usually implies oldest to newest. Let's do Newest first as it's more standard for LMD. Wait, User said "Chronological". That usually means 1, 2, 3. I'll stick to Oldest -> Newest (Ascending) which matches the visual "flow" down.
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((event, index) => (
                                <div key={index} className="relative pl-6">
                                    <div className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full ${index === shipment.timeline.length - 1 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{event.status}</span>
                                        <span className="text-sm text-muted-foreground">{event.location}</span>
                                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                            <span>{new Date(event.timestamp).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
