const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) envVars[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
});
async function main() {
  const admin = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_KEY);
  const { data, error } = await admin.from('settings').select('key,value').in('key', ['address', 'email', 'whatsapp_number', 'shop_name']);
  console.log('Error:', error?.message || 'none');
  console.log('Settings:', JSON.stringify(data));
}
main().catch(console.error);
