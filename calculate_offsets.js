const fs = require('fs');

const roomContent = fs.readFileSync('d:/the_space/frontend/src/assets/room-svgs/room.svg', 'utf8');

// Extract all paths from room.svg
const roomPaths = [];
let match;
const pathRegex = /<path[^>]*>/g;
while ((match = pathRegex.exec(roomContent)) !== null) {
    const pStr = match[0];
    const dMatch = pStr.match(/d=[\'"]([^\'"]+)[\'"]/);
    if (dMatch) {
        roomPaths.push({
            full: pStr,
            d: dMatch[1],
            normalized: dMatch[1].replace(/[\s,]/g, '')
        });
    }
}

const files = fs.readdirSync('d:/the_space/frontend/src/assets/room-svgs').filter(f => f.endsWith('.svg') && f !== 'room.svg');
const results = {};

files.forEach(file => {
    const content = fs.readFileSync('d:/the_space/frontend/src/assets/room-svgs/' + file, 'utf8');
    
    // Find width/height
    const wMatch = content.match(/width="([\d.]+)"/);
    const hMatch = content.match(/height="([\d.]+)"/);
    const w = wMatch ? parseFloat(wMatch[1]) : 0;
    const h = hMatch ? parseFloat(hMatch[1]) : 0;

    const localPaths = [];
    let lMatch;
    while ((lMatch = pathRegex.exec(content)) !== null) {
        const dMatch = lMatch[0].match(/d=[\'"]([^\'"]+)[\'"]/);
        if (dMatch) {
            localPaths.push({
                full: lMatch[0],
                d: dMatch[1],
                normalized: dMatch[1].replace(/[\s,]/g, '')
            });
        }
    }

    if (localPaths.length === 0) return;

    // Find the first path from the local file in the room file
    const targetPath = localPaths[0];
    const foundRoomPath = roomPaths.find(rp => rp.normalized === targetPath.normalized);

    if (foundRoomPath) {
        // Extract transforms
        let localTx = 0, localTy = 0, roomTx = 0, roomTy = 0;
        
        const ltMatch = targetPath.full.match(/transform="translate\(([\d.]+),([\d.]+)\)"/);
        if (ltMatch) {
            localTx = parseFloat(ltMatch[1]);
            localTy = parseFloat(ltMatch[2]);
        }
        
        const rtMatch = foundRoomPath.full.match(/transform="translate\(([\d.]+),([\d.]+)\)"/);
        if (rtMatch) {
            roomTx = parseFloat(rtMatch[1]);
            roomTy = parseFloat(rtMatch[2]);
        }

        const left = roomTx - localTx;
        const top = roomTy - localTy;

        results[file] = {
            left, top, w, h,
            leftPct: (left / 800) * 100,
            topPct: (top / 450) * 100,
            widthPct: (w / 800) * 100,
            heightPct: (h / 450) * 100
        };
    } else {
        console.log('Path not found in room.svg for', file);
    }
});

fs.writeFileSync('d:/the_space/offsets.json', JSON.stringify(results, null, 2));
console.log('Done!');
