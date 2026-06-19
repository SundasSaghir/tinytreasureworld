import { NextRequest, NextResponse } from 'next/server';
import { getDb, generateId, supabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const db = await getDb();
    return NextResponse.json(db.coupons);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { code, discount, type, minAmount, active, expiresAt } = body;

    const coupon = {
      id: generateId(),
      code: code.toUpperCase(),
      discount: Number(discount),
      type: type || 'percentage',
      minAmount: Number(minAmount) || 0,
      active: active !== undefined ? Boolean(active) : true,
      expiresAt: expiresAt || '',
    };

    const { data, error } = await supabase.from('coupons').insert(coupon).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
