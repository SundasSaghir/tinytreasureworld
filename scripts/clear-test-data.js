const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) {
    envVars[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
  }
});

async function main() {
  const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = envVars.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars.');
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, supabaseServiceKey);

  // Clear orders
  const { data: orders, error: oErr } = await admin.from('orders').delete().neq('id', '');
  console.log('Orders cleared:', oErr ? oErr.message : String(orders?.length || 0) + ' records');

  // Clear reviews (test entries)
  const { data: reviews, error: rErr } = await admin.from('reviews').delete().neq('id', '');
  console.log('Reviews cleared:', rErr ? rErr.message : String(reviews?.length || 0) + ' records');

  // Clear coupons
  const { data: coupons, error: cErr } = await admin.from('coupons').delete().neq('id', '');
  console.log('Coupons cleared:', cErr ? cErr.message : String(coupons?.length || 0) + ' records');

  // Try subscribers table
  const { error: subErr } = await admin.from('subscribers').delete().neq('id', '');
  console.log('Subscribers:', subErr ? subErr.message + ' (table may not exist)' : 'cleared');

  console.log('Done!');
}

main().catch(console.error);
