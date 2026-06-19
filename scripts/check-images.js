const https = require('https');
https.get('https://tinytreasureworld.netlify.app', r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    // Check if site is working
    console.log('Page loaded, length:', d.length);
    console.log('Contains placeholder.svg:', d.includes('placeholder.svg'));
    console.log('Contains supabase.co:', d.includes('supabase.co'));
    
    // Find product images
    const re = /<img[^>]+src="([^"]+)"[^>]*>/gi;
    let match;
    let count = 0;
    while ((match = re.exec(d)) !== null) {
      const src = match[1];
      if (src.includes('supabase') || src.includes('placeholder') || src.includes('logo')) {
        console.log('Image:', decodeURIComponent(src).slice(0, 80));
        count++;
      }
    }
    console.log('Total images:', count);
    
    // Try to fetch a supabase image through next/image
    const sampleUrl = 'https://tinytreasureworld.netlify.app/_next/image?url=' + encodeURIComponent('https://afawadbxgepeuyhjmstn.supabase.co/storage/v1/object/public/product-images/1781681527751-jjz3s0.jpg') + '&w=256&q=75';
    https.get(sampleUrl, r2 => {
      console.log('Next/Image proxy:', r2.statusCode);
      let d2 = '';
      r2.on('data', c => d2 += c);
      r2.on('end', () => {
        console.log('Response length:', d2.length);
        if (r2.statusCode !== 200) {
          console.log('Response:', d2.slice(0, 200));
        }
      });
    });
  });
});
