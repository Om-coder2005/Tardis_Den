const fs = require('fs');
const files = fs.readdirSync('d:/the_space/frontend/src/assets/room-svgs');

files.forEach(file => {
  if (file.endsWith('.svg')) {
    const path = 'd:/the_space/frontend/src/assets/room-svgs/' + file;
    let content = fs.readFileSync(path, 'utf8');
    
    // Replace the <svg ...> tag to have width=800, height=450, viewBox=0 0 800 450
    content = content.replace(/<svg[^>]*>/, '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">');
    
    fs.writeFileSync(path, content, 'utf8');
    console.log('Fixed', file);
  }
});
