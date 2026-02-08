'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Lock, Download, AlertTriangle } from "lucide-react"
import { closeManifest, fetchManifests } from "@/store/slices/documentSlice"
import { lockShipments, fetchShipments } from "@/store/slices/shipmentSlice"
import { generateManifestPDF } from "@/lib/pdf-generator"
import { downloadCSV } from "@/lib/export-util"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ExportReportDialog } from "@/components/modules/reports/ExportReportDialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DocumentsPage() {
  const manifests = useAppSelector((state) => state.documents.manifests)
  const shipments = useAppSelector((state) => state.shipments.items)
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchManifests())
  }, [dispatch])

  const handleDownloadManifest = (manifestId: string) => {
    const manifest = manifests.find(m => m.id === manifestId)
    const manifestShipments = shipments.filter(s => s.manifestId === manifestId)

    if (manifest && manifestShipments.length > 0) {
      generateManifestPDF(manifest, manifestShipments)
    } else {
      toast({
        title: "Error",
        description: "Manifest not found or has no shipments",
        variant: "destructive"
      })
    }
  }

  const handleCloseManifest = async (manifestId: string) => {
    try {
      await dispatch(closeManifest(manifestId)).unwrap()
      dispatch(fetchShipments({})) // Refresh shipments to reflect locked status

      toast({
        title: "Manifest Closed",
        description: `Manifest has been closed and shipments locked.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close manifest",
        variant: "destructive"
      })
    }
  }

  const handleExportReport = () => {
    const reportData = manifests.map(m => ({
      ManifestID: m.manifestRef || m.id,
      Date: m.date,
      Status: m.status,
      ShipmentCount: m.shipmentCount,
      GeneratedBy: m.generatedBy,
      ClosedAt: m.closedAt || ''
    }));

    downloadCSV(reportData, `manifest-report-${new Date().toISOString().split('T')[0]}.csv`);

    toast({
      title: "Report Exported",
      description: "Daily manifest report has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documents & Manifests</h2>
          <p className="text-muted-foreground">Manage shipping labels, manifests, and end-of-day reports.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>End-of-Day Operations</CardTitle>
            <CardDescription>Close daily manifests and generate final reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="flex-1">
                <h4 className="font-semibold">Pending Closures</h4>
                <p className="text-sm text-muted-foreground">
                  {manifests.filter(m => m.status === 'Open').length} open manifests require attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common documentation tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/shipments">
                <FileText className="mr-2 h-4 w-4" /> Bulk Label Print
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manifest History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manifest ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shipments</TableHead>
                <TableHead>Generated By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manifests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No manifests found.</TableCell>
                </TableRow>
              ) : (
                manifests.map((manifest) => (
                  <TableRow key={manifest.id}>
                    <TableCell className="font-medium">{manifest.manifestRef || manifest.id}</TableCell>
                    <TableCell>{manifest.date}</TableCell>
                    <TableCell>
                      <Badge variant={manifest.status === 'Open' ? 'default' : 'secondary'}>
                        {manifest.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{manifest.shipmentCount}</TableCell>
                    <TableCell>{manifest.generatedBy}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadManifest(manifest.id)}>
                        <Download className="h-4 w-4 mr-2" /> PDF
                      </Button>

                      {manifest.status === 'Open' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Lock className="h-4 w-4 mr-2" /> Close
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Close Manifest {manifest.id}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. All shipments in this manifest will be locked and no further changes can be made.
                                A final report will be generated.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCloseManifest(manifest.id)}>
                                Confirm Close
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
