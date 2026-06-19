const https = require('https');

// Test the upload API directly (should return 401 without cookie)
https.get('https://tinytreasureworld.netlify.app/api/upload', { method: 'POST' }, r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('Upload API status:', r.statusCode, '| body:', d);
  });
});

// Check product page JS to see updated error message
https.get('https://tinytreasureworld.netlify.app/admin/products/new', r => {
  let d = '';
  r.on('data', c => d += c);
  r.on('end', () => {
    console.log('Admin page length:', d.length);
    // Look for the error handling
    if (d.includes('Image upload failed')) {
      const idx = d.indexOf('Image upload failed');
      console.log('Error message found at index', idx, ':', d.slice(idx, idx + 50));
    } else {
      console.log('New code is deployed (no old error message)');
    }
    if (d.includes('Please login again')) {
      console.log('Found new server error message');
    }
  });
});
