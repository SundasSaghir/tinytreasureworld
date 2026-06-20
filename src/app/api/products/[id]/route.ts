import { NextRequest, NextResponse } from 'next/server';
import { getDb, supabase } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await getDb();
    const product = db.products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // If stock changes from 0 to >0, remove product from wishlists
    if (body.stock !== undefined) {
      const { data: existing } = await supabase.from('products').select('stock').eq('id', id).single();
      if (existing && existing.stock === 0 && body.stock > 0) {
        await supabaseAdmin.from('wishlist_items').delete().eq('productId', id);
      }
    }

    const { data, error } = await supabase.from('products').update(body).eq('id', id).select().single();
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
