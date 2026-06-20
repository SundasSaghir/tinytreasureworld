import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Try creating the wishlist_items table
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      query: `CREATE TABLE IF NOT EXISTS wishlist_items (
        id TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL DEFAULT '',
        name TEXT NOT NULL DEFAULT '',
        price NUMERIC NOT NULL DEFAULT 0,
        image TEXT NOT NULL DEFAULT '',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`
    });

    if (error) {
      return NextResponse.json({
        error: 'exec_sql RPC not available',
        sql: `CREATE TABLE IF NOT EXISTS wishlist_items (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
        instruction: 'Go to Supabase dashboard > SQL Editor, paste and run the above SQL'
      });
    }

    return NextResponse.json({ success: true, message: 'Table created' });
  } catch {
    return NextResponse.json({
      error: 'Could not create table',
      sql: `CREATE TABLE IF NOT EXISTS wishlist_items (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`
    });
  }
}
