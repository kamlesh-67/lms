import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pickups = await prisma.pickup.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(pickups);
  } catch (error) {
    console.error('Error fetching pickups:', error);
    return NextResponse.json({ error: 'Failed to fetch pickups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
       requestId, scheduledDate, address, serviceType, status,
       location, contactName, contactPhone, awbNumber
    } = body;

    const pickup = await prisma.pickup.create({
      data: {
        requestId,
        scheduledDate: new Date(scheduledDate),
        address,
        serviceType,
        status: status || 'Requested',
        location,
        contactName,
        contactPhone,
        awbNumber
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_PICKUP',
        entityType: 'PICKUP',
        entityId: pickup.id,
        details: `Scheduled pickup ${pickup.requestId}`,
        timestamp: new Date(),
      }
    });

    return NextResponse.json(pickup);
  } catch (error) {
    console.error('Error creating pickup:', error);
    return NextResponse.json({ error: 'Failed to create pickup' }, { status: 500 });
  }
}
