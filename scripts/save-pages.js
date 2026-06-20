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

const aboutContent = `<p>Welcome to <strong>Tiny Treasure World</strong>, a magical and colorful place where every little accessory brings joy, style, and confidence to kids.</p>

<p>We are a kids accessories brand dedicated to offering cute, trendy, and affordable products that make everyday moments more special. From hair accessories to jewellery, stationery, and vanity essentials — we bring everything together in one happy shopping place.</p>

<p>Our goal is simple: to make kids feel special with accessories they love and parents feel happy with the quality and prices.</p>

<h2>Our Story</h2>

<p>Tiny Treasure World started with a small idea — to create a fun and trusted space for kids\u2019 accessories that are both stylish and safe. We understand that children love colors, creativity, and fun designs, so we carefully choose every product with love and attention.</p>

<h2>Why Shop With Us</h2>

<ul>
<li><strong>Cute & trendy designs</strong> made for kids</li>
<li><strong>Safe, soft & lightweight</strong> materials</li>
<li><strong>Affordable prices</strong> for every budget</li>
<li><strong>Perfect for gifts</strong>, birthdays & special occasions</li>
<li><strong>Regular new arrivals</strong> to keep things exciting</li>
</ul>

<h2>What We Offer</h2>

<p>At Tiny Treasure World, you will find a wide range of adorable products:</p>

<ul>
<li>Hair Accessories</li>
<li>Jewellery Collection</li>
<li>Stationery Essentials</li>
<li>Vanity Pouches</li>
</ul>

<p>Everything is selected to bring smiles and make shopping easy and enjoyable.</p>

<h2>Our Promise</h2>

<p>We believe every child deserves to shine in their own unique way. That\u2019s why we focus on quality, comfort, and creativity in every item we offer.</p>

<p>Your trust means everything to us, and we always aim to deliver products that exceed expectations.</p>

<h2>Let\u2019s Shop Together</h2>

<p>Discover the latest cute collections and find something special for your little one today.</p>`;

const returnsContent = `<p>At Tiny Treasure World, we want you to shop with confidence. Customer satisfaction is very important to us, and we always try our best to provide quality products.</p>

<p>Please read our Returns & Refunds Policy carefully before placing an order.</p>

<h2>Returns Policy</h2>

<p>We accept returns only in the following cases:</p>

<ul>
<li><strong>Wrong product</strong> received</li>
<li><strong>Damaged</strong> product arrived</li>
<li><strong>Manufacturing defect</strong> in the product</li>
</ul>

<p>To be eligible for a return, please contact us within <strong>3 days</strong> of receiving your order.</p>

<p>Products must be unused, in original packaging, and in the same condition as received.</p>

<h2>Non-Returnable Items</h2>

<p>Some items cannot be returned due to hygiene and safety reasons:</p>

<ul>
<li>Hair accessories after use</li>
<li>Jewellery items once worn</li>
<li>Stationery items that are used or damaged after delivery</li>
<li>Clearance or sale items</li>
</ul>

<h2>Refund Policy</h2>

<p>Once your return is received and inspected, we will notify you about the approval or rejection of your refund.</p>

<ul>
<li>If approved, your refund will be processed within <strong>5\u20137 working days</strong></li>
<li>Refunds will be issued through the original payment method (or as discussed)</li>
</ul>

<h2>Exchange Policy</h2>

<p>We also offer exchanges for:</p>

<ul>
<li>Wrong item received</li>
<li>Damaged product</li>
</ul>

<p>If the same item is not available, we may offer a replacement or refund.</p>

<h2>Shipping Costs</h2>

<ul>
<li>Return shipping cost may be borne by the customer unless the mistake is from our side</li>
<li>If the product is damaged or wrong, we will cover the shipping cost</li>
</ul>

<h2>How to Request a Return</h2>

<p>To request a return or refund, please contact us with:</p>

<ul>
<li>Order details</li>
<li>Clear photos of the product</li>
<li>Reason for return</li>
</ul>

<p><strong>WhatsApp:</strong> +92331 2022874</p>

<h2>Our Promise</h2>

<p>We always try our best to make sure you are happy with your purchase. Your trust matters to us, and we are here to help you anytime.</p>`;

async function main() {
  const admin = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_KEY);

  // Save About Us
  const { error: e1 } = await admin.from('settings').upsert({
    key: 'page_about',
    value: JSON.stringify({ title: 'About Us', content: aboutContent })
  }, { onConflict: 'key' });
  console.log('About Us:', e1 ? e1.message : 'saved');

  // Save Returns
  const { error: e2 } = await admin.from('settings').upsert({
    key: 'page_returns',
    value: JSON.stringify({ title: 'Returns & Refunds', content: returnsContent })
  }, { onConflict: 'key' });
  console.log('Returns:', e2 ? e2.message : 'saved');

  // Delete pinterest_url setting
  const { error: e3 } = await admin.from('settings').delete().eq('key', 'pinterest_url');
  console.log('Pinterest setting:', e3 ? e3.message : 'deleted');
}

main().catch(console.error);
