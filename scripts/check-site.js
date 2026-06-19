const https = require('https');
https.get('https://tinytreasureworld.netlify.app', { headers: { 'Cache-Control': 'no-cache' } }, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    const hasDirectLogo = d.includes('src="/logo.png"');
    const hasNoNextImage = !d.includes('_next/image');
    const supabaseRef = d.includes('supabase.co');
    console.log('Logo via direct img tag:', hasDirectLogo);
    console.log('No next/image proxy:', hasNoNextImage);
    console.log('Has supabase reference:', supabaseRef);
    console.log('');
    console.log('Site is deployed correctly:', hasDirectLogo && hasNoNextImage ? 'YES' : 'NEED FIX');
  });
});
