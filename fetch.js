const https = require('https');
https.get('https://cvent-production-cs-creative-production-us-east-1.s3.amazonaws.com/VisualShowcase/image-marquee/imagecrawler.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(data.substring(0, 1000)); });
});
