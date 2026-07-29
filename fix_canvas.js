const fs = require('fs');
const dir = 'd:/the_space/frontend/src/assets/room-svgs/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg') && f !== 'room.svg');

files.forEach(f => {
  let content = fs.readFileSync(dir + f, 'utf8');
  // Remove existing width, height, viewBox
  content = content.replace(/width="[^"]+"/, '');
  content = content.replace(/height="[^"]+"/, '');
  content = content.replace(/viewBox="[^"]+"/, '');
  // Insert correct ones
  content = content.replace(/<svg\s+/, '<svg width="800" height="450" viewBox="0 0 800 450" ');
  fs.writeFileSync(dir + f, content);
  console.log('Fixed', f);
});
