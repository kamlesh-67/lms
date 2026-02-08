'use client'

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { selectRider, simulateRiderMovement } from "@/store/slices/trackingSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Navigation, User } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useMemo } from "react"

// Dynamically import LiveMap component to avoid SSR issues with Leaflet
const LiveMap = dynamic(() => import('@/components/modules/tracking/LiveMap').then(mod => ({ default: mod.LiveMap })), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted animate-pulse rounded-md flex items-center justify-center">Loading Map...</div>
})

import { ExceptionDashboard } from "@/components/modules/tracking/ExceptionDashboard"

export default function TrackingPage() {
    const dispatch = useAppDispatch()
    const { riders, selectedRiderId } = useAppSelector((state) => state.tracking)

    const selectedRider = riders.find(r => r.id === selectedRiderId) || riders[0]

    // Simulate rider movement every 3 seconds for the selected rider
    useEffect(() => {
        if (!selectedRider) return;

        const interval = setInterval(() => {
            if (selectedRider.status === 'Moving') {
                dispatch(simulateRiderMovement(selectedRider.id));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [dispatch, selectedRider]);

    const mapCenter: [number, number] = selectedRider
        ? [selectedRider.location.lat, selectedRider.location.lng]
        : [25.2048, 55.2708] // Default to Dubai

    const markers = useMemo(() => riders.map(rider => ({
        id: rider.id,
        position: [rider.location.lat, rider.location.lng] as [number, number],
        title: rider.name,
        description: `Status: ${rider.status}`
    })), [riders])

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-500/10">
                    <MapPin className="h-6 w-6 text-cyan-500" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Real-Time Tracking</h2>
            </div>
            <ExceptionDashboard />

            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {/* Sidebar List */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Navigation className="h-5 w-5" /> Live Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <ScrollArea className="h-[500px] md:h-full">
                                <div className="p-4 space-y-2">
                                    {riders.map((rider) => (
                                        <div
                                            key={rider.id}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${selectedRiderId === rider.id ? 'bg-muted shadow-sm' : ''}`}
                                            onClick={() => dispatch(selectRider(rider.id))}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{rider.name}</span>
                                                </div>
                                                <Badge variant={rider.status === 'Moving' ? 'default' : 'secondary'}>
                                                    {rider.status}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>Lat: {rider.location.lat.toFixed(4)}, Lng: {rider.location.lng.toFixed(4)}</span>
                                                </div>
                                                {rider.currentShipmentId && (
                                                    <p>Shipment: {rider.currentShipmentId}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Area */}
                <div className="flex-1 h-[500px] md:h-full rounded-md overflow-hidden">
                    <LiveMap
                        riders={riders.map(r => ({
                            id: r.id,
                            name: r.name,
                            lat: r.location.lat,
                            lng: r.location.lng,
                            status: r.status,
                            currentShipmentId: r.currentShipmentId
                        }))}
                        center={mapCenter}
                        zoom={13}
                        showRoutes={true}
                    />
                </div>
            </div>
        </div>
    )
}
