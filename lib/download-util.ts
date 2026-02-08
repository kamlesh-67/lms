import { generateLabelPDF, generatePickupLabelsPDF } from "@/lib/pdf-generator";

// Wrapper for Shipment Label
export const downloadShipmentLabel = async (shipment: any) => {
  try {
    await generateLabelPDF(shipment);
  } catch (error) {
    console.error("Error downloading shipment label:", error);
    alert("Failed to download label.");
  }
};

// Wrapper for Pickup Label
export const downloadPickupLabel = async (pickup: any) => {
  try {
    const filename = `Pickup-Label-${pickup.requestId}.pdf`;
    await generatePickupLabelsPDF([pickup], filename);
  } catch (error) {
    console.error("Error downloading pickup label:", error);
    alert("Failed to download label.");
  }
};

// Legacy/Generic wrapper - handling both if data is passed, or dummy if only ID
// Note: Refactoring components to pass full object is recommended
export const downloadLabel = async (data: any, type: 'shipment' | 'pickup' | 'return') => {
  if (typeof data === 'string') {
    console.warn("downloadLabel called with ID string. PLease pass full object.");
    alert("Function updated. Please pass full object data.");
    return;
  }

  if (type === 'shipment' || type === 'return') {
    await downloadShipmentLabel(data);
  } else if (type === 'pickup') {
    await downloadPickupLabel(data);
  }
};
