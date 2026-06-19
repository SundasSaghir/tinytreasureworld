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

  const { error } = await admin.from('settings').insert({
    key: 'pinterest_url',
    value: 'https://pinterest.com/tinytreasureworld'
  }).single();

  if (error && error.code !== '23505') { // ignore duplicate
    console.log('Insert error:', error.message);
  } else {
    console.log('Pinterest setting added!');
  }
}

main().catch(console.error);
