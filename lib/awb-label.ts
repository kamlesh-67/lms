import jsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

export interface ShipmentData {
    awb: string
    orderId: string
    consigneeName: string
    consigneePhone: string
    address: string
    city?: string
    zipCode?: string
    origin: string
    destination: string
    weight?: number
    serviceType: string
    createdAt: Date
}

export function generateAWBLabel(shipment: ShipmentData): void {
    // Create new PDF document (4x6 inch thermal label)
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6],
    })

    // Colors
    const primaryColor = '#061359' // Navy
    const accentColor = '#ff9400' // Orange

    // Header - Company Branding
    pdf.setFillColor(primaryColor)
    pdf.rect(0, 0, 4, 0.8, 'F')

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('LMD PORTAL', 0.2, 0.5)

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Emirates Logistics Express', 0.2, 0.65)

    // Service Type Badge
    pdf.setFillColor(accentColor)
    pdf.roundedRect(2.8, 0.15, 1, 0.5, 0.1, 0.1, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(shipment.serviceType.toUpperCase(), 3.3, 0.45, { align: 'center' })

    // AWB Barcode
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, shipment.awb, {
        format: 'CODE128',
        width: 2,
        height: 60,
        displayValue: false,
    })

    const barcodeImage = canvas.toDataURL('image/png')
    pdf.addImage(barcodeImage, 'PNG', 0.3, 0.9, 3.4, 0.6)

    // AWB Number
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(shipment.awb, 2, 1.7, { align: 'center' })

    // Divider Line
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.01)
    pdf.line(0.2, 1.9, 3.8, 1.9)

    // Sender Information
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(primaryColor)
    pdf.text('FROM:', 0.2, 2.15)

    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(9)
    pdf.text(shipment.origin, 0.2, 2.35)

    // Receiver Information
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(primaryColor)
    pdf.text('TO:', 0.2, 2.65)

    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(11)
    pdf.text(shipment.consigneeName, 0.2, 2.85)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(shipment.consigneePhone, 0.2, 3.05)

    // Address (wrapped)
    pdf.setFontSize(9)
    const addressLines = pdf.splitTextToSize(shipment.address, 3.6)
    pdf.text(addressLines, 0.2, 3.25)

    if (shipment.city) {
        const yPos = 3.25 + (addressLines.length * 0.15)
        pdf.text(`${shipment.city}${shipment.zipCode ? ` - ${shipment.zipCode}` : ''}`, 0.2, yPos)
    }

    // Destination (Large)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(accentColor)
    pdf.text(shipment.destination, 2, 4.3, { align: 'center' })

    // Divider Line
    pdf.setDrawColor(200, 200, 200)
    pdf.line(0.2, 4.5, 3.8, 4.5)

    // Footer Information
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)

    const footerY = 4.7
    pdf.text(`Order ID: ${shipment.orderId}`, 0.2, footerY)
    pdf.text(`Weight: ${shipment.weight ? `${shipment.weight.toFixed(2)} kg` : 'N/A'}`, 0.2, footerY + 0.15)

    const date = new Date(shipment.createdAt)
    pdf.text(`Date: ${date.toLocaleDateString()}`, 2.2, footerY)
    pdf.text(`Time: ${date.toLocaleTimeString()}`, 2.2, footerY + 0.15)

    // QR Code placeholder (optional - can add QR code library later)
    pdf.setDrawColor(200, 200, 200)
    pdf.rect(0.2, 5.1, 0.7, 0.7)
    pdf.setFontSize(6)
    pdf.text('SCAN', 0.55, 5.55, { align: 'center' })

    // Footer - Company Info
    pdf.setFontSize(6)
    pdf.setTextColor(150, 150, 150)
    pdf.text('www.lmdportal.com | +971-800-LMD-PORTAL', 2, 5.85, { align: 'center' })

    // Save/Download PDF
    pdf.save(`AWB-${shipment.awb}.pdf`)
}

// Function to print label directly (if printer is configured)
export function printAWBLabel(shipment: ShipmentData): void {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6],
    })

    // Same PDF generation logic as above
    // ... (reuse generateAWBLabel logic)

    // Open print dialog
    pdf.autoPrint()
    window.open(pdf.output('bloburl'), '_blank')
}

// Batch label generation
export function generateBatchLabels(shipments: ShipmentData[]): void {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6],
    })

    shipments.forEach((shipment, index) => {
        if (index > 0) {
            pdf.addPage()
        }

        // Generate label for each shipment
        // (Same logic as generateAWBLabel but without pdf.save())
    })

    pdf.save(`AWB-Batch-${shipments.length}-labels.pdf`)
}
