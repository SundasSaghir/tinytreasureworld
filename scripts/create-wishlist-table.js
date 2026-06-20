// Run: node scripts/create-wishlist-table.js
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceKey)

async function run() {
  const sql = `
CREATE TABLE IF NOT EXISTS wishlist_items (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`
  const { error } = await admin.rpc('exec_sql', { query: sql })
  if (error) {
    // fallback: try direct REST
    console.error('RPC failed, creating via REST...')
    // Try to insert a dummy to trigger table creation if using edge functions
    console.error('Please run the SQL manually in Supabase dashboard:')
    console.error(sql)
    console.error('Error:', error.message)
  } else {
    console.log('Table wishlist_items created successfully!')
  }
}

run()
