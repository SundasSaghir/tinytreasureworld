// Run this to upload existing db.json data to Supabase
// Usage: node scripts/upload-to-supabase.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://afawadbxgepeuyhjmstn.supabase.co';
const supabaseKey = 'sb_publishable_lCrfXdLF8XyPvbBhQzXF0w_2UGdrH41';

const supabase = createClient(supabaseUrl, supabaseKey);

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

async function upload() {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

  // Upload products
  if (data.products.length > 0) {
    const { error } = await supabase.from('products').upsert(
      data.products.map((p) => ({ ...p, salePrice: p.salePrice ?? null })),
      { onConflict: 'id' }
    );
    if (error) console.error('Products error:', error.message);
    else console.log(`✓ Uploaded ${data.products.length} products`);
  }

  // Upload categories
  if (data.categories.length > 0) {
    const { error } = await supabase.from('categories').upsert(data.categories, { onConflict: 'id' });
    if (error) console.error('Categories error:', error.message);
    else console.log(`✓ Uploaded ${data.categories.length} categories`);
  }

  // Upload orders
  if (data.orders.length > 0) {
    const { error } = await supabase.from('orders').upsert(data.orders, { onConflict: 'id' });
    if (error) console.error('Orders error:', error.message);
    else console.log(`✓ Uploaded ${data.orders.length} orders`);
  }

  // Upload banners
  if (data.banners.length > 0) {
    const { error } = await supabase.from('banners').upsert(data.banners, { onConflict: 'id' });
    if (error) console.error('Banners error:', error.message);
    else console.log(`✓ Uploaded ${data.banners.length} banners`);
  }

  // Upload reviews
  if (data.reviews.length > 0) {
    const { error } = await supabase.from('reviews').upsert(data.reviews, { onConflict: 'id' });
    if (error) console.error('Reviews error:', error.message);
    else console.log(`✓ Uploaded ${data.reviews.length} reviews`);
  }

  // Upload coupons
  if (data.coupons.length > 0) {
    const { error } = await supabase.from('coupons').upsert(data.coupons, { onConflict: 'id' });
    if (error) console.error('Coupons error:', error.message);
    else console.log(`✓ Uploaded ${data.coupons.length} coupons`);
  }

  // Upload settings
  if (data.settings.length > 0) {
    const { error } = await supabase.from('settings').upsert(data.settings, { onConflict: 'key' });
    if (error) console.error('Settings error:', error.message);
    else console.log(`✓ Uploaded ${data.settings.length} settings`);
  }

  console.log('\nDone! All data uploaded to Supabase.');
}

upload().catch(console.error);
