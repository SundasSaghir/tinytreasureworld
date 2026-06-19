const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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
  const admin = createClient(supabaseUrl, supabaseServiceKey);

  // Check what's in orders
  const { data: orders, error: oErr } = await admin.from('orders').select('id,status,total');
  if (oErr) console.log('Orders error:', oErr.message);
  else console.log('Orders:', JSON.stringify(orders));

  // Check what's in settings (for income data)
  const { data: settings, error: sErr } = await admin.from('settings').select('*');
  if (sErr) console.log('Settings error:', sErr.message);
  else console.log('Settings:', JSON.stringify(settings));
}

main().catch(console.error);
