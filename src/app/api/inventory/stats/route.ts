import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = await getDb();

    const totalProducts = db.products.length;
    const totalOrders = db.orders.length;
    const lowStock = db.products.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const outOfStock = db.products.filter((p) => p.stock === 0).length;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    function incomeSince(date: Date): number {
      return db.orders
        .filter((o) => o.status !== 'cancelled' && new Date(o.createdAt) >= date)
        .reduce((sum, o) => sum + o.total, 0);
    }

    function countSince(date: Date): number {
      return db.orders.filter((o) => new Date(o.createdAt) >= date).length;
    }

    const todayIncome = incomeSince(todayStart);
    const yesterdayIncome = incomeSince(yesterdayStart) - todayIncome;
    const monthlyIncome = incomeSince(monthStart);
    const yearlyIncome = incomeSince(yearStart);
    const todayOrders = countSince(todayStart);
    const monthlyOrders = countSince(monthStart);

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
