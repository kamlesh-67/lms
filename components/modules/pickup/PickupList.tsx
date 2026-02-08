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
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Calendar as CalendarIcon, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Pickup, fetchPickups } from '@/store/slices/pickupSlice'
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type SortConfig = {
  key: keyof Pickup | 'contact';
  direction: 'asc' | 'desc';
} | null;

export function PickupList() {
  const { items: pickups, loading } = useAppSelector((state) => state.pickups)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPickups())
  }, [dispatch])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [displayCount, setDisplayCount] = useState(20)
  const observerTarget = useRef<HTMLTableRowElement>(null)

  const filteredPickups = useMemo(() => {
    return pickups.filter((pickup) => {
      const matchesSearch =
        pickup.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pickup.awbNumber && pickup.awbNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pickup.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pickup.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || pickup.status === statusFilter;

      const matchesDate = !dateFilter || new Date(pickup.scheduledDate).toDateString() === dateFilter.toDateString();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [pickups, searchQuery, statusFilter, dateFilter]);

  const sortedPickups = useMemo(() => {
    if (!sortConfig) return filteredPickups;

    return [...filteredPickups].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Pickup];
      let bValue: any = b[sortConfig.key as keyof Pickup];

      if (sortConfig.key === 'contact') {
        aValue = a.contactName;
        bValue = b.contactName;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPickups, sortConfig]);

  const visiblePickups = useMemo(() => sortedPickups.slice(0, displayCount), [sortedPickups, displayCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayCount < sortedPickups.length) {
          setDisplayCount(prev => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayCount, sortedPickups.length]);

  const requestSort = (key: keyof Pickup | 'contact') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Pickup | 'contact') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ?
      <ArrowUp className="ml-2 h-4 w-4" /> :
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getStatusColor = (status: Pickup['status']) => {
    switch (status) {
      case 'Requested': return 'secondary';
      case 'Assigned': return 'default'; // blue-ish usually
      case 'Picked': return 'outline'; // or green if I had success variant
      case 'Failed': return 'destructive';
      default: return 'secondary';
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ID, AWB, Name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Requested">Requested</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Picked">Picked</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter ? format(dateFilter, "PPP") : <span>Filter Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {dateFilter && (
            <Button variant="ghost" size="icon" onClick={() => setDateFilter(undefined)}>
              <span className="sr-only">Clear date</span>
              <span aria-hidden="true">×</span>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort('requestId')}>
                <div className="flex items-center">ID {getSortIcon('requestId')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort('awbNumber')}>
                <div className="flex items-center">AWB {getSortIcon('awbNumber')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort('scheduledDate')}>
                <div className="flex items-center">Date {getSortIcon('scheduledDate')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort('contact')}>
                <div className="flex items-center">Contact {getSortIcon('contact')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort('address')}>
                <div className="flex items-center">Location {getSortIcon('address')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => requestSort('status')}>
                <div className="flex items-center">Status {getSortIcon('status')}</div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              [...Array(3)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))
            )}
            {!loading && visiblePickups.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No pickup requests found.
                </TableCell>
              </TableRow>
            )}
            {!loading && visiblePickups.length > 0 && (
              visiblePickups.map((pickup) => (
                <TableRow key={pickup.id}>
                  <TableCell className="font-medium">{pickup.requestId}</TableCell>
                  <TableCell className="font-mono text-xs">{pickup.awbNumber || '-'}</TableCell>
                  <TableCell>{format(new Date(pickup.scheduledDate), 'PP')}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{pickup.contactName}</span>
                      <span className="text-xs text-muted-foreground">{pickup.contactPhone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-[200px]" title={pickup.address}>{pickup.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(pickup.status)}>
                      {pickup.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/pickups/${pickup.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-500">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}

            {/* Sentinel */}
            <TableRow ref={observerTarget} className="h-px border-0" aria-hidden="true" />
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
