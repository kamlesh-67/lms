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
    const { status } = body;

    if (status === 'Closed') {
      const manifest = await prisma.$transaction(async (tx) => {
        // Update Manifest
        const updatedManifest = await tx.manifest.update({
          where: { id },
          data: {
            status: 'Closed',
            closedAt: new Date(),
          },
          include: {
            shipments: true
          }
        });

        // Lock all associated shipments
        await tx.shipment.updateMany({
          where: { manifestId: id },
          data: { isLocked: true }
        });

        // Create Audit Log
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'CLOSE_MANIFEST',
            entityType: 'MANIFEST',
            entityId: id,
            details: `Closed manifest ${updatedManifest.manifestRef}`,
            timestamp: new Date(),
          }
        });

        return updatedManifest;
      });

      return NextResponse.json(manifest);
    }

    return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
  } catch (error) {
    console.error('Error updating manifest:', error);
    return NextResponse.json({ error: 'Failed to update manifest' }, { status: 500 });
  }
}
