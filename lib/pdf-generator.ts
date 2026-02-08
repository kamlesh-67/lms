import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { Shipment } from '@/store/slices/shipmentSlice';
import { Manifest } from '@/store/slices/documentSlice';

// Generate a single shipment label PDF REUSING BULK LOGIC
export const generateLabelPDF = async (shipment: Shipment) => {
  await generateBulkLabelsPDF([shipment], `Label-${shipment.awb}.pdf`);
};

// Generate Bulk Labels with Barcodes
export const generateBulkLabelsPDF = async (shipments: Shipment[], filename?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [4, 6] // 4x6 inch thermal label
  });

  const primaryColor = '#061359'; // Navy
  const accentColor = '#ff9400'; // Orange

  for (let i = 0; i < shipments.length; i++) {
    const shipment = shipments[i];
    if (i > 0) doc.addPage();

    // Header - Company Branding
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 4, 0.8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('LMD PORTAL', 0.2, 0.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Emirates Logistics Express', 0.2, 0.65);

    // Service Type Badge
    doc.setFillColor(accentColor);
    doc.roundedRect(2.8, 0.15, 1, 0.5, 0.1, 0.1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text((shipment.serviceType || 'Standard').toUpperCase(), 3.3, 0.45, { align: 'center' });

    // AWB Barcode - Using simple barcode representation
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(0, 0, 0);
    const barcodeY = 1.0;
    const barcodeHeight = 0.5;
    // Simulate barcode
    for (let j = 0; j < 60; j++) {
      const x = 0.5 + (j * 0.05);
      if (x < 3.5 && Math.random() > 0.3) {
        doc.rect(x, barcodeY, 0.02, barcodeHeight, 'F');
      }
    }

    // AWB Number
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.awb, 2, 1.7, { align: 'center' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.01);
    doc.line(0.2, 1.9, 3.8, 1.9);

    // Sender Information
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('FROM:', 0.2, 2.15);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(shipment.origin || 'Dubai Hub', 0.2, 2.35);

    // Receiver Information
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('TO:', 0.2, 2.65);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(shipment.consigneeName, 0.2, 2.85);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(shipment.consigneePhone, 0.2, 3.05);

    // Address (wrapped)
    doc.setFontSize(9);
    const addressLines = doc.splitTextToSize(shipment.address, 3.6);
    doc.text(addressLines, 0.2, 3.25);

    // Destination (Large)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    // Safer destination check
    const destination = shipment.destination || (shipment.timeline && shipment.timeline.length > 0 ? shipment.timeline[shipment.timeline.length - 1]?.location : '') || 'UAE';
    doc.text(destination, 2, 4.3, { align: 'center' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(0.2, 4.5, 3.8, 4.5);

    // Footer Information
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    const footerY = 4.7;
    doc.text(`Order ID: ${shipment.orderId}`, 0.2, footerY);
    doc.text(`Weight: ${shipment.weight ? `${shipment.weight.toFixed(2)} kg` : 'N/A'}`, 0.2, footerY + 0.15);

    const date = new Date(shipment.timeline?.[0]?.timestamp || new Date());
    doc.text(`Date: ${date.toLocaleDateString()}`, 2.2, footerY);
    doc.text(`Time: ${date.toLocaleTimeString()}`, 2.2, footerY + 0.15);

    // Company Footer
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text('www.lmdportal.com | +971-800-LMD-PORTAL', 2, 5.85, { align: 'center' });
  }

  doc.save(filename || `AWB-Bulk-Labels-${shipments.length}-${new Date().getTime()}.pdf`);
};

// Generate Pickup Bulk Labels
export const generatePickupLabelsPDF = async (pickups: any[], filename?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [4, 6]
  });

  const primaryColor = '#061359';
  const accentColor = '#ff9400';

  for (let i = 0; i < pickups.length; i++) {
    const pickup = pickups[i];
    if (i > 0) doc.addPage();

    // Header - Company Branding
    doc.setFillColor(accentColor); // Orange for pickups
    doc.rect(0, 0, 4, 0.8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PICKUP REQUEST', 0.2, 0.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('LMD Logistics Portal', 0.2, 0.65);

    // ID Badge
    doc.setFillColor(primaryColor);
    doc.roundedRect(2.5, 0.15, 1.3, 0.5, 0.1, 0.1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(pickup.requestId, 3.15, 0.45, { align: 'center' });

    // Request ID Barcode
    doc.setDrawColor(0, 0, 0);
    doc.setFillColor(0, 0, 0);
    const barcodeY = 1.0;
    const barcodeHeight = 0.5;
    for (let j = 0; j < 60; j++) {
      const x = 0.5 + (j * 0.05);
      if (x < 3.5 && Math.random() > 0.3) {
        doc.rect(x, barcodeY, 0.02, barcodeHeight, 'F');
      }
    }

    // Number
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(pickup.requestId, 2, 1.7, { align: 'center' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.01);
    doc.line(0.2, 1.9, 3.8, 1.9);

    // Customer Information
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('CUSTOMER:', 0.2, 2.15);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(pickup.customerName, 0.2, 2.35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(pickup.customerPhone, 0.2, 2.55);

    // Address
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('PICKUP LOCATION:', 0.2, 2.85);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    const addressLines = doc.splitTextToSize(pickup.address, 3.6);
    doc.text(addressLines, 0.2, 3.05);

    // Service Type (Large)
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor);
    doc.text(pickup.serviceType || 'Standard', 2, 4.3, { align: 'center' });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(0.2, 4.5, 3.8, 4.5);

    // Footer Information
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    const footerY = 4.7;
    doc.text(`Contact: ${pickup.contactName}`, 0.2, footerY);
    doc.text(`Items: ${pickup.itemCount || 1} | Weight: ${pickup.estimatedWeight || 'N/A'} kg`, 0.2, footerY + 0.15);

    const date = new Date(pickup.scheduledDate || new Date());
    doc.text(`Scheduled: ${date.toLocaleDateString()}`, 2.2, footerY);
    doc.text(`Status: ${pickup.status}`, 2.2, footerY + 0.15);

    // Footer - Company Info
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text('www.lmdportal.com | +971-800-LMD-PORTAL', 2, 5.85, { align: 'center' });
  }

  doc.save(filename || `Pickup-Labels-${pickups.length}-${new Date().getTime()}.pdf`);
};

// Generate Manifest PDF
export const generateManifestPDF = (manifest: Manifest, shipments: Shipment[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('SHIPMENT MANIFEST', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Manifest ID: ${manifest.id}`, 14, 25);
  doc.text(`Date: ${manifest.date}`, 14, 30);
  doc.text(`Generated By: ${manifest.generatedBy}`, 14, 35);
  doc.text(`Status: ${manifest.status}`, 160, 25);
  doc.text(`Total Shipments: ${shipments.length}`, 160, 30);

  const tableData = shipments.map(s => [
    s.awb,
    s.consigneeName,
    s.address.substring(0, 30) + '...',
    s.serviceType,
    `${s.weight} kg`,
    s.status
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['AWB', 'Consignee', 'Address', 'Service', 'Weight', 'Status']],
    body: tableData,
  });

  // Signature section
  const finalY = (doc as any).lastAutoTable.finalY || 150;

  doc.text('_______________________', 20, finalY + 40);
  doc.text('Driver Signature', 20, finalY + 45);

  doc.text('_______________________', 140, finalY + 40);
  doc.text('Dispatcher Signature', 140, finalY + 45);

  doc.save(`Manifest-${manifest.manifestRef || manifest.id}.pdf`);
};
