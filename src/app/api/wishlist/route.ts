import { NextRequest, NextResponse } from 'next/server';
import { generateId, supabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('admin') === 'true') {
      await requireAdmin();
    }
    const { data, error } = await supabase.from('wishlist_items').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, price } = body;
    const item = {
      id: generateId(),
      productId,
      name,
      price: Number(price),
      image: body.image || '',
      createdAt: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('wishlist_items').insert(item).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await requireAdmin();
    await supabase.from('wishlist_items').delete().neq('id', '');
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
