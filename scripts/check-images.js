const https = require('https');
https.get('https://tinytreasureworld.netlify.app', { headers: { 'Cache-Control': 'no-cache' } }, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    // Find all img tags
    const re = /<img[^>]+src="([^"]+)"[^>]*>/gi;
    let match;
    while ((match = re.exec(d)) !== null) {
      const src = match[1];
      console.log('  src:', decodeURIComponent(src));
    }
  });
});
