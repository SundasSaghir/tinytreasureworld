// Upload existing local images to Supabase Storage
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://afawadbxgepeuyhjmstn.supabase.co';
const supabaseKey = 'sb_publishable_lCrfXdLF8XyPvbBhQzXF0w_2UGdrH41';
const supabase = createClient(supabaseUrl, supabaseKey);

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

async function uploadImage(filePath) {
  const filename = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
  
  const { error } = await supabase.storage
    .from('product-images')
    .upload(filename, buffer, {
      contentType: mimeTypes[ext] || 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error(`Failed to upload ${filename}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename);

  return publicUrl;
}

async function main() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found');
    return;
  }

  const files = fs.readdirSync(uploadsDir).filter(f => f !== '.gitkeep');
  const imageMap = {};

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    console.log(`Uploading ${file}...`);
    const url = await uploadImage(filePath);
    if (url) {
      imageMap[`/uploads/${file}`] = url;
    }
  }

  // Update product images in database
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  for (const product of data.products) {
    product.images = product.images.map(img => imageMap[img] || img);
  }
  for (const banner of data.banners) {
    if (imageMap[banner.image]) banner.image = imageMap[banner.image];
  }

  // Upload updated data to Supabase
  if (data.products.length > 0) {
    await supabase.from('products').upsert(data.products, { onConflict: 'id' });
  }
  if (data.banners.length > 0) {
    await supabase.from('banners').upsert(data.banners, { onConflict: 'id' });
  }

  console.log('\nDone! Images uploaded and product URLs updated.');
}

main().catch(console.error);
