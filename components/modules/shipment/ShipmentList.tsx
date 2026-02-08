'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Printer, FileText, Download } from "lucide-react"
import { Shipment, assignManifest, fetchShipments } from '@/store/slices/shipmentSlice'
import { Checkbox } from "@/components/ui/checkbox"
import { generateBulkLabelsPDF } from "@/lib/pdf-generator"
import { downloadCSV } from "@/lib/export-util"
import { createManifest } from "@/store/slices/documentSlice"
import { useToast } from "@/hooks/use-toast"

type SortConfig = {
  key: keyof Shipment | 'consignee';
  direction: 'asc' | 'desc';
} | null;

interface ShipmentListProps {
  defaultStatus?: string;
  hideStatusFilter?: boolean;
}

export function ShipmentList({ defaultStatus = 'all', hideStatusFilter = false }: ShipmentListProps) {
  const { items: shipments, loading, hasMore, page } = useAppSelector((state) => state.shipments)
  const dispatch = useAppDispatch()
  const observerTarget = useRef<HTMLTableRowElement>(null)
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>(defaultStatus)
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [isDebouncing, setIsDebouncing] = useState(false)

  // Debounced Search and Filter Effect
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      dispatch(fetchShipments({ page: 1, status: statusFilter, search: searchQuery }))
        .finally(() => setIsDebouncing(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, statusFilter, searchQuery]);

  // Infinite Scroll Effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore && !isDebouncing) {
          dispatch(fetchShipments({ page: page + 1, status: statusFilter, search: searchQuery }));
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [dispatch, loading, hasMore, page, statusFilter, searchQuery, isDebouncing]);

  const sortedShipments = useMemo(() => {
    if (!sortConfig) return shipments;

    return [...shipments].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Shipment];
      let bValue: any = b[sortConfig.key as keyof Shipment];

      if (sortConfig.key === 'consignee') {
        aValue = a.consigneeName;
        bValue = b.consigneeName;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [shipments, sortConfig]);

  const requestSort = (key: keyof Shipment | 'consignee') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Shipment | 'consignee') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ?
      <ArrowUp className="ml-2 h-4 w-4" /> :
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShipments(shipments.map(s => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedShipments(prev => [...prev, id]);
    } else {
      setSelectedShipments(prev => prev.filter(sid => sid !== id));
    }
  };

  const handleBulkPrint = () => {
    const selectedData = shipments.filter(s => selectedShipments.includes(s.id));
    generateBulkLabelsPDF(selectedData);
    toast({
      title: "Generating Labels",
      description: `Generating PDF labels for ${selectedData.length} shipments.`,
    });
  };

  const handleCreateManifest = async () => {
    const action = await dispatch(createManifest(selectedShipments));
    if (createManifest.fulfilled.match(action)) {
      const manifestId = action.payload.id;
      dispatch(assignManifest({ shipmentIds: selectedShipments, manifestId }));
      toast({
        title: "Manifest Created",
        description: `Manifest ${manifestId} created for ${selectedShipments.length} shipments.`,
      });
      setSelectedShipments([]);
    }
  };

  const handleExportCSV = () => {
    const dataToExport = selectedShipments.length > 0
      ? shipments.filter(s => selectedShipments.includes(s.id))
      : shipments;

    const formattedData = dataToExport.map(s => ({
      AWB: s.awb,
      OrderID: s.orderId,
      Consignee: s.consigneeName,
      Phone: s.consigneePhone,
      Address: s.address,
      Status: s.status,
      Weight: s.weight,
      Service: s.serviceType,
      Date: s.timeline[0]?.timestamp || ''
    }));

    downloadCSV(formattedData, `shipments-${new Date().toISOString().split('T')[0]}.csv`);

    toast({
      title: "Export Successful",
      description: `Exported ${formattedData.length} shipments to CSV.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 w-full md:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search AWB, Order, Phone..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {!hideStatusFilter && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Pickup Assigned">Pickup Assigned</SelectItem>
                <SelectItem value="Picked">Picked</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="icon" onClick={handleExportCSV} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {selectedShipments.length > 0 && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm text-muted-foreground hidden md:inline">
              {selectedShipments.length} selected
            </span>
            <Button variant="outline" size="sm" onClick={handleBulkPrint}>
              <Printer className="mr-2 h-4 w-4" /> Print Labels
            </Button>
            <Button variant="default" size="sm" onClick={handleCreateManifest}>
              <FileText className="mr-2 h-4 w-4" /> Create Manifest
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={shipments.length > 0 && selectedShipments.length === shipments.length}
                  onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('awb')}>
                AWB {getSortIcon('awb')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('orderId')}>
                Order ID {getSortIcon('orderId')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('consignee')}>
                Consignee {getSortIcon('consignee')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
                Status {getSortIcon('status')}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedShipments.includes(shipment.id)}
                    onCheckedChange={(checked) => toggleSelect(shipment.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{shipment.awb}</TableCell>
                <TableCell>{shipment.orderId}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{shipment.consigneeName}</span>
                    <span className="text-xs text-muted-foreground">{shipment.consigneePhone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    shipment.status === 'Delivered' ? 'default' :
                      shipment.status === 'Cancelled' ? 'destructive' :
                        shipment.status === 'Returned' ? 'destructive' : 'secondary'
                  }>
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/shipments/${shipment.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {(loading || isDebouncing) && (
              [...Array(3)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))
            )}

            {!loading && !isDebouncing && sortedShipments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No shipments found.
                </TableCell>
              </TableRow>
            )}

            <TableRow ref={observerTarget} className="h-px border-0" aria-hidden="true" />
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
