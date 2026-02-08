'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, FileText, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { downloadCSV, downloadExcel, downloadJSON } from '@/lib/export-util'
import { generateReportPDF } from '@/lib/report-generator'

interface ExportReportDialogProps {
    data: any[]
    reportName: string
    columns?: string[]
    trigger?: React.ReactNode
}

const EXPORT_FORMATS = [
    {
        value: 'csv',
        label: 'CSV',
        description: 'Comma-separated values',
        icon: '📄',
    },
    {
        value: 'excel',
        label: 'Excel',
        description: 'Microsoft Excel format',
        icon: '📊',
    },
    {
        value: 'pdf',
        label: 'PDF',
        description: 'Portable Document Format',
        icon: '📑',
    },
    {
        value: 'json',
        label: 'JSON',
        description: 'JavaScript Object Notation',
        icon: '🔧',
    },
]

export function ExportReportDialog({
    data,
    reportName,
    columns,
    trigger,
}: ExportReportDialogProps) {
    const [open, setOpen] = useState(false)
    const [format, setFormat] = useState('csv')
    const [includeHeaders, setIncludeHeaders] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const { toast } = useToast()

    const handleExport = async () => {
        if (!data || data.length === 0) {
            toast({
                title: 'No Data',
                description: 'There is no data to export.',
                variant: 'destructive',
            })
            return
        }

        setIsExporting(true)
        try {
            const timestamp = new Date().toISOString().split('T')[0]
            const filename = `${reportName}-${timestamp}`

            switch (format) {
                case 'csv':
                    downloadCSV(data, `${filename}.csv`)
                    break
                case 'excel':
                    await downloadExcel(data, `${filename}.xlsx`, reportName)
                    break
                case 'pdf':
                    await generateReportPDF(data, reportName, `${filename}.pdf`)
                    break
                case 'json':
                    downloadJSON(data, `${filename}.json`)
                    break
            }

            toast({
                title: 'Export Successful',
                description: `${data.length} records exported as ${format.toUpperCase()}.`,
            })

            setOpen(false)
        } catch (error) {
            toast({
                title: 'Export Failed',
                description: 'Failed to export data. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#ff9400]/10">
                            <FileText className="h-5 w-5 text-[#ff9400]" />
                        </div>
                        <div>
                            <DialogTitle>Export Report</DialogTitle>
                            <DialogDescription>
                                {reportName} ({data.length} records)
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="format">Export Format</Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger id="format">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {EXPORT_FORMATS.map((f) => (
                                    <SelectItem key={f.value} value={f.value}>
                                        <div className="flex items-center gap-2">
                                            <span>{f.icon}</span>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{f.label}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {f.description}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="headers"
                            checked={includeHeaders}
                            onCheckedChange={(checked) => setIncludeHeaders(!!checked)}
                        />
                        <Label
                            htmlFor="headers"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Include column headers
                        </Label>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <p className="text-sm font-medium">Export Details</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>• Format: {EXPORT_FORMATS.find((f) => f.value === format)?.label}</p>
                            <p>• Records: {data.length}</p>
                            <p>• Filename: {reportName}-{new Date().toISOString().split('T')[0]}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="bg-[#ff9400] hover:bg-[#ff9400]/90"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Export {format.toUpperCase()}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
