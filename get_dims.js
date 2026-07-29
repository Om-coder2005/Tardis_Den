const fs = require('fs');
const files = ['telescope.svg', 'work desk.svg', 'book.svg', 'book-shelf.svg', 'bed.svg', 'camera.svg'];
files.forEach(f => {
  const content = fs.readFileSync('d:/the_space/frontend/src/assets/room-svgs/' + f, 'utf8');
  let wMatch = content.match(/width="([\d.]+)"/);
  let hMatch = content.match(/height="([\d.]+)"/);
  if (!wMatch || !hMatch) {
    wMatch = content.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    if(wMatch) hMatch = [null, null, wMatch[2]];
  }
  const w = parseFloat(wMatch[1]);
  const h = parseFloat(hMatch ? (hMatch[1]||hMatch[2]) : wMatch[2]);
  console.log(f, ':', w, 'x', h, '-> width:', (w/800*100).toFixed(4) + '%', 'height:', (h/450*100).toFixed(4) + '%');
});
