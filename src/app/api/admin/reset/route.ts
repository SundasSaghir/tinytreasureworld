import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    await requireAdmin();

    await Promise.all([
      supabaseAdmin.from('orders').delete().neq('id', ''),
      supabaseAdmin.from('wishlist_items').delete().neq('id', ''),
      supabaseAdmin.from('settings').delete().like('key', 'contact_%'),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
