import { NextRequest, NextResponse } from 'next/server';
import { generateId, supabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    if (admin === 'true') {
      await requireAdmin();
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
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
    await supabase.from('orders').delete().neq('id', '');
    return NextResponse.json({ success: true });
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
    const { customerName, phone, city, address, notes, items } = body;

    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
      const { data: product } = await supabase.from('products').select('stock').eq('id', item.productId).single();
      if (!product) {
        return NextResponse.json({ error: `Product "${item.name}" not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({
          error: `Only ${product.stock} left in stock for "${item.name}"`
        }, { status: 400 });
      }
      await supabase.from('products').update({ stock: product.stock - item.quantity }).eq('id', item.productId);
    }

    const order = {
      id: generateId(),
      customerName,
      phone,
      city,
      address,
      notes: notes || '',
      items,
      total,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('orders').insert(order).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
