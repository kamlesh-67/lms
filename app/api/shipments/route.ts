import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { awb: { contains: search } }, // removed mode: insensitive for sqlite compatibility if needed, or keeping default
        { orderId: { contains: search } },
        { consigneeName: { contains: search } },
        { consigneePhone: { contains: search } },
      ];
    }

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        skip,
        take: limit,
        where,
        include: {
          timeline: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.shipment.count({ where }),
    ]);

    return NextResponse.json({
      data: shipments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json({ error: 'Failed to fetch shipments' }, { status: 500 });
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
      awb, orderId, consigneeName, consigneePhone, address,
      weight, serviceType, status, timeline, origin, destination
    } = body;

    // Generate AWB if not provided
    const generatedAwb = awb || `AWB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const shipment = await prisma.shipment.create({
      data: {
        awb: generatedAwb,
        orderId,
        consigneeName,
        consigneePhone,
        address,
        origin: origin || 'Dubai Hub',
        destination: destination || address.split(',').pop()?.trim() || 'Dubai',
        weight: weight ? parseFloat(weight) : null,
        serviceType,
        status: status || 'Created',
        timeline: {
          create: timeline ? timeline.map((t: any) => ({
            status: t.status,
            location: t.location,
            timestamp: t.timestamp ? new Date(t.timestamp) : new Date(),
          })) : [{
            status: 'Created',
            location: 'System',
            timestamp: new Date()
          }]
        }
      },
      include: {
        timeline: true,
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_SHIPMENT',
        entityType: 'SHIPMENT',
        entityId: shipment.id,
        details: `Created shipment ${shipment.awb}`,
        timestamp: new Date(),
      }
    });

    return NextResponse.json(shipment);
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
  }
}
