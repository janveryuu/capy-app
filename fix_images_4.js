const fs = require('fs');
const https = require('https');

const filesToFix = [
  { name: 'Angkor Wat', file: 'angkor-wat.jpg' },
  { name: 'Burj Khalifa', file: 'burj.jpg' },
  { name: 'Colosseum', file: 'colosseum.jpg' },
  { name: 'Great Pyramid of Giza', file: 'giza.jpg' },
  { name: 'Golden Gate Bridge', file: 'golden-gate.jpg' },
  { name: 'Grand Canyon', file: 'grand-canyon.jpg' },
  { name: 'Niagara Falls', file: 'niagara.jpg' },
  { name: 'Petra', file: 'petra.jpg' },
  { name: 'Stonehenge', file: 'stonehenge.jpg' },
  { name: 'Taj Mahal', file: 'taj-mahal.jpg' }
];

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchImage(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=800`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'CapyApp/1.0 (janveryuu@gmail.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            if (pages[pageId].thumbnail) resolve(pages[pageId].thumbnail.source);
            else resolve(null);
          } else resolve(null);
        } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'CapyApp/1.0 (janveryuu@gmail.com)' } }, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  for (const place of filesToFix) {
    console.log(`Fetching image for ${place.name}...`);
    const imgUrl = await fetchImage(place.name);
    if (imgUrl) {
      await download(imgUrl, `public/destinations/${place.file}`);
      console.log(`Saved ${place.file}`);
    } else {
      console.log(`Failed to find image for ${place.name}`);
    }
    await delay(3000);
  }
}

run();
