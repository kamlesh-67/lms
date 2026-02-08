'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Printer, Download, Loader2, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Shipment } from '@/store/slices/shipmentSlice'
import { generateEnhancedAWBLabel } from '@/lib/enhanced-awb-label'

interface PrintLabelDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    shipment: Shipment
}

const LABEL_FORMATS = [
    { value: '4x6', label: '4x6 inch (Thermal Printer)', description: 'Standard thermal label' },
    { value: 'a4', label: 'A4 (Laser Printer)', description: 'Full page label' },
    { value: 'a6', label: 'A6 (Half Page)', description: 'Half page label' },
]

const PRINTERS = [
    { value: 'default', label: 'Default Printer' },
    { value: 'zebra-zd420', label: 'Zebra ZD420 (Thermal)' },
    { value: 'brother-ql', label: 'Brother QL-820NWB' },
    { value: 'dymo-4xl', label: 'DYMO 4XL' },
    { value: 'hp-laserjet', label: 'HP LaserJet Pro' },
]

export function PrintLabelDialog({
    open,
    onOpenChange,
    shipment,
}: PrintLabelDialogProps) {
    const [format, setFormat] = useState<'4x6' | 'a4' | 'a6'>('4x6')
    const [printer, setPrinter] = useState('default')
    const [isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()

    const handleGeneratePDF = async () => {
        setIsGenerating(true)
        try {
            await generateEnhancedAWBLabel(shipment, format)
            toast({
                title: 'Label Generated',
                description: `AWB label for ${shipment.awb} has been downloaded.`,
            })
        } catch (error) {
            toast({
                title: 'Generation Failed',
                description: 'Failed to generate label. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePrint = async () => {
        setIsGenerating(true)
        try {
            // Generate label and open print dialog
            await generateEnhancedAWBLabel(shipment, format, true)
            toast({
                title: 'Print Dialog Opened',
                description: `Sending to ${PRINTERS.find(p => p.value === printer)?.label}`,
            })
        } catch (error) {
            toast({
                title: 'Print Failed',
                description: 'Failed to print label. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#ff9400]/10">
                            <FileText className="h-5 w-5 text-[#ff9400]" />
                        </div>
                        <div>
                            <DialogTitle>Print AWB Label</DialogTitle>
                            <DialogDescription>
                                AWB: {shipment.awb}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="format">Label Format</Label>
                        <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                            <SelectTrigger id="format">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LABEL_FORMATS.map((f) => (
                                    <SelectItem key={f.value} value={f.value}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{f.label}</span>
                                            <span className="text-xs text-muted-foreground">{f.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="printer">Select Printer</Label>
                        <Select value={printer} onValueChange={setPrinter}>
                            <SelectTrigger id="printer">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PRINTERS.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                        {p.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <p className="text-sm font-medium">Label Preview</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p>• Company logo and branding</p>
                            <p>• Scannable barcode (Code 128)</p>
                            <p>• Complete sender/receiver details</p>
                            <p>• Service type and tracking info</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={handleGeneratePDF}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handlePrint}
                        disabled={isGenerating}
                        className="bg-[#ff9400] hover:bg-[#ff9400]/90"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Printing...
                            </>
                        ) : (
                            <>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Label
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
