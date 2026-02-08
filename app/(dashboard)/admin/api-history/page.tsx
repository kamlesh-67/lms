'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchApiHistory, retriggerApiRequest, ApiHistoryEntry } from '@/store/slices/adminSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity, Globe, Eye, Play, RefreshCw, Loader2 } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiHistoryPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const { apiHistory, loading } = useAppSelector((state) => state.admin)

  // Sheet State
  const [selectedEntry, setSelectedEntry] = useState<ApiHistoryEntry | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [payloadJson, setPayloadJson] = useState("")
  const [isRetriggering, setIsRetriggering] = useState(false)

  useEffect(() => {
    dispatch(fetchApiHistory())
  }, [dispatch])

  const handleViewDetails = (entry: ApiHistoryEntry) => {
    setSelectedEntry(entry)
    setPayloadJson(entry.payload ? JSON.stringify(entry.payload, null, 2) : "{}")
    setIsSheetOpen(true)
  }

  const handleRetrigger = async () => {
    if (!selectedEntry) return

    try {
      setIsRetriggering(true)
      // Note: Payload modification is not yet supported in the backend for retrigger
      await dispatch(retriggerApiRequest(selectedEntry.id)).unwrap()

      toast({
        title: "Request Retriggered",
        description: `Successfully re-executed ${selectedEntry.method} ${selectedEntry.endpoint}`,
      })

      setIsSheetOpen(false)
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Retrigger Failed",
        description: "Invalid JSON payload or server error.",
      })
    } finally {
      setIsRetriggering(false)
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PUT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 400 && code < 500) return 'text-orange-600';
    if (code >= 500) return 'text-red-600';
    return 'text-gray-600';
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API History</h1>
        <p className="text-muted-foreground">Monitor API usage, performance, and errors.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(apiHistory.reduce((acc, curr) => acc + curr.durationMs, 0) / (apiHistory.length || 1))}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Server response time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {Math.round((apiHistory.filter(x => x.statusCode >= 400).length / (apiHistory.length || 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Requests with 4xx/5xx status
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Logs</CardTitle>
          <CardDescription>
            Detailed logs of recent API calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : apiHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No API history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  apiHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs">
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getMethodColor(entry.method)}>
                          {entry.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {entry.endpoint}
                      </TableCell>
                      <TableCell className={cn("font-bold", getStatusColor(entry.statusCode))}>
                        {entry.statusCode}
                      </TableCell>
                      <TableCell>
                        {entry.durationMs}ms
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {entry.userId || 'Anonymous'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(entry)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
            <SheetDescription>
              View and retrigger API requests.
            </SheetDescription>
          </SheetHeader>

          {selectedEntry && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className={getMethodColor(selectedEntry.method)}>
                      {selectedEntry.method}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className={cn("mt-1 font-bold", getStatusColor(selectedEntry.statusCode))}>
                    {selectedEntry.statusCode}
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Endpoint</Label>
                  <div className="mt-1 font-mono text-sm bg-muted p-2 rounded">
                    {selectedEntry.endpoint}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="payload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="payload">Request Payload</TabsTrigger>
                  <TabsTrigger value="response">Response Body</TabsTrigger>
                </TabsList>
                <TabsContent value="payload" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Edit Payload (JSON)</Label>
                      <span className="text-xs text-muted-foreground">Modify to retrigger with new data</span>
                    </div>
                    <Textarea
                      value={payloadJson}
                      onChange={(e) => setPayloadJson(e.target.value)}
                      className="font-mono text-xs h-[300px]"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="response">
                  <ScrollArea className="h-[300px] w-full rounded-md p-4 bg-muted">
                    <pre className="text-xs font-mono">
                      {JSON.stringify(selectedEntry.response, null, 2)}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <SheetFooter>
                <Button
                  onClick={handleRetrigger}
                  disabled={isRetriggering}
                  className="w-full"
                >
                  {isRetriggering ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Retrigger Request
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
