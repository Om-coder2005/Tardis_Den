**#isometric room implementation**

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Nightwatch Study — Interactive Isometric Room</title>

<link rel="preconnect" href="https://fonts.googleapis.com">

<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700\&family=Inter:wght@400;500;600\&display=swap" rel="stylesheet">

<style>

&#x20; :root{

&#x20;   --wood-dark:#2A1A10;

&#x20;   --wood-mid:#4A2E1B;

&#x20;   --wood-light:#6B4226;

&#x20;   --space-deep:#0A0E28;

&#x20;   --space-mid:#121838;

&#x20;   --space-black:#05070F;

&#x20;   --warm-amber:#FFB347;

&#x20;   --warm-cream:#FFD180;

&#x20;   --star-white:#F5F0E6;

&#x20;   --plant-green:#3E5C43;

&#x20;   --plant-green-light:#5C8062;

&#x20;   --paper:#EDE3D0;

&#x20;   --ui-glass: rgba(18,24,56,0.72);

&#x20;   --font-display:'JetBrains Mono', ui-monospace, monospace;

&#x20;   --font-body:'Inter', system-ui, sans-serif;

&#x20; }

&#x20; \*{box-sizing:border-box;}

&#x20; html,body{

&#x20;   margin:0; padding:0; width:100%; height:100%;

&#x20;   background:var(--space-black);

&#x20;   font-family:var(--font-body);

&#x20;   overflow:hidden;

&#x20;   color:var(--star-white);

&#x20; }

&#x20; #app{

&#x20;   position:relative;

&#x20;   width:100vw; height:100vh;

&#x20;   display:flex; align-items:center; justify-content:center;

&#x20;   overflow:hidden;

&#x20; }

&#x20; #stage{

&#x20;   position:relative;

&#x20;   width:min(96vw, 1200px);

&#x20;   aspect-ratio: 1200 / 700;

&#x20;   max-height:92vh;

&#x20;   cursor:grab;

&#x20; }

&#x20; #stage.dragging{ cursor:grabbing; }

&#x20; #starfield{

&#x20;   position:absolute; inset:0;

&#x20;   width:100%; height:100%;

&#x20;   display:block;

&#x20;   border-radius:14px;

&#x20; }

&#x20; #roomsvg{

&#x20;   position:absolute; inset:0;

&#x20;   width:100%; height:100%;

&#x20;   display:block;

&#x20;   filter: drop-shadow(0 30px 60px rgba(0,0,0,0.55));

&#x20; }

&#x20; #scene-transform{

&#x20;   position:absolute; inset:0;

&#x20;   width:100%; height:100%;

&#x20;   transform-origin:50% 50%;

&#x20;   transition: transform .35s ease;

&#x20;   will-change:transform;

&#x20; }

&#x20; #scene-transform.panning{ transition:none; }



&#x20; .interactive{ cursor:pointer; }

&#x20; .interactive .hit{ opacity:0; }

&#x20; .glow-target{ transition: filter .25s ease, opacity .25s ease; }

&#x20; .interactive:hover .glow-target{

&#x20;   filter: drop-shadow(0 0 6px var(--warm-amber)) drop-shadow(0 0 14px var(--warm-amber));

&#x20; }

&#x20; .interactive:hover .hint-label{ opacity:1; transform:translateY(-4px); }

&#x20; .hint-label{

&#x20;   opacity:0; transition: all .2s ease;

&#x20;   pointer-events:none;

&#x20; }



&#x20; .flicker{ animation: flick 3.2s ease-in-out infinite; }

&#x20; @keyframes flick{

&#x20;   0%,100%{ opacity:1; }

&#x20;   45%{ opacity:.78; }

&#x20;   52%{ opacity:1; }

&#x20;   68%{ opacity:.85; }

&#x20; }

&#x20; .dim-mode #scene-transform{ filter: brightness(.55) saturate(.8); }

&#x20; .dim-mode #starfield{ filter: brightness(.5); }



&#x20; /\* ---------- Floating control dock ---------- \*/

&#x20; #dock{

&#x20;   position:absolute;

&#x20;   bottom:18px; left:50%;

&#x20;   transform:translateX(-50%);

&#x20;   display:flex; gap:8px;

&#x20;   background:var(--ui-glass);

&#x20;   backdrop-filter: blur(10px);

&#x20;   border:1px solid rgba(255,179,71,0.25);

&#x20;   padding:8px;

&#x20;   border-radius:16px;

&#x20;   z-index:40;

&#x20;   box-shadow:0 8px 30px rgba(0,0,0,.5);

&#x20; }

&#x20; .dock-btn{

&#x20;   display:flex; flex-direction:column; align-items:center; gap:3px;

&#x20;   background:transparent;

&#x20;   border:1px solid transparent;

&#x20;   color:var(--star-white);

&#x20;   font-family:var(--font-display);

&#x20;   font-size:9px;

&#x20;   letter-spacing:.03em;

&#x20;   padding:9px 12px 7px;

&#x20;   border-radius:11px;

&#x20;   cursor:pointer;

&#x20;   transition: all .18s ease;

&#x20;   text-transform:uppercase;

&#x20; }

&#x20; .dock-btn svg{ width:18px; height:18px; }

&#x20; .dock-btn:hover{ background:rgba(255,179,71,0.14); border-color:rgba(255,179,71,0.4); }

&#x20; .dock-btn.active{ background:rgba(255,179,71,0.22); border-color:var(--warm-amber); color:var(--warm-cream); }



&#x20; #title-card{

&#x20;   position:absolute; top:18px; left:18px;

&#x20;   z-index:40;

&#x20;   font-family:var(--font-display);

&#x20;   letter-spacing:.06em;

&#x20;   pointer-events:none;

&#x20; }

&#x20; #title-card .eyebrow{ font-size:10px; color:var(--warm-amber); text-transform:uppercase; opacity:.85; }

&#x20; #title-card h1{ margin:2px 0 0; font-size:16px; font-weight:700; color:var(--star-white); }



&#x20; /\* ---------- Modals ---------- \*/

&#x20; .modal-overlay{

&#x20;   position:absolute; inset:0;

&#x20;   background:rgba(5,7,15,0.68);

&#x20;   backdrop-filter: blur(3px);

&#x20;   display:flex; align-items:center; justify-content:center;

&#x20;   opacity:0; pointer-events:none;

&#x20;   transition: opacity .2s ease;

&#x20;   z-index:100;

&#x20; }

&#x20; .modal-overlay.open{ opacity:1; pointer-events:auto; }

&#x20; .modal-card{

&#x20;   width:min(86%, 460px);

&#x20;   max-height:80%;

&#x20;   overflow:auto;

&#x20;   background:linear-gradient(180deg, #171F45, #0E1330);

&#x20;   border:1px solid rgba(255,179,71,0.35);

&#x20;   border-radius:14px;

&#x20;   padding:22px 22px 20px;

&#x20;   transform: translateY(14px) scale(.98);

&#x20;   transition: transform .25s ease;

&#x20;   box-shadow:0 20px 60px rgba(0,0,0,.6);

&#x20; }

&#x20; .modal-overlay.open .modal-card{ transform: translateY(0) scale(1); }

&#x20; .modal-card h2{

&#x20;   font-family:var(--font-display);

&#x20;   font-size:14px; letter-spacing:.05em; text-transform:uppercase;

&#x20;   color:var(--warm-amber); margin:0 0 4px;

&#x20;   display:flex; align-items:center; justify-content:space-between;

&#x20; }

&#x20; .modal-card .sub{ font-size:11.5px; color:#9AA3C7; margin-bottom:14px; font-family:var(--font-display); }

&#x20; .modal-close{

&#x20;   background:none; border:none; color:#9AA3C7; font-size:18px; cursor:pointer; line-height:1;

&#x20;   padding:2px 6px;

&#x20; }

&#x20; .modal-close:hover{ color:var(--warm-cream); }



&#x20; .term-line{ font-family:var(--font-display); font-size:12.5px; margin:0 0 9px; color:#D7DCF2; }

&#x20; .term-line .path{ color:#6FCF97; }

&#x20; .term-line .prompt{ color:var(--warm-amber); }

&#x20; .proj-item{

&#x20;   border:1px solid rgba(255,179,71,0.2);

&#x20;   border-radius:8px; padding:10px 12px; margin-bottom:8px;

&#x20;   background:rgba(255,179,71,0.05);

&#x20; }

&#x20; .proj-item b{ font-size:13px; color:var(--star-white); }

&#x20; .proj-item span{ display:block; font-size:12px; color:#AEB6D6; margin-top:3px; }



&#x20; .sky-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px; }

&#x20; .sky-chip{

&#x20;   border:1px solid rgba(255,179,71,0.25); border-radius:8px;

&#x20;   padding:9px 10px; font-size:12px; cursor:pointer;

&#x20;   background:rgba(255,255,255,0.02);

&#x20;   transition: background .15s ease;

&#x20; }

&#x20; .sky-chip:hover{ background:rgba(255,179,71,0.12); }

&#x20; .sky-chip b{ display:block; font-family:var(--font-display); font-size:11.5px; color:var(--warm-cream); }

&#x20; .sky-fact{

&#x20;   margin-top:10px; font-size:12px; color:#C9CEE8; min-height:18px;

&#x20;   border-top:1px dashed rgba(255,179,71,0.25); padding-top:10px;

&#x20; }



&#x20; .book-row{

&#x20;   display:flex; justify-content:space-between; align-items:center;

&#x20;   padding:8px 4px; border-bottom:1px solid rgba(255,255,255,0.06);

&#x20;   font-size:12.5px;

&#x20; }

&#x20; .book-row span:last-child{ color:#8E97BE; font-family:var(--font-display); font-size:10.5px; }



&#x20; .relax-panel{ text-align:center; padding:6px 0 2px; }

&#x20; .relax-orb{

&#x20;   width:80px; height:80px; margin:4px auto 14px;

&#x20;   border-radius:50%;

&#x20;   background: radial-gradient(circle at 35% 30%, var(--warm-cream), var(--warm-amber) 55%, #7a4a12 100%);

&#x20;   box-shadow:0 0 30px rgba(255,179,71,0.45);

&#x20;   display:flex; align-items:center; justify-content:center;

&#x20; }

&#x20; .relax-orb.playing{ animation: pulseOrb 1.6s ease-in-out infinite; }

&#x20; @keyframes pulseOrb{ 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.08);} }

&#x20; .relax-btn{

&#x20;   background:var(--warm-amber); color:#2A1A10; border:none; border-radius:20px;

&#x20;   padding:9px 20px; font-family:var(--font-display); font-size:12px; font-weight:700;

&#x20;   cursor:pointer; letter-spacing:.03em; text-transform:uppercase;

&#x20; }

&#x20; .relax-btn:hover{ background:var(--warm-cream); }



&#x20; #info-body p{ font-size:13px; line-height:1.6; color:#C9CEE8; margin:0 0 10px;}



&#x20; @media (prefers-reduced-motion: reduce){

&#x20;   .flicker, .relax-orb.playing{ animation:none !important; }

&#x20;   #scene-transform{ transition:none !important; }

&#x20; }

</style>

</head>

<body>

<div id="app">

&#x20; <div id="stage">

&#x20;   <canvas id="starfield"></canvas>

&#x20;   <div id="scene-transform">

&#x20;     <svg id="roomsvg" viewBox="0 0 1200 700" xmlns="http://www.w3.org/2000/svg"></svg>

&#x20;   </div>



&#x20;   <div id="title-card">

&#x20;     <div class="eyebrow">Room 04 — Nightwatch Study</div>

&#x20;     <h1>Click an object to explore</h1>

&#x20;   </div>



&#x20;   <!-- Dock -->

&#x20;   <div id="dock">

&#x20;     <button class="dock-btn" id="btn-audio" title="Toggle ambient audio">

&#x20;       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 8a5 5 0 010 8" id="wave1"/><path d="M19.5 5.5a9 9 0 010 13" id="wave2"/></svg>

&#x20;       Audio

&#x20;     </button>

&#x20;     <button class="dock-btn" id="btn-lights" title="Toggle lights">

&#x20;       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.45 1 1.15 1 1.9V16h5v-.2c0-.75.4-1.45 1-1.9A6 6 0 0012 3z"/></svg>

&#x20;       Lights

&#x20;     </button>

&#x20;     <button class="dock-btn" id="btn-reset" title="Reset view">

&#x20;       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12a9 9 0 1 1 3 6.7"/><path d="M3 4v6h6"/></svg>

&#x20;       Reset

&#x20;     </button>

&#x20;     <button class="dock-btn" id="btn-info" title="About this room">

&#x20;       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>

&#x20;       Info

&#x20;     </button>

&#x20;   </div>

&#x20; </div>



&#x20; <!-- Modals -->

&#x20; <div class="modal-overlay" id="modal-monitor">

&#x20;   <div class="modal-card">

&#x20;     <h2>Workstation Terminal <button class="modal-close" data-close>\&times;</button></h2>

&#x20;     <div class="sub">\~/portfolio — showcase mode</div>

&#x20;     <p class="term-line"><span class="prompt">\&gt;</span> ls <span class="path">./projects</span></p>

&#x20;     <div class="proj-item"><b>Orbit Tracker</b><span>Realtime satellite pass visualizer — canvas + WebGL</span></div>

&#x20;     <div class="proj-item"><b>Constellation Notes</b><span>A markdown star atlas with searchable sky charts</span></div>

&#x20;     <div class="proj-item"><b>Deep Field</b><span>Procedural nebula generator, exported as shader presets</span></div>

&#x20;     <p class="term-line" style="margin-top:14px;"><span class="prompt">\&gt;</span> echo "status: building at night" <span style="opacity:.5;">\_</span></p>

&#x20;   </div>

&#x20; </div>



&#x20; <div class="modal-overlay" id="modal-telescope">

&#x20;   <div class="modal-card">

&#x20;     <h2>Stargazing Mode <button class="modal-close" data-close>\&times;</button></h2>

&#x20;     <div class="sub">Aim the eyepiece — tap a marker</div>

&#x20;     <div class="sky-grid">

&#x20;       <div class="sky-chip" data-fact="Home to the three stars of the belt, best viewed on clear winter evenings.">

&#x20;         <b>Orion</b>Winter hunter

&#x20;       </div>

&#x20;       <div class="sky-chip" data-fact="Its seven brightest stars form the familiar plough or dipper shape.">

&#x20;         <b>Ursa Major</b>The great bear

&#x20;       </div>

&#x20;       <div class="sky-chip" data-fact="Marked by a bright W-shaped pattern near the northern sky.">

&#x20;         <b>Cassiopeia</b>The queen

&#x20;       </div>

&#x20;       <div class="sky-chip" data-fact="A hazy band overhead — actually billions of stars in our galaxy's disk.">

&#x20;         <b>The Milky Way</b>Our home galaxy

&#x20;       </div>

&#x20;     </div>

&#x20;     <div class="sky-fact" id="sky-fact-text">Tap a constellation to read a quick fact.</div>

&#x20;   </div>

&#x20; </div>



&#x20; <div class="modal-overlay" id="modal-bookcase">

&#x20;   <div class="modal-card">

&#x20;     <h2>Bookcase Drawer <button class="modal-close" data-close>\&times;</button></h2>

&#x20;     <div class="sub">Reading list — bottom drawer</div>

&#x20;     <div class="book-row"><span>Notes on Orbital Mechanics</span><span>NONFICTION</span></div>

&#x20;     <div class="book-row"><span>The Last Lighthouse Keeper</span><span>SCI-FI</span></div>

&#x20;     <div class="book-row"><span>Field Guide to Faint Stars</span><span>REFERENCE</span></div>

&#x20;     <div class="book-row"><span>Draft: untitled short story</span><span>IN PROGRESS</span></div>

&#x20;     <div class="book-row"><span>Atlas of the Southern Sky</span><span>REFERENCE</span></div>

&#x20;   </div>

&#x20; </div>



&#x20; <div class="modal-overlay" id="modal-relax">

&#x20;   <div class="modal-card">

&#x20;     <h2>Relax Mode <button class="modal-close" data-close>\&times;</button></h2>

&#x20;     <div class="sub">Bean bag \&amp; bed corner</div>

&#x20;     <div class="relax-panel">

&#x20;       <div class="relax-orb" id="relax-orb"></div>

&#x20;       <button class="relax-btn" id="relax-toggle">Play ambient</button>

&#x20;     </div>

&#x20;   </div>

&#x20; </div>



&#x20; <div class="modal-overlay" id="modal-info">

&#x20;   <div class="modal-card" id="info-body">

&#x20;     <h2>About This Room <button class="modal-close" data-close>\&times;</button></h2>

&#x20;     <p>A small study built for looking up. Bookshelves and a desk on one side, a wide window on the other, and a rug in between for sitting still.</p>

&#x20;     <p>Hover an object to see it glow, click it to look closer. Drag the room to look around, scroll to zoom, and use the dock below to change the mood.</p>

&#x20;   </div>

&#x20; </div>

</div>



<script>

(function(){

"use strict";



/\* ============================================================

&#x20;  PALETTE

============================================================ \*/

const PAL = {

&#x20; woodDark:"#2A1A10", woodMid:"#4A2E1B", woodLight:"#6B4226", woodPlank:"#3A2415",

&#x20; navyDeep:"#0A0E28", navyMid:"#121838", navyBlack:"#05070F",

&#x20; amber:"#FFB347", cream:"#FFD180", star:"#F5F0E6",

&#x20; plant:"#3E5C43", plantLight:"#5C8062",

&#x20; paper:"#EDE3D0", paperDark:"#C9BCA0",

&#x20; metal:"#8A8F9E", metalDark:"#4C505C",

&#x20; fabric:"#33406B", fabricLight:"#4B5A93",

&#x20; rugBase:"#3A2E52", rugAccent:"#8A5A3A"

};



function shade(hex, pct){ // pct negative = darken, positive = lighten

&#x20; let c = hex.replace('#','');

&#x20; if(c.length===3) c = c.split('').map(x=>x+x).join('');

&#x20; let num = parseInt(c,16);

&#x20; let r = (num>>16), g=(num>>8 \& 0xff), b=(num \& 0xff);

&#x20; const amt = Math.round(2.55\*pct);

&#x20; r = Math.min(255,Math.max(0,r+amt));

&#x20; g = Math.min(255,Math.max(0,g+amt));

&#x20; b = Math.min(255,Math.max(0,b+amt));

&#x20; return "#"+(r<<16|g<<8|b).toString(16).padStart(6,'0');

}



/\* ============================================================

&#x20;  ISOMETRIC PROJECTION

&#x20;  world axes: w (toward front-left), d (toward front-right), z (up)

&#x20;  back corner (0,0,0) is the far point where both walls meet.

============================================================ \*/

const TILE = 40;

const ORIGIN = {x:600, y:250};

const COS30 = Math.cos(Math.PI/6);

const SIN30 = 0.5;



function proj(w,d,z){

&#x20; const sx = (d - w) \* COS30 \* TILE;

&#x20; const sy = (d + w) \* SIN30 \* TILE - z \* TILE;

&#x20; return \[ORIGIN.x + sx, ORIGIN.y + sy];

}

function pts(arr3d){ return arr3d.map(p=>proj(p\[0],p\[1],p\[2]).join(',')).join(' '); }



const SVGNS = "http://www.w3.org/2000/svg";

const svg = document.getElementById('roomsvg');

function el(tag, attrs){

&#x20; const e = document.createElementNS(SVGNS, tag);

&#x20; for(const k in attrs) e.setAttribute(k, attrs\[k]);

&#x20; return e;

}

function group(attrs){ return el('g', attrs||{}); }



/\* Basic polygon helper \*/

function poly(points3d, fill, extra){

&#x20; const p = el('polygon', Object.assign({points: pts(points3d), fill: fill, stroke:'rgba(0,0,0,0.18)', 'stroke-width':'0.6'}, extra||{}));

&#x20; return p;

}



/\* Axis-aligned box: w0..w1, d0..d1, z0..z1 -> top + two near faces \*/

function isoBox(parent, w0,w1,d0,d1,z0,z1, baseColor, opts){

&#x20; opts = opts||{};

&#x20; const top = \[\[w0,d0,z1],\[w1,d0,z1],\[w1,d1,z1],\[w0,d1,z1]];

&#x20; const faceW = \[\[w1,d0,z0],\[w1,d1,z0],\[w1,d1,z1],\[w1,d0,z1]]; // near-left visible face

&#x20; const faceD = \[\[w0,d1,z0],\[w1,d1,z0],\[w1,d1,z1],\[w0,d1,z1]]; // near-right visible face

&#x20; const g = group({class: opts.cls||''});

&#x20; g.appendChild(poly(faceW, shade(baseColor,-22)));

&#x20; g.appendChild(poly(faceD, shade(baseColor,-8)));

&#x20; g.appendChild(poly(top, shade(baseColor, opts.topLift!==undefined?opts.topLift:14)));

&#x20; parent.appendChild(g);

&#x20; return g;

}



/\* Flat quad directly from 3d points (for walls, windows, posters, rugs) \*/

function flatQuad(parent, points3d, fill, extra){

&#x20; const p = poly(points3d, fill, extra);

&#x20; parent.appendChild(p);

&#x20; return p;

}



/\* Tapered tube between two 3d points (for telescope barrel, ladder rails) \*/

function tube(parent, p1, p2, thickness, color){

&#x20; const a = proj(p1\[0],p1\[1],p1\[2]);

&#x20; const b = proj(p2\[0],p2\[1],p2\[2]);

&#x20; const dx = b\[0]-a\[0], dy = b\[1]-a\[1];

&#x20; const len = Math.hypot(dx,dy) || 1;

&#x20; const nx = -dy/len\*thickness, ny = dx/len\*thickness;

&#x20; const p = el('polygon', {

&#x20;   points: `${a\[0]+nx},${a\[1]+ny} ${b\[0]+nx\*0.6},${b\[1]+ny\*0.6} ${b\[0]-nx\*0.6},${b\[1]-ny\*0.6} ${a\[0]-nx},${a\[1]-ny}`,

&#x20;   fill: color, stroke:'rgba(0,0,0,0.25)', 'stroke-width':'0.5'

&#x20; });

&#x20; parent.appendChild(p);

&#x20; return p;

}

function thinLine(parent, p1, p2, color, width){

&#x20; const a = proj(p1\[0],p1\[1],p1\[2]);

&#x20; const b = proj(p2\[0],p2\[1],p2\[2]);

&#x20; parent.appendChild(el('line',{x1:a\[0],y1:a\[1],x2:b\[0],y2:b\[1],stroke:color,'stroke-width':width,'stroke-linecap':'round'}));

}

function glowCircle(parent, w,d,z, r, color, cls){

&#x20; const \[x,y] = proj(w,d,z);

&#x20; const g = group({class: cls||''});

&#x20; g.appendChild(el('circle',{cx:x,cy:y,r:r\*2.2,fill:color,opacity:0.22}));

&#x20; g.appendChild(el('circle',{cx:x,cy:y,r:r,fill:color}));

&#x20; parent.appendChild(g);

&#x20; return g;

}



/\* ============================================================

&#x20;  ROOM DIMENSIONS

============================================================ \*/

const W = 9, D = 9, H = 6.0;



/\* Layer groups so draw order is correct (back-to-front) \*/

const gFloor   = group({id:'g-floor'});

const gWalls   = group({id:'g-walls'});

const gWallDeco= group({id:'g-walldeco'});

const gBack    = group({id:'g-back-furniture'});   // bed, bookcase-adjacent floor items

const gMid     = group({id:'g-mid-furniture'});

const gFront   = group({id:'g-front-furniture'});

const gLights  = group({id:'g-lights'});

svg.appendChild(gFloor);

svg.appendChild(gWalls);

svg.appendChild(gFloor); // floor re-added after walls for correct stacking below

svg.appendChild(gWallDeco);

svg.appendChild(gBack);

svg.appendChild(gMid);

svg.appendChild(gFront);

svg.appendChild(gLights);



/\* ---- Floor ---- \*/

flatQuad(gFloor, \[\[0,0,0],\[W,0,0],\[W,D,0],\[0,D,0]], PAL.woodMid);

// plank seams

for(let i=1;i<9;i++){

&#x20; thinLine(gFloor, \[0,i,0],\[W,i,0], 'rgba(0,0,0,0.10)', 1.2);

}



/\* ---- Walls ---- \*/

// Left wall (bookcase wall): plane d=0

flatQuad(gWalls, \[\[0,0,0],\[W,0,0],\[W,0,H],\[0,0,H]], PAL.woodDark);

// wall plank texture

for(let i=1;i<9;i++) thinLine(gWalls, \[i,0,0],\[i,0,H], 'rgba(0,0,0,0.14)', 1);



// Back/right wall (window wall): plane w=0

flatQuad(gWalls, \[\[0,0,0],\[0,D,0],\[0,D,H],\[0,0,H]], PAL.navyMid);

// small gable/skylight cap above the wall for an angled-roof feel

flatQuad(gWalls, \[\[0,2.2,H],\[0,3.0,H+1.6],\[0,6.0,H+1.6],\[0,6.8,H]], PAL.navyDeep);



/\* ============================================================

&#x20;  WINDOW (starfield shows through since fill is none)

============================================================ \*/

const windowPts = \[\[0,1.1,0.9],\[0,7.4,0.9],\[0,7.4,5.7],\[0,1.1,5.7]];

flatQuad(gWallDeco, windowPts, 'rgba(255,255,255,0.02)', {stroke:'none'});

// mullions (window frame bars)

const wD0=1.1, wD1=7.4, wZ0=0.9, wZ1=5.7;

for(let i=1;i<5;i++){

&#x20; const dd = wD0 + (wD1-wD0)\*i/5;

&#x20; thinLine(gWallDeco, \[0,dd,wZ0],\[0,dd,wZ1], 'rgba(255,179,71,0.28)', 2.2);

}

for(let i=1;i<4;i++){

&#x20; const zz = wZ0 + (wZ1-wZ0)\*i/4;

&#x20; thinLine(gWallDeco, \[0,wD0,zz],\[0,wD1,zz], 'rgba(255,179,71,0.28)', 2.2);

}

// outer frame

flatQuad(gWallDeco, windowPts, 'none', {stroke:'#FFB347','stroke-width':3, 'stroke-opacity':0.55});

// gable window sliver

flatQuad(gWallDeco, \[\[0,2.6,H+0.15],\[0,3.15,H+1.35],\[0,5.85,H+1.35],\[0,6.4,H+0.15]], 'rgba(255,255,255,0.015)', {stroke:'#FFB347','stroke-width':2,'stroke-opacity':0.4});



/\* ---- Framed posters on left wall ---- \*/

function poster(w0,w1,z0,z1, tone){

&#x20; const frame = \[\[w0,0,z0],\[w1,0,z0],\[w1,0,z1],\[w0,0,z1]];

&#x20; flatQuad(gWallDeco, frame, PAL.woodLight, {'stroke-width':1.2});

&#x20; const pad=0.12;

&#x20; flatQuad(gWallDeco, \[\[w0+pad,0,z0+pad],\[w1-pad,0,z0+pad],\[w1-pad,0,z1-pad],\[w0+pad,0,z1-pad]], tone, {stroke:'none'});

}

poster(4.6,5.5,2.3,3.9,'#0E1330');    // star chart poster

poster(5.8,6.5,2.6,3.6,'#182347');    // small galaxy print

// tiny dots on star chart for constellation feel

(function(){

&#x20; const dots=\[\[4.85,2.7],\[5.0,3.1],\[5.2,2.9],\[5.05,3.5],\[5.35,3.3]];

&#x20; dots.forEach(pos=> glowCircle(gWallDeco,pos\[0],0,pos\[1],1.1,'#F5F0E6'));

})();



/\* ---- Fairy lights along top wall edges ---- \*/

function fairyLights(edgeA, edgeB, count){

&#x20; for(let i=0;i<=count;i++){

&#x20;   const t=i/count;

&#x20;   const w = edgeA\[0] + (edgeB\[0]-edgeA\[0])\*t;

&#x20;   const d = edgeA\[1] + (edgeB\[1]-edgeA\[1])\*t;

&#x20;   const sag = Math.sin(t\*Math.PI)\*0.18;

&#x20;   const z = H + 0.05 - sag;

&#x20;   const c = glowCircle(gLights, w,d,z, 2.1, PAL.cream, 'flicker');

&#x20;   c.style.animationDelay = (t\*2.6).toFixed(2)+'s';

&#x20; }

}

fairyLights(\[0,0],\[9,0], 14);   // along left wall top

fairyLights(\[0,0],\[0,9], 14);   // along back wall top



/\* ============================================================

&#x20;  LEFT WALL ZONE — BOOKCASE (upper) + BED (floor)

============================================================ \*/

// Bookcase

const bc = isoBox(gBack, 1.2,3.0, 0,0.55, 0,4.3, PAL.woodLight, {cls:'interactive'});

bc.setAttribute('data-obj','bookcase');

// shelves + books (thin colored strips on the front face)

(function(){

&#x20; const shelfColors = \['#CC6B49','#4C6B4F','#D9A441','#6E5AA3','#B5432E','#3F7E7A'];

&#x20; for(let s=0;s<4;s++){

&#x20;   const z0 = 0.35 + s\*0.95, z1 = z0+0.72;

&#x20;   let w=1.35;

&#x20;   let ci=0;

&#x20;   while(w < 2.85){

&#x20;     const bw = 0.12 + Math.random()\*0.1;

&#x20;     if(w+bw>2.85) break;

&#x20;     flatQuad(gBack, \[\[w,0.5,z0],\[w+bw,0.5,z0],\[w+bw,0.5,z1],\[w,0.5,z1]], shelfColors\[ci%shelfColors.length]);

&#x20;     w += bw+0.02; ci++;

&#x20;   }

&#x20;   thinLine(gBack, \[1.25,0.56,z0-0.03],\[2.95,0.56,z0-0.03], 'rgba(0,0,0,0.35)', 2);

&#x20; }

})();

// small plants atop bookcase

isoBox(gBack, 1.35,1.62, 0.05,0.35, 4.3,4.62, PAL.plant, {topLift:20});

isoBox(gBack, 2.55,2.8, 0.05,0.35, 4.3,4.55, PAL.plantLight, {topLift:20});

// rolling ladder leaning beside the bookcase

tube(gBack, \[3.25,0.05,0.1],\[3.55,0.05,4.1], 0.045, PAL.woodLight);

tube(gBack, \[3.55,0.35,0.1],\[3.85,0.35,4.1], 0.045, PAL.woodLight);

for(let r=0;r<6;r++){

&#x20; const zz=0.5+r\*0.6;

&#x20; thinLine(gBack, \[3.27,0.06,zz],\[3.57,0.34,zz], PAL.woodLight, 2.4);

}



// Bed

const bed = isoBox(gBack, 0.7,4.1, 0.3,3.3, 0,1.0, PAL.woodDark, {cls:'interactive'});

bed.setAttribute('data-obj','relax');

isoBox(gBack, 0.85,3.95, 0.4,3.2, 1.0,1.32, '#E9E2D4'); // mattress/blanket

isoBox(gBack, 1.0,1.9, 0.5,1.35, 1.32,1.58, PAL.fabricLight); // pillow

isoBox(gBack, 3.1,3.65, 0.55,1.1, 1.32,1.5, PAL.star); // second pillow

// astronaut plushie (simple rounded stack)

isoBox(gBack, 3.15,3.55, 1.5,1.9, 1.32,1.62, '#DCE3EA');

glowCircle(gBack, 3.35,1.7,1.72, 6.5, '#DCE3EA');

// nightstand + lamp

isoBox(gBack, 0.15,0.75, 0.15,0.75, 0,0.85, PAL.woodMid);

glowCircle(gLights, 0.45,0.45,1.05, 9, PAL.cream, 'flicker');

isoBox(gBack, 0.32,0.58, 0.32,0.58, 0.85,1.0, PAL.woodLight);

// storage console at foot of bed

isoBox(gBack, 0.9,3.4, 3.55,4.15, 0,0.68, PAL.woodMid);

isoBox(gBack, 1.0,1.3, 3.65,3.95, 0.68,1.05, PAL.plant, {topLift:20});

glowCircle(gLights, 2.9,3.85,0.85, 6, PAL.amber, 'flicker');



/\* ============================================================

&#x20;  BACK/RIGHT WALL ZONE — DESK (floor) + TELESCOPE

============================================================ \*/

const desk = isoBox(gMid, 0,0.95, 4.5,7.3, 0,1.0, PAL.woodMid, {cls:'interactive'});

desk.setAttribute('data-obj','monitor');

// monitor

isoBox(gMid, 0.1,0.28, 5.35,6.05, 1.0,1.85, '#1B1F2E');

flatQuad(gMid, \[\[0.28,5.42,1.08],\[0.28,5.98,1.08],\[0.28,5.98,1.78],\[0.28,5.42,1.78]], '#3FA9F5', {stroke:'none'});

glowCircle(gLights, 0.31,5.7,1.4, 7, 'rgba(63,169,245,0.9)');

// desk lamp

tube(gMid, \[0.2,7.05,1.0],\[0.2,7.05,1.55], 0.05, PAL.metalDark);

tube(gMid, \[0.2,7.05,1.5],\[0.35,6.75,1.62], 0.045, PAL.metalDark);

glowCircle(gLights, 0.37,6.72,1.63, 8, PAL.cream, 'flicker');

// mug + journal

isoBox(gMid, 0.55,0.68, 6.55,6.7, 1.0,1.18, '#D9613F');

isoBox(gMid, 0.5,0.78, 6.05,6.35, 1.0,1.05, PAL.paperDark);

// desk chair

isoBox(gMid, 1.55,2.15, 5.1,5.7, 0.55,0.7, PAL.metalDark); // seat

isoBox(gMid, 1.95,2.15, 5.1,5.7, 0.7,1.55, '#2C3550');       // backrest

tube(gMid, \[1.6,5.15,0],\[1.6,5.15,0.55], 0.03, PAL.metalDark);

tube(gMid, \[2.1,5.15,0],\[2.1,5.15,0.55], 0.03, PAL.metalDark);

tube(gMid, \[1.6,5.65,0],\[1.6,5.65,0.55], 0.03, PAL.metalDark);

tube(gMid, \[2.1,5.65,0],\[2.1,5.65,0.55], 0.03, PAL.metalDark);



// Telescope

const scope = group({class:'interactive'});

scope.setAttribute('data-obj','telescope');

tube(scope, \[1.15,2.1,0],\[0.85,2.35,2.55], 0.035, PAL.metalDark);

tube(scope, \[1.45,2.6,0],\[0.85,2.35,2.55], 0.035, PAL.metalDark);

tube(scope, \[1.15,2.95,0],\[0.85,2.35,2.55], 0.035, PAL.metalDark);

tube(scope, \[0.85,2.35,2.55],\[0.15,1.55,4.35], 0.13, '#C69A4E');

glowCircle(scope, 0.1,1.45,4.42, 3.4, '#FFE9BE');

gMid.appendChild(scope);



/\* ============================================================

&#x20;  CENTER FLOOR — RUG, COFFEE TABLE, BEAN BAG

============================================================ \*/

flatQuad(gFront, \[\[1.7,1.9,0.005],\[6.3,1.9,0.005],\[6.3,6.5,0.005],\[1.7,6.5,0.005]], PAL.rugBase);

flatQuad(gFront, \[\[2.1,2.3,0.008],\[5.9,2.3,0.008],\[5.9,6.1,0.008],\[2.1,6.1,0.008]], 'none', {stroke:PAL.rugAccent,'stroke-width':2.4,'stroke-opacity':0.7});

flatQuad(gFront, \[\[3.4,3.6,0.01],\[4.6,3.6,0.01],\[4.6,4.8,0.01],\[3.4,4.8,0.01]], 'none', {stroke:PAL.amber,'stroke-width':1.4,'stroke-opacity':0.45});



// coffee table

isoBox(gFront, 3.1,4.1, 3.7,4.7, 0,0.42, PAL.woodLight);

isoBox(gFront, 3.25,3.65, 3.85,4.1, 0.42,0.5, PAL.paper); // book

isoBox(gFront, 3.7,3.98, 4.15,4.4, 0.42,0.62, '#3A2E24'); // lantern body

glowCircle(gLights, 3.84,4.28,0.66, 6.5, PAL.cream, 'flicker');



// bean bag (approx blob via layered ellipses)

const bag = group({class:'interactive'});

bag.setAttribute('data-obj','relax');

(function(){

&#x20; const \[cx,cy] = proj(5.3,5.3,0.02);

&#x20; const \[tx,ty] = proj(5.3,5.3,1.0);

&#x20; const rw = 68, rh = 40;

&#x20; bag.appendChild(el('ellipse',{cx:cx,cy:cy,rx:rw,ry:rh,fill:shade(PAL.fabric,-15)}));

&#x20; bag.appendChild(el('ellipse',{cx:(cx+tx)/2, cy:(cy+ty)/2 - 6, rx:rw\*0.86, ry:rh\*0.86, fill:PAL.fabric}));

&#x20; bag.appendChild(el('ellipse',{cx:tx, cy:ty-10, rx:rw\*0.62, ry:rh\*0.62, fill:shade(PAL.fabric,10)}));

&#x20; const stars = \[\[-18,-6],\[10,-14],\[-4,4],\[20,2],\[-24,10]];

&#x20; stars.forEach(s=> bag.appendChild(el('circle',{cx:tx+s\[0], cy:ty-10+s\[1], r:1.6, fill:PAL.star, opacity:0.85})));

})();

gFront.appendChild(bag);



// scattered lanterns

glowCircle(gLights, 1.0,3.55,0.28, 6, PAL.amber, 'flicker');

isoBox(gFront, 0.85,1.1, 3.4,3.65, 0,0.28, '#3A2E24');

glowCircle(gLights, 6.5,4.4,0.28, 6, PAL.amber, 'flicker');

isoBox(gFront, 6.35,6.6, 4.25,4.5, 0,0.28, '#3A2E24');



/\* ============================================================

&#x20;  STARFIELD CANVAS

============================================================ \*/

const canvas = document.getElementById('starfield');

const ctx = canvas.getContext('2d');

let stars = \[];

let shooting = null;



function resizeCanvas(){

&#x20; const stage = document.getElementById('stage');

&#x20; const rect = stage.getBoundingClientRect();

&#x20; canvas.width = rect.width \* devicePixelRatio;

&#x20; canvas.height = rect.height \* devicePixelRatio;

&#x20; canvas.style.width = rect.width+'px';

&#x20; canvas.style.height = rect.height+'px';

&#x20; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);

&#x20; initStars(rect.width, rect.height);

}

function initStars(w,h){

&#x20; stars = \[];

&#x20; const n = Math.floor((w\*h)/2600);

&#x20; for(let i=0;i<n;i++){

&#x20;   stars.push({

&#x20;     x: Math.random()\*w, y: Math.random()\*h\*0.75,

&#x20;     r: Math.random()\*1.3+0.3,

&#x20;     base: Math.random()\*0.5+0.4,

&#x20;     speed: Math.random()\*0.02+0.006,

&#x20;     phase: Math.random()\*Math.PI\*2

&#x20;   });

&#x20; }

}

let t0 = performance.now();

function drawSky(){

&#x20; const w = canvas.width/devicePixelRatio, h = canvas.height/devicePixelRatio;

&#x20; const grad = ctx.createLinearGradient(0,0,0,h);

&#x20; grad.addColorStop(0, PAL.navyBlack);

&#x20; grad.addColorStop(0.55, PAL.navyDeep);

&#x20; grad.addColorStop(1, PAL.navyMid);

&#x20; ctx.fillStyle = grad;

&#x20; ctx.fillRect(0,0,w,h);



&#x20; // galaxy band

&#x20; ctx.save();

&#x20; ctx.globalAlpha = 0.16;

&#x20; const bandGrad = ctx.createLinearGradient(0,0,w,h\*0.6);

&#x20; bandGrad.addColorStop(0,'rgba(180,150,255,0)');

&#x20; bandGrad.addColorStop(0.5,'rgba(200,170,255,0.5)');

&#x20; bandGrad.addColorStop(1,'rgba(180,150,255,0)');

&#x20; ctx.fillStyle = bandGrad;

&#x20; ctx.translate(w\*0.3,0);

&#x20; ctx.rotate(0.5);

&#x20; ctx.fillRect(-w,0,w\*2,h\*0.35);

&#x20; ctx.restore();



&#x20; // moon

&#x20; const mx = w\*0.78, my = h\*0.22, mr = Math.min(w,h)\*0.05;

&#x20; ctx.save();

&#x20; ctx.shadowColor = 'rgba(245,240,230,0.55)';

&#x20; ctx.shadowBlur = 24;

&#x20; ctx.fillStyle = '#F1EFE6';

&#x20; ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI\*2); ctx.fill();

&#x20; ctx.shadowBlur = 0;

&#x20; ctx.fillStyle = PAL.navyDeep;

&#x20; ctx.beginPath(); ctx.arc(mx+mr\*0.38,my-mr\*0.12,mr\*0.86,0,Math.PI\*2); ctx.fill();

&#x20; ctx.restore();



&#x20; const now = performance.now();

&#x20; const dt = (now-t0)/1000;

&#x20; stars.forEach(s=>{

&#x20;   const tw = s.base + Math.sin(dt\*s.speed\*60 + s.phase)\*0.35;

&#x20;   ctx.globalAlpha = Math.max(0.15, Math.min(1, tw));

&#x20;   ctx.fillStyle = PAL.star;

&#x20;   ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI\*2); ctx.fill();

&#x20; });

&#x20; ctx.globalAlpha = 1;



&#x20; // occasional shooting star

&#x20; if(!shooting \&\& Math.random()<0.0025){

&#x20;   shooting = { x: Math.random()\*w\*0.5+w\*0.2, y: Math.random()\*h\*0.2, vx: 6+Math.random()\*3, vy: 2.4+Math.random(), life:0 };

&#x20; }

&#x20; if(shooting){

&#x20;   shooting.x += shooting.vx; shooting.y += shooting.vy; shooting.life+=1;

&#x20;   ctx.save();

&#x20;   ctx.strokeStyle = 'rgba(245,240,230,0.9)';

&#x20;   ctx.lineWidth = 1.4;

&#x20;   ctx.beginPath();

&#x20;   ctx.moveTo(shooting.x, shooting.y);

&#x20;   ctx.lineTo(shooting.x-shooting.vx\*7, shooting.y-shooting.vy\*7);

&#x20;   ctx.stroke();

&#x20;   ctx.restore();

&#x20;   if(shooting.life>40 || shooting.x>w+50) shooting=null;

&#x20; }



&#x20; requestAnimationFrame(drawSky);

}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

requestAnimationFrame(drawSky);



/\* ============================================================

&#x20;  HINT LABELS (subtle) — appended after scene build so they sit on top

============================================================ \*/

function addHint(objName, w,d,z, text){

&#x20; const node = svg.querySelector(`\[data-obj="${objName}"]`);

&#x20; if(!node) return;

&#x20; const \[x,y] = proj(w,d,z);

&#x20; const g = el('g', {class:'hint-label'});

&#x20; const rect = el('rect', {x:x-38, y:y-24, width:76, height:18, rx:9, fill:'rgba(5,7,15,0.75)', stroke:'rgba(255,179,71,0.4)'});

&#x20; const txt = el('text', {x:x, y:y-11, 'text-anchor':'middle', 'font-size':'9', fill:'#FFD180', 'font-family':'var(--font-display)'});

&#x20; txt.textContent = text;

&#x20; g.appendChild(rect); g.appendChild(txt);

&#x20; node.appendChild(g);

}

addHint('bookcase', 2.1,0.3,4.3, 'READ');

addHint('monitor', 0.4,5.7,1.85, 'VIEW WORK');

addHint('telescope', 0.5,2.6,4.3, 'STARGAZE');

addHint('relax', 3.4,1.9,1.6, 'RELAX');



/\* tag all interactive groups with glow-target on children for hover filter \*/

svg.querySelectorAll('.interactive').forEach(g=>{

&#x20; g.classList.add('glow-target');

});



/\* ============================================================

&#x20;  MODALS

============================================================ \*/

const modals = {

&#x20; monitor: document.getElementById('modal-monitor'),

&#x20; telescope: document.getElementById('modal-telescope'),

&#x20; bookcase: document.getElementById('modal-bookcase'),

&#x20; relax: document.getElementById('modal-relax'),

&#x20; info: document.getElementById('modal-info')

};

function openModal(name){

&#x20; const m = modals\[name];

&#x20; if(!m) return;

&#x20; Object.values(modals).forEach(x=>x.classList.remove('open'));

&#x20; m.classList.add('open');

}

function closeAll(){ Object.values(modals).forEach(x=>x.classList.remove('open')); }



svg.querySelectorAll('.interactive').forEach(g=>{

&#x20; g.addEventListener('click', (e)=>{

&#x20;   e.stopPropagation();

&#x20;   const name = g.getAttribute('data-obj');

&#x20;   openModal(name);

&#x20; });

});

document.querySelectorAll('\[data-close]').forEach(b=> b.addEventListener('click', closeAll));

document.querySelectorAll('.modal-overlay').forEach(ov=>{

&#x20; ov.addEventListener('click', (e)=>{ if(e.target===ov) closeAll(); });

});

document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeAll(); });



/\* sky facts \*/

document.querySelectorAll('.sky-chip').forEach(chip=>{

&#x20; chip.addEventListener('click', ()=>{

&#x20;   document.getElementById('sky-fact-text').textContent = chip.getAttribute('data-fact');

&#x20; });

});



/\* ============================================================

&#x20;  DOCK CONTROLS

============================================================ \*/

// Info

document.getElementById('btn-info').addEventListener('click', ()=> openModal('info'));



// Lights toggle

let lightsOn = true;

const appEl = document.getElementById('app');

document.getElementById('btn-lights').addEventListener('click', function(){

&#x20; lightsOn = !lightsOn;

&#x20; appEl.classList.toggle('dim-mode', !lightsOn);

&#x20; this.classList.toggle('active', !lightsOn);

});



// Audio toggle — synthesized ambient pad + soft noise, no external files

let audioCtx = null, audioNodes = null, audioPlaying = false;

function startAmbient(){

&#x20; if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();

&#x20; const ctxA = audioCtx;

&#x20; const master = ctxA.createGain(); master.gain.value = 0.0;

&#x20; master.connect(ctxA.destination);

&#x20; master.gain.linearRampToValueAtTime(0.12, ctxA.currentTime+1.2);



&#x20; const osc1 = ctxA.createOscillator(); osc1.type='sine'; osc1.frequency.value=110;

&#x20; const osc2 = ctxA.createOscillator(); osc2.type='sine'; osc2.frequency.value=164.8;

&#x20; const lfo = ctxA.createOscillator(); lfo.type='sine'; lfo.frequency.value=0.08;

&#x20; const lfoGain = ctxA.createGain(); lfoGain.gain.value=6;

&#x20; lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);



&#x20; const filt = ctxA.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=800;

&#x20; osc1.connect(filt); osc2.connect(filt); filt.connect(master);



&#x20; // soft noise layer

&#x20; const bufSize = 2\*ctxA.sampleRate;

&#x20; const buf = ctxA.createBuffer(1, bufSize, ctxA.sampleRate);

&#x20; const data = buf.getChannelData(0);

&#x20; for(let i=0;i<bufSize;i++) data\[i] = (Math.random()\*2-1)\*0.15;

&#x20; const noise = ctxA.createBufferSource(); noise.buffer = buf; noise.loop = true;

&#x20; const noiseFilt = ctxA.createBiquadFilter(); noiseFilt.type='lowpass'; noiseFilt.frequency.value=500;

&#x20; const noiseGain = ctxA.createGain(); noiseGain.gain.value=0.5;

&#x20; noise.connect(noiseFilt); noiseFilt.connect(noiseGain); noiseGain.connect(master);



&#x20; osc1.start(); osc2.start(); lfo.start(); noise.start();

&#x20; audioNodes = {master, osc1, osc2, lfo, noise};

}

function stopAmbient(){

&#x20; if(!audioNodes) return;

&#x20; const now = audioCtx.currentTime;

&#x20; audioNodes.master.gain.linearRampToValueAtTime(0, now+0.6);

&#x20; setTimeout(()=>{

&#x20;   try{

&#x20;     audioNodes.osc1.stop(); audioNodes.osc2.stop(); audioNodes.lfo.stop(); audioNodes.noise.stop();

&#x20;   }catch(e){}

&#x20;   audioNodes = null;

&#x20; }, 650);

}

function toggleAudio(){

&#x20; audioPlaying = !audioPlaying;

&#x20; if(audioPlaying) startAmbient(); else stopAmbient();

&#x20; document.getElementById('btn-audio').classList.toggle('active', audioPlaying);

&#x20; const orb = document.getElementById('relax-orb');

&#x20; if(orb) orb.classList.toggle('playing', audioPlaying);

&#x20; const relaxBtn = document.getElementById('relax-toggle');

&#x20; if(relaxBtn) relaxBtn.textContent = audioPlaying ? 'Pause ambient' : 'Play ambient';

}

document.getElementById('btn-audio').addEventListener('click', toggleAudio);

document.getElementById('relax-toggle').addEventListener('click', toggleAudio);



/\* ============================================================

&#x20;  PAN \& ZOOM

============================================================ \*/

const sceneT = document.getElementById('scene-transform');

const stageEl = document.getElementById('stage');

let scale=1, panX=0, panY=0, dragging=false, lastX=0, lastY=0;

function applyTransform(withTransition){

&#x20; sceneT.classList.toggle('panning', !withTransition);

&#x20; sceneT.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;

}

stageEl.addEventListener('wheel', (e)=>{

&#x20; e.preventDefault();

&#x20; const delta = e.deltaY>0 ? -0.06 : 0.06;

&#x20; scale = Math.min(1.8, Math.max(0.7, scale+delta));

&#x20; applyTransform(false);

}, {passive:false});

stageEl.addEventListener('pointerdown', (e)=>{

&#x20; dragging=true; lastX=e.clientX; lastY=e.clientY; stageEl.classList.add('dragging');

});

window.addEventListener('pointermove', (e)=>{

&#x20; if(!dragging) return;

&#x20; panX += (e.clientX-lastX); panY += (e.clientY-lastY);

&#x20; lastX=e.clientX; lastY=e.clientY;

&#x20; applyTransform(false);

});

window.addEventListener('pointerup', ()=>{ dragging=false; stageEl.classList.remove('dragging'); });

document.getElementById('btn-reset').addEventListener('click', ()=>{

&#x20; scale=1; panX=0; panY=0; applyTransform(true);

});



})();

</script>

</body>

</html>

