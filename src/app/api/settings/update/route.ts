import { NextRequest, NextResponse } from 'next/server';
import { getDb, supabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const { key, value } = await request.json();

    const db = await getDb();

    const { error } = await supabase.from('settings').upsert({ key, value });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
