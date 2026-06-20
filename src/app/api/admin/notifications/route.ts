import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const ordersSince = searchParams.get('ordersSince') || '';
    const reviewsSince = searchParams.get('reviewsSince') || '';

    const [ordersRes, settingsRes, reviewsRes, wishlistRes] = await Promise.all([
      supabase.from('orders').select('status, createdAt'),
      supabase.from('settings').select('key'),
      supabase.from('reviews').select('id, createdAt'),
      supabase.from('wishlist_items').select('id, createdAt'),
    ]);

    let pendingOrders = (ordersRes.data || []).filter((o: any) => o.status === 'pending').length;
    if (ordersSince) {
      pendingOrders = (ordersRes.data || []).filter(
        (o: any) => o.status === 'pending' && o.createdAt > ordersSince
      ).length;
    }

    const messages = (settingsRes.data || []).filter((s: any) => s.key.startsWith('contact_')).length;

    let reviews = (reviewsRes.data || []).length;
    if (reviewsSince) {
      reviews = (reviewsRes.data || []).filter((r: any) => r.createdAt > reviewsSince).length;
    }

    const wishlist = (wishlistRes.data || []).length;

    return NextResponse.json({ pendingOrders, messages, reviews, wishlist });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
