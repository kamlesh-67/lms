'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Package, MapPin } from 'lucide-react'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface RiderLocation {
    id: string
    name: string
    lat: number
    lng: number
    status: 'Idle' | 'Moving' | 'Offline'
    currentShipmentId?: string
}

interface ShipmentLocation {
    id: string
    awb: string
    lat: number
    lng: number
    status: string
}

interface LiveMapProps {
    riders?: RiderLocation[]
    shipments?: ShipmentLocation[]
    center?: [number, number]
    zoom?: number
    showRoutes?: boolean
}

export function LiveMap({
    riders = [],
    shipments = [],
    center = [25.2048, 55.2708], // Dubai coordinates
    zoom = 11,
    showRoutes = false
}: LiveMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Card className="h-[600px] flex items-center justify-center">
                <CardContent>
                    <p className="text-muted-foreground">Loading map...</p>
                </CardContent>
            </Card>
        )
    }

    // Custom icons
    const riderIcon = (status: string) => {
        const color = status === 'Moving' ? '#22c55e' : status === 'Idle' ? '#ff9400' : '#94a3b8'
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
        })
    }

    const shipmentIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #061359; width: 24px; height: 24px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
      </svg>
    </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    })

    // Sample route for demonstration
    const sampleRoute: [number, number][] = [
        [25.2048, 55.2708],
        [25.2148, 55.2808],
        [25.2248, 55.2908],
    ]

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Live Fleet Tracking
                    </CardTitle>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="gap-1">
                            <Truck className="h-3 w-3" />
                            {riders.length} Riders
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                            <Package className="h-3 w-3" />
                            {shipments.length} Shipments
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-[600px] relative">
                    <MapContainer
                        center={center}
                        zoom={zoom}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Render Riders */}
                        {riders.map((rider) => (
                            <Marker
                                key={rider.id}
                                position={[rider.lat, rider.lng]}
                                icon={riderIcon(rider.status)}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <p className="font-semibold">{rider.name}</p>
                                        <Badge
                                            variant={
                                                rider.status === 'Moving' ? 'default' :
                                                    rider.status === 'Idle' ? 'secondary' : 'outline'
                                            }
                                            className="mt-1"
                                        >
                                            {rider.status}
                                        </Badge>
                                        {rider.currentShipmentId && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Shipment: {rider.currentShipmentId}
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Render Shipments */}
                        {shipments.map((shipment) => (
                            <Marker
                                key={shipment.id}
                                position={[shipment.lat, shipment.lng]}
                                icon={shipmentIcon}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <p className="font-semibold">{shipment.awb}</p>
                                        <Badge variant="secondary" className="mt-1">
                                            {shipment.status}
                                        </Badge>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Render Routes */}
                        {showRoutes && (
                            <>
                                <Polyline
                                    positions={sampleRoute}
                                    color="#061359"
                                    weight={3}
                                    opacity={0.7}
                                    dashArray="10, 10"
                                />
                                {sampleRoute.map((pos, idx) => (
                                    <Circle
                                        key={idx}
                                        center={pos}
                                        radius={50}
                                        fillColor="#ff9400"
                                        fillOpacity={0.3}
                                        stroke={false}
                                    />
                                ))}
                            </>
                        )}
                    </MapContainer>

                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg z-[1000] border">
                        <p className="text-xs font-semibold mb-2">Legend</p>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span>Moving</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff9400]" />
                                <span>Idle</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-400" />
                                <span>Offline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary" />
                                <span>Shipment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
