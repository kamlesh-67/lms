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
    const { status, failureReason, remarks, riderId } = body;

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (failureReason !== undefined) updateData.failureReason = failureReason;
    if (remarks !== undefined) updateData.remarks = remarks;
    if (riderId !== undefined) updateData.riderId = riderId;

    const pickup = await prisma.pickup.update({
      where: { id },
      data: updateData,
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_PICKUP_STATUS',
        entityType: 'PICKUP',
        entityId: pickup.id,
        details: `Updated status to ${status || 'Unknown'}`,
        timestamp: new Date(),
      }
    });

    return NextResponse.json(pickup);
  } catch (error) {
    console.error('Error updating pickup:', error);
    return NextResponse.json({ error: 'Failed to update pickup' }, { status: 500 });
  }
}
