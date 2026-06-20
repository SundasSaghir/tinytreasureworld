import { NextRequest, NextResponse } from 'next/server';
import { getDb, supabase } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const order = db.orders.find((o) => o.id === id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { status } = await request.json();

    if (status === 'cancelled') {
      const { data: order } = await supabase.from('orders').select('items').eq('id', id).single();
      if (order?.items) {
        for (const item of order.items) {
          const { data: product } = await supabase.from('products').select('stock').eq('id', item.productId).single();
          if (product) {
            await supabase.from('products').update({ stock: product.stock + item.quantity }).eq('id', item.productId);
          }
        }
      }
    }

    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      throw error;
    }
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
