import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    const body = await request.json();
    const { 
      status, 
      location, 
      timestamp, 
      cancellationReason,
      consigneeName,
      consigneePhone,
      address,
      weight,
      serviceType
    } = body;

    // Update shipment status
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (cancellationReason) updateData.cancellationReason = cancellationReason;
    if (consigneeName) updateData.consigneeName = consigneeName;
    if (consigneePhone) updateData.consigneePhone = consigneePhone;
    if (address) updateData.address = address;
    if (weight) updateData.weight = weight;
    if (serviceType) updateData.serviceType = serviceType;

    // Add to timeline only if status changes
    if (status) {
      updateData.timeline = {
        create: {
          status,
          location: location || 'System',
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        }
      };
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
      include: {
        timeline: true,
      }
    });

    // Create Audit Log
    const details = status 
      ? `Updated status to ${status}` 
      : `Updated details for ${shipment.awb}`;

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: status ? 'UPDATE_SHIPMENT_STATUS' : 'UPDATE_SHIPMENT_DETAILS',
        entityType: 'SHIPMENT',
        entityId: shipment.id,
        details,
        timestamp: new Date(),
      }
    });

    return NextResponse.json(shipment);
  } catch (error) {
    console.error('Error updating shipment:', error);
    return NextResponse.json({ error: 'Failed to update shipment' }, { status: 500 });
  }
}
