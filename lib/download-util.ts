import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

// Function to generate and download a PDF label for a shipment
export const downloadShipmentLabel = (shipment: any) => {
  try {
    // Initialize PDF document (100mm x 150mm standard shipping label size)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150]
    });

    // Generate Barcode
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, shipment.awb, {
      format: "CODE128",
      width: 2,
      height: 40,
      displayValue: true,
      fontSize: 14,
      textMargin: 0,
      margin: 0
    });
    const barcodeData = canvas.toDataURL("image/png");

    // --- Header Section ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LMS PORTAL", 50, 10, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Emirates Logistics Express", 50, 14, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(5, 18, 95, 18);

    // --- Barcode Section ---
    // AWB Barcode centered
    doc.addImage(barcodeData, 'PNG', 10, 22, 80, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`AWB: ${shipment.awb}`, 50, 52, { align: "center" });

    doc.line(5, 55, 95, 55);

    // --- Delivery Details ---
    // FROM (Sender placeholder as mock)
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("FROM:", 8, 62);
    doc.setFont("helvetica", "normal");
    doc.text("LMS Logistics Hub", 8, 66);
    doc.text("Dubai Investment Park, Dubai, UAE", 8, 70);
    doc.text("Tel: +971-4-8888888", 8, 74);

    // TO (Consignee)
    doc.setFont("helvetica", "bold");
    doc.text("TO:", 8, 82);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(shipment.consigneeName || "Unknown", 8, 87);
    doc.setFontSize(9);
    doc.text(shipment.consigneePhone || "", 8, 92);

    // Address handles wrapping
    const splitAddress = doc.splitTextToSize(shipment.address || "No Address", 85);
    doc.text(splitAddress, 8, 97);

    doc.line(5, 115, 95, 115);

    // --- Shipment Meta ---
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER ID:", 8, 122);
    doc.setFont("helvetica", "normal");
    doc.text(shipment.orderId || "-", 30, 122);

    doc.setFont("helvetica", "bold");
    doc.text("WEIGHT:", 60, 122);
    doc.setFont("helvetica", "normal");
    doc.text(`${shipment.weight} kg`, 75, 122);

    doc.setFont("helvetica", "bold");
    doc.text("SERVICE:", 8, 128);
    doc.setFont("helvetica", "normal");
    doc.text(shipment.serviceType || "Standard", 30, 128);

    doc.setFont("helvetica", "bold");
    doc.text("DATE:", 60, 128);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString(), 75, 128);

    // --- Footer ---
    doc.line(5, 135, 95, 135);
    doc.setFontSize(7);
    doc.text("Thank you for choosing LMS Portal.", 50, 142, { align: "center" });
    doc.text("www.lms-portal.com", 50, 146, { align: "center" });

    // Save the PDF
    doc.save(`${shipment.awb}_label.pdf`);

  } catch (error) {
    console.error("Error generating label:", error);
    alert("Failed to generate label. Please try again.");
  }
};

export const downloadLabel = (id: string, type: 'shipment' | 'pickup' | 'return') => {
  // Legacy support or fallback if full object not passed
  console.log(`Downloading dummy label for ${type} ${id}`);

  const dummyContent = `
    LMD LOGISTICS - DUMMY LABEL
    -------------------------
    ID: ${id}
    Date: ${new Date().toLocaleDateString()}
    Use downloadShipmentLabel() for real PDF.
  `;

  const blob = new Blob([dummyContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-label-${id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
