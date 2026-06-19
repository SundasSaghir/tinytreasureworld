import { NextRequest, NextResponse } from 'next/server';
import { getDb, generateId, supabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const db = await getDb();
    return NextResponse.json(db.banners.sort((a, b) => a.order - b.order));
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { title, subtitle, image, link, active, order } = body;

    const banner = {
      id: generateId(),
      title: title || '',
      subtitle: subtitle || '',
      image: image || '',
      link: link || '/shop',
      active: active !== false,
      order: Number(order) || 0,
    };

    const { data, error } = await supabase.from('banners').insert(banner).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await requireAdmin();
    const { error } = await supabase.from('banners').delete().neq('id', '');
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
