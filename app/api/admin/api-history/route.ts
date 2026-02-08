import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const history = await prisma.apiHistory.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching API history:', error);
    return NextResponse.json({ error: 'Failed to fetch API history' }, { status: 500 });
  }
}
