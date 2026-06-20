import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();

    const [ordersRes, settingsRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('status'),
      supabase.from('settings').select('key'),
      supabase.from('reviews').select('id'),
    ]);

    const pendingOrders = (ordersRes.data || []).filter((o: any) => o.status === 'pending').length;
    const messages = (settingsRes.data || []).filter((s: any) => s.key.startsWith('contact_')).length;
    const reviews = (reviewsRes.data || []).length;

    return NextResponse.json({ pendingOrders, messages, reviews });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
