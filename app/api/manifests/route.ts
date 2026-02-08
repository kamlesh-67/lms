import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const manifests = await prisma.manifest.findMany({
      include: {
        shipments: {
          select: { id: true, awb: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(manifests);
  } catch (error) {
    console.error('Error fetching manifests:', error);
    return NextResponse.json({ error: 'Failed to fetch manifests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { shipmentIds } = body;

    if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
      return NextResponse.json({ error: 'No shipments selected' }, { status: 400 });
    }

    const manifestRef = `MAN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Transaction to ensure atomicity
    const manifest = await prisma.$transaction(async (tx) => {
      // Create Manifest
      const newManifest = await tx.manifest.create({
        data: {
          manifestRef,
          status: 'Open',
          generatedBy: session.user.name || 'Unknown',
          shipments: {
            connect: shipmentIds.map(id => ({ id }))
          }
        },
        include: {
          shipments: true
        }
      });

      // Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'CREATE_MANIFEST',
          entityType: 'MANIFEST',
          entityId: newManifest.id,
          details: `Created manifest ${manifestRef} with ${shipmentIds.length} shipments`,
          timestamp: new Date(),
        }
      });

      return newManifest;
    });

    return NextResponse.json(manifest);
  } catch (error) {
    console.error('Error creating manifest:', error);
    return NextResponse.json({ error: 'Failed to create manifest' }, { status: 500 });
  }
}
