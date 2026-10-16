import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Notification } from '@/models/Notification';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isRead = searchParams.get('isRead');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') filter.category = category;
    if (isRead !== null && isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ isRead: false }),
    ]);

    const transformed = notifications.map((n) => ({
      id: String(n._id),
      title: n.title,
      message: n.message,
      type: n.type,
      category: n.category,
      isRead: n.isRead,
      link: n.link,
      createdAt: n.createdAt.toISOString(),
    }));

    return NextResponse.json({ notifications: transformed, unreadCount });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    if (body.markAllRead) {
      await Notification.updateMany({}, { isRead: true });
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (body.id) {
      await Notification.findByIdAndUpdate(body.id, { isRead: true });
      return NextResponse.json({ message: 'Notification marked as read' });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
