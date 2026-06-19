import { NextRequest, NextResponse } from 'next/server';
import { getDb, generateId, supabase } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    const db = await getDb();
    const key = `contact_${generateId()}`;
    const { error } = await supabase.from('settings').insert({ key, value: JSON.stringify({ name, email, phone, message, createdAt: new Date().toISOString() }) });
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
