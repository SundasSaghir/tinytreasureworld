const https = require('https');
function check() {
  https.get('https://api.netlify.com/api/v1/sites/tinytreasureworld.netlify.app/deploys', { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
    let d = '';
    r.on('data', c => d += c);
    r.on('end', () => {
      const dep = JSON.parse(d)[0];
      console.log('State:', dep.state, '| Commit:', (dep.commit_ref || '').slice(0,8));
      if (dep.state === 'ready') {
        https.get('https://tinytreasureworld.netlify.app/api/upload', { method: 'POST' }, r2 => {
          let d2 = '';
          r2.on('data', c => d2 += c);
          r2.on('end', () => console.log('Upload API:', r2.statusCode, d2));
        });
      }
    });
  });
}
setTimeout(check, 5000);
