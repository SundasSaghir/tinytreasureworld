import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const { data, error } = await supabase.from('settings').select('key, value').like('key', 'contact_%');
    if (error) throw error;

    const messages = (data || []).map((item: any) => {
      try {
        return { id: item.key.replace('contact_', ''), ...JSON.parse(item.value) };
      } catch {
        return null;
      }
    }).filter(Boolean).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(messages);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { id } = await request.json();
    const { error } = await supabase.from('settings').delete().eq('key', `contact_${id}`);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
