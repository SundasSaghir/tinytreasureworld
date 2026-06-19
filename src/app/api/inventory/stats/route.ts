import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterdayStart = new Date(todayStart).getTime() - 86400000;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();

    const [productsRes, ordersRes, todayOrdersRes, monthOrdersRes] = await Promise.all([
      supabase.from('products').select('stock'),
      supabase.from('orders').select('total, status, createdAt'),
      supabase.from('orders').select('id').gte('createdAt', todayStart),
      supabase.from('orders').select('id').gte('createdAt', monthStart),
    ]);

    const products = productsRes.data || [];
    const orders = ordersRes.data || [];

    const totalProducts = products.length;
    const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p: any) => p.stock === 0).length;

    const todayOrders = todayOrdersRes.data?.length || 0;
    const monthlyOrders = monthOrdersRes.data?.length || 0;

    function incomeSince(dateStr: string): number {
      return orders
        .filter((o: any) => o.status !== 'cancelled' && o.createdAt >= dateStr)
        .reduce((sum: number, o: any) => sum + Number(o.total), 0);
    }

    const todayIncome = incomeSince(todayStart);
    const yesterdayIncome = incomeSince(new Date(yesterdayStart).toISOString()) - todayIncome;
    const monthlyIncome = incomeSince(monthStart);
    const yearlyIncome = incomeSince(yearStart);
    const totalOrders = orders.length;

    return NextResponse.json({
      totalProducts,
      totalOrders,
      lowStock,
      outOfStock,
      todayIncome,
      yesterdayIncome,
      monthlyIncome,
      yearlyIncome,
      todayOrders,
      monthlyOrders,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
