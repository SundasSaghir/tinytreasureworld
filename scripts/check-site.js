const https = require('https');
https.get('https://tinytreasureworld.netlify.app', r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('Page length:', d.length);
    console.log('Logo in HTML:', d.includes('logo.png') ? 'YES' : 'NO');
    const imgs = d.match(/<img[^>]+src="[^"]+"[^>]*>/gi) || [];
    console.log('Images found:', imgs.length);
    imgs.forEach(img => console.log(' -', img.replace(/<img[^>]+src="/, '').replace(/"[^>]*>/, '').slice(0, 60)));
    const prodItems = d.match(/\/products\/[^"]+/g) || [];
    console.log('Product links:', prodItems.length);
  });
});
