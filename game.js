'use strict';
/* Nine Peaks: Clan of the Lantern — an original browser ninja clan battler. */

// ---------- Data ----------
const ELEMENTS = {
  ember: { name: 'Ember', color: '#ff7a45' },
  tide:  { name: 'Tide',  color: '#4fb3ff' },
  gale:  { name: 'Gale',  color: '#8fe36b' },
  stone: { name: 'Stone', color: '#d1a56b' },
};
const BEATS = { ember: 'gale', gale: 'stone', stone: 'tide', tide: 'ember' };

const TRAITS = {
  swift:    { name: 'Swift',    desc: 'Attacks 12% faster' },
  brutal:   { name: 'Brutal',   desc: '+10% attack' },
  stalwart: { name: 'Stalwart', desc: '+15% health' },
  keen:     { name: 'Keen',     desc: '+8% critical chance' },
  lucky:    { name: 'Lucky',    desc: '+10% dodge' },
};

// kind: blade | heavy | staff | ranged | chain.  fx: bleed | stun | leech
const WEAPONS = [
  { id: 'bamboo',   name: 'Bamboo Practice Blade', kind: 'blade',  atk: 2,  price: 40,   req: 1 },
  { id: 'kunai',    name: 'Rusty Kunai',           kind: 'ranged', atk: 3,  price: 90,   req: 1 },
  { id: 'kama',     name: "Farmer's Kama",         kind: 'blade',  atk: 5,  price: 180,  req: 2, fx: 'bleed' },
  { id: 'bo',       name: 'Oak Bo Staff',          kind: 'staff',  atk: 6,  price: 260,  req: 2, fx: 'stun' },
  { id: 'tanto',    name: 'Twin Tanto',            kind: 'blade',  atk: 6,  price: 420,  req: 3, spd: 0.8 },
  { id: 'kusari',   name: 'Iron Sickle-and-Chain', kind: 'chain',  atk: 9,  price: 650,  req: 3, fx: 'bleed' },
  { id: 'shuriken', name: 'Shuriken Pouch',        kind: 'ranged', atk: 8,  price: 800,  req: 4 },
  { id: 'wolf',     name: 'Wolf-Tooth Katana',     kind: 'blade',  atk: 13, price: 1200, req: 4, crit: 0.1 },
  { id: 'tetsubo',  name: 'Stone Tetsubo',         kind: 'heavy',  atk: 20, price: 1700, req: 5, spd: 1.35, fx: 'stun' },
  { id: 'naginata', name: 'Tidewater Naginata',    kind: 'staff',  atk: 17, price: 2300, req: 6 },
  { id: 'fans',     name: 'Cinder War-Fans',       kind: 'blade',  atk: 15, price: 3000, req: 7, spd: 0.75, fx: 'bleed' },
  { id: 'bow',      name: 'Stormcaller Bow',       kind: 'ranged', atk: 22, price: 4000, req: 8 },
  { id: 'moon',     name: 'Moonshadow Katana',     kind: 'blade',  atk: 28, price: 5500, req: 9, crit: 0.12, fx: 'leech' },
  { id: 'oni',      name: 'Oni Crusher',           kind: 'heavy',  atk: 40, price: 7500, req: 10, spd: 1.35, fx: 'stun' },
  { id: 'dragon',   name: 'Dragonspine Chain',     kind: 'chain',  atk: 34, price: 9500, req: 10, fx: 'bleed' },
  { id: 'dawn',     name: 'Dawnbreaker',           kind: 'blade',  atk: 48, jade: 12,   req: 8, crit: 0.15, fx: 'leech' },
];
const WMAP = Object.fromEntries(WEAPONS.map(w => [w.id, w]));
const FX_DESC = { bleed: 'may cause bleeding', stun: 'may stun', leech: 'heals on hit' };

const RELICS = [
  { id: 'bell',   name: 'Bronze Temple Bell',  desc: 'Clan health +12%',        jade: 4 },
  { id: 'fang',   name: 'Fang of the Old Wolf', desc: 'Clan attack +10%',       jade: 5 },
  { id: 'coin',   name: 'Lucky Merchant Coin', desc: 'Gold from battles +20%',  jade: 3 },
  { id: 'scroll', name: 'Scroll of Hundred Forms', desc: 'Ninja XP +20%',       jade: 3 },
  { id: 'eye',    name: 'Hawk-Eye Charm',      desc: 'Clan critical chance +6%', jade: 5 },
  { id: 'feather', name: 'Tengu Feather',      desc: 'Clan attacks 8% faster',  jade: 6 },
];

const NAMES = ['Aki', 'Benjiro', 'Chiyo', 'Daichi', 'Emi', 'Fumio', 'Gen', 'Hana', 'Isamu', 'Jun', 'Kaede',
  'Masaru', 'Nao', 'Orin', 'Ren', 'Sora', 'Tatsu', 'Ume', 'Yori', 'Zenko', 'Hotaru', 'Kiri', 'Shin', 'Mika',
  'Rokuro', 'Suzu', 'Tomo', 'Yuki', 'Ibuki', 'Kohaku'];
const CLAN_A = ['Crimson', 'Silent', 'Iron', 'Hidden', 'Pale', 'Thousand', 'Black', 'Laughing', 'Withered', 'Jade'];
const CLAN_B = ['Heron', 'Lotus', 'Mantis', 'Tiger', 'Reed', 'Moth', 'Serpent', 'Crane', 'Thorn', 'Fox'];

const CHAPTERS = [
  { name: 'The Bamboo Road', scene: 'bamboo', hat: 'straw', cloth: '#5a4632',
    foes: ['Road Bandit', 'Cutpurse', 'Toll Thug'],
    boss: { name: 'Gorobei the Toll-King', el: 'stone', weapon: 'bo' },
    intro: 'On the night of the first frost, the Lantern of Dawn — the flame that has guarded the Nine Peaks for a thousand years — vanished from your village shrine. The only trail leads down the Bamboo Road, where bandits now demand tolls in the name of a new master.',
    bossIntro: '"Nobody walks my road for free," rumbles Gorobei, hefting a staff as thick as a tree. "The Hollow Shogun pays me well to keep it shut."',
    outro: 'Gorobei spits out a tooth. "The Lantern? Shipped out through the Drowned Harbor. Take it up with the pirates — if you can swim."' },
  { name: 'The Drowned Harbor', scene: 'harbor', hat: 'bandana', cloth: '#1f4e5f',
    foes: ['Deck Rat', 'Harbor Cutthroat', 'Net-Thrower'],
    boss: { name: 'Madam Riptide', el: 'tide', weapon: 'kusari' },
    intro: 'Half-sunken warehouses lean over black water. The smugglers of the Drowned Harbor answer to one captain, and she does not like questions about her cargo.',
    bossIntro: 'Madam Riptide swings a dripping chain in slow circles. "A lantern that never goes out? I sold it to monks who pay in ash. But you will not live to follow it."',
    outro: 'The pirates scatter. In the captain\'s ledger you find a single line: "One lantern — delivered to the Ashen Monastery."' },
  { name: 'The Ashen Monastery', scene: 'ash', hat: 'monk', cloth: '#6b2f25',
    foes: ['Fallen Acolyte', 'Ash Monk', 'Cinder Warden'],
    boss: { name: 'Abbot Cinder', el: 'ember', weapon: 'fans' },
    intro: 'The monastery burned long ago, yet its monks still pray — to the Shogun now, not to the mountain. Smoke rises from a courtyard where no fire is lit.',
    bossIntro: 'The Abbot opens two fans of glowing iron. "The Lantern\'s flame is wasted on villagers. In the Shogun\'s forge it will burn the whole world clean."',
    outro: 'As the Abbot falls, the smoke clears. Far above, on the Storm Pass, lightning circles the road to the Hollow Keep.' },
  { name: 'The Storm Pass', scene: 'storm', hat: 'mask', cloth: '#3c3f6b',
    foes: ['Sky Scout', 'Storm Archer', 'Masked Windblade'],
    boss: { name: 'Mistress Kazehana', el: 'gale', weapon: 'bow' },
    intro: 'The pass is a knife-edge of rock above the clouds. The masked Sky Clan guards it, and they have never let an outsider cross.',
    bossIntro: '"You climbed well," says Mistress Kazehana, nocking an arrow that hums like a hornet. "Now let us see how you fall."',
    outro: 'Kazehana lowers her bow. "The Shogun promised us the sky. He lied — there is nothing inside that armor. Go. End it."' },
  { name: 'The Hollow Keep', scene: 'keep', hat: 'helm', cloth: '#2a2a2a',
    foes: ['Hollow Guard', 'Keep Assassin', 'Iron Retainer'],
    boss: { name: 'The Hollow Shogun', el: 'ember', weapon: 'oni' },
    intro: 'The gates of the Hollow Keep stand open, as if expecting you. Deep inside, the stolen Lantern pulses like a heartbeat.',
    bossIntro: 'An empty suit of armor rises from the throne, the Lantern of Dawn burning where its heart should be. "A clan of nobodies," it whispers. "I was a clan once, too."',
    outro: 'The armor collapses into rust. You lift the Lantern of Dawn, and for the first time in a season the sun rises over all Nine Peaks. Your clan\'s name will be sung for a thousand years — but rival clans still test your blade in the Skirmish grounds.' },
];
const STAGE_NAMES = ['Outskirts', 'Ambush', 'Stronghold'];
const STAGE_COUNT = [[1, 2, 2, 1], [2, 3, 3, 2], [3, 3, 4, 2], [4, 4, 5, 3], [5, 5, 6, 4]];
const ROSTER_CAP = lvl => lvl >= 7 ? 6 : lvl >= 5 ? 5 : lvl >= 3 ? 4 : lvl >= 2 ? 3 : 2;
const MAX_STAM = 12, REGEN = 40000, MAX_LVL = 40;

// ---------- Helpers ----------
const $ = s => document.querySelector(s);
const rnd = (a, b) => a + Math.random() * (b - a);
const rint = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const xpNeed = l => Math.round(25 + 14 * Math.pow(l, 1.5));
const honorNeed = l => Math.round(50 * Math.pow(l, 1.4));

// ---------- State ----------
const SAVE_KEY = 'ninepeaks-save-v1';
let S = null, tab = 'village', skirmish = null;

function newState() {
  return { name: '', gold: 60, jade: 0, honor: 0, clvl: 1, ninjas: [], inv: {}, relics: [],
    progress: 0, stamina: MAX_STAM, stamTs: Date.now(), tavern: [], wins: 0, losses: 0, nextId: 1 };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }
function load() {
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (d && d.ninjas) return Object.assign(newState(), d); } catch (e) { /* ignore */ }
  return newState();
}
function mkNinja(lvl, el) {
  return { id: S.nextId++, name: pick(NAMES), el: el || pick(Object.keys(ELEMENTS)), lvl, xp: 0,
    trait: pick(Object.keys(TRAITS)), weapon: null };
}
const hasRelic = id => S.relics.includes(id);
const avgLvl = () => Math.max(1, Math.round(S.ninjas.reduce((a, n) => a + n.lvl, 0) / S.ninjas.length));

function tickStamina() {
  const now = Date.now();
  while (S.stamina < MAX_STAM && now - S.stamTs >= REGEN) { S.stamina++; S.stamTs += REGEN; }
  if (S.stamina >= MAX_STAM) S.stamTs = now;
}

// Combat stats for a fighter definition; `mine` applies clan relics.
function statsOf(d, mine) {
  const w = WMAP[d.weapon] || {};
  let hp = 70 + 18 * d.lvl, atk = 9 + 3 * d.lvl + (w.atk || 0), cd = 1.1 * (w.spd || 1);
  let crit = 0.05 + (w.crit || 0), dodge = 0.02;
  if (d.trait === 'stalwart') hp *= 1.15;
  if (d.trait === 'brutal') atk *= 1.1;
  if (d.trait === 'swift') cd /= 1.12;
  if (d.trait === 'keen') crit += 0.08;
  if (d.trait === 'lucky') dodge += 0.1;
  if (mine) {
    if (hasRelic('bell')) hp *= 1.12;
    if (hasRelic('fang')) atk *= 1.1;
    if (hasRelic('eye')) crit += 0.06;
    if (hasRelic('feather')) cd /= 1.08;
  } else {
    hp *= d.boss ? 2.8 : 0.9;
    if (d.boss) atk *= 1.3;
  }
  return { hp: Math.round(hp), atk: Math.round(atk), cd, crit, dodge, kind: w.kind || 'none', fx: w.fx };
}

// ---------- Drawing ----------
const OUT = '#0c0a10';
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = v => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return `rgb(${f(n >> 16)},${f(n >> 8 & 255)},${f(n & 255)})`;
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function seeded(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Feet at (x, y); drawn facing right unless o.face === -1.
function drawNinja(ctx, x, y, o) {
  const s = o.s || 1, el = ELEMENTS[o.el].color, cloth = o.cloth || '#27315a', dark = shade(cloth, -0.4), t = o.t || 0;
  const fs = () => { ctx.fill(); ctx.stroke(); };
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.38)';
  ctx.beginPath(); ctx.ellipse(0, 0, 21 * s, 5.5 * s, 0, 0, 7); ctx.fill();
  ctx.scale((o.face || 1) * s, s);
  if (o.dead) { ctx.globalAlpha = 0.5; ctx.translate(-16, -9); ctx.rotate(-Math.PI / 2); }
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 1.6; ctx.strokeStyle = OUT;
  const bob = o.bob || 0, run = o.run ? Math.sin(o.run) : 0, wave = Math.sin(t * 6);
  if (o.boss) {
    ctx.fillStyle = '#7a1420';
    ctx.beginPath(); ctx.moveTo(-9, -40 + bob); ctx.quadraticCurveTo(-32 - 4 * wave, -22, -24, -2); ctx.lineTo(-4, -8); ctx.closePath(); fs();
  }
  for (const [lx, ph] of [[-8, run], [2, -run]]) {
    ctx.fillStyle = dark; rr(ctx, lx + ph * 5, -15, 7, 13, 2); fs();
    ctx.fillStyle = OUT; rr(ctx, lx + ph * 5 - 1, -4, 10, 5, 2); ctx.fill();
  }
  ctx.translate(0, bob);
  ctx.fillStyle = dark; rr(ctx, -15, -37, 7, 15, 3); fs();
  // scarf tails
  ctx.strokeStyle = el; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(-10, -41); ctx.quadraticCurveTo(-22, -43 + 3 * wave, -30, -35 + 4 * wave); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-10, -39); ctx.quadraticCurveTo(-20, -36 - 2 * wave, -26, -27 - 3 * wave); ctx.stroke();
  ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
  // torso
  const g = ctx.createLinearGradient(-11, 0, 11, 0);
  g.addColorStop(0, shade(cloth, -0.25)); g.addColorStop(0.6, shade(cloth, 0.12)); g.addColorStop(1, cloth);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-11, -39); ctx.lineTo(12, -39); ctx.lineTo(10, -13); ctx.lineTo(-9, -13); ctx.closePath(); fs();
  ctx.strokeStyle = shade(cloth, 0.35); ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(-4, -38); ctx.lineTo(2, -27); ctx.lineTo(8, -38); ctx.stroke();
  ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
  ctx.fillStyle = el; rr(ctx, -10, -22, 20, 5, 1.5); fs(); rr(ctx, 3, -23, 5, 8, 1.5); fs();
  if (o.hat === 'monk') {
    ctx.fillStyle = '#8a5a2b';
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-6 + i * 3.2, -36 + Math.sin(i / 5 * Math.PI) * 4, 1.8, 0, 7); ctx.fill(); }
  }
  // head
  const skin = o.boss ? '#cfc8be' : '#f0c9a0';
  ctx.fillStyle = o.hat === 'monk' ? skin : shade(cloth, 0.05);
  ctx.beginPath(); ctx.arc(1, -52, 15, 0, 7); fs();
  if (o.hat === 'mask') {
    ctx.fillStyle = '#c0281e'; ctx.beginPath(); ctx.ellipse(5, -51, 11, 9, 0, 0, 7); fs();
    rr(ctx, 12, -51, 13, 4.5, 2); fs();
    ctx.fillStyle = '#ffe26a'; ctx.beginPath(); ctx.ellipse(3, -54, 2.4, 1.8, 0.3, 0, 7); ctx.ellipse(10, -54, 2.4, 1.8, 0.3, 0, 7); ctx.fill();
  } else {
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(5, -52, 10.5, 6.5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = o.boss ? '#ff3b2f' : '#fff';
    if (o.boss) { ctx.shadowColor = '#ff3b2f'; ctx.shadowBlur = 8; }
    ctx.beginPath(); ctx.ellipse(3, -52, 2.6, 3, 0, 0, 7); ctx.ellipse(10.5, -52, 2.6, 3, 0, 0, 7); ctx.fill();
    ctx.shadowBlur = 0;
    if (!o.boss) { ctx.fillStyle = '#16121c'; ctx.beginPath(); ctx.arc(3.9, -51.6, 1.5, 0, 7); ctx.arc(11.4, -51.6, 1.5, 0, 7); ctx.fill(); }
    ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(-0.5, -57); ctx.lineTo(5.5, -55); ctx.moveTo(14, -57); ctx.lineTo(8.5, -55); ctx.stroke(); ctx.lineWidth = 1.6;
    if (o.hat !== 'monk') { ctx.fillStyle = shade(cloth, 0.05); ctx.beginPath(); ctx.moveTo(-8, -48.5); ctx.lineTo(16, -48.5); ctx.arc(1, -52, 15, 0.24, 2.6); ctx.closePath(); ctx.fill(); }
  }
  ctx.fillStyle = el; rr(ctx, -14, -62, 29, 5, 2); fs();
  if (o.hat === 'straw') {
    ctx.fillStyle = '#d8b86a'; ctx.beginPath(); ctx.moveTo(-22, -60); ctx.lineTo(1, -80); ctx.lineTo(24, -60); ctx.closePath(); fs();
    ctx.strokeStyle = '#a58a44'; ctx.beginPath(); ctx.moveTo(-10, -68); ctx.lineTo(12, -68); ctx.moveTo(1, -80); ctx.lineTo(-8, -60); ctx.moveTo(1, -80); ctx.lineTo(10, -60); ctx.stroke(); ctx.strokeStyle = OUT;
  } else if (o.hat === 'bandana') {
    ctx.fillStyle = '#b3202a'; ctx.beginPath(); ctx.arc(1, -54, 15.5, Math.PI, 0); ctx.closePath(); fs();
    ctx.fillStyle = '#fff'; for (const [dx, dy] of [[-6, -62], [2, -65], [9, -61]]) { ctx.beginPath(); ctx.arc(dx, dy, 1.3, 0, 7); ctx.fill(); }
  } else if (o.hat === 'helm' || o.boss) {
    ctx.fillStyle = '#2b2b36'; ctx.beginPath(); ctx.arc(1, -56, 16.5, Math.PI, 0); ctx.lineTo(21, -52); ctx.lineTo(-19, -52); ctx.closePath(); fs();
    ctx.strokeStyle = '#e2b44c'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(1, -78, 13, 0.25, Math.PI - 0.25); ctx.stroke();
    ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
  }
  // front arm + weapon
  ctx.translate(8, -33);
  ctx.rotate(o.swing == null ? 0.25 : o.swing);
  ctx.fillStyle = cloth; rr(ctx, -2, -3.5, 14, 7, 3); fs();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(13, 0, 3.2, 0, 7); fs();
  ctx.translate(13, 0);
  drawWeapon(ctx, o.kind);
  ctx.restore();
  if (o.flash > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(0.55, o.flash * 4); ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(x, y - 34 * s, 20 * s, 34 * s, 0, 0, 7); ctx.fill(); ctx.restore();
  }
}
// Drawn from the hand at (0,0), pointing up.
function drawWeapon(ctx, kind) {
  ctx.lineCap = 'round';
  const line = (x1, y1, x2, y2, c, w) => {
    ctx.strokeStyle = OUT; ctx.lineWidth = w + 2.4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };
  if (kind === 'blade') {
    line(0, 5, 0, -5, '#5a3a22', 3.5); line(0, -9, 0, -38, '#eef3f8', 3.2); line(-5, -7, 5, -7, '#e2b44c', 3);
    ctx.strokeStyle = '#9fb2c4'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(1, -10); ctx.lineTo(1, -36); ctx.stroke();
  } else if (kind === 'heavy') {
    line(0, 8, 0, -16, '#5a3a22', 4); line(0, -19, 0, -38, '#3d3d48', 11);
    ctx.fillStyle = '#c9ccd4'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-5.5, -22 - i * 6, 1.6, 0, 7); ctx.arc(5.5, -25 - i * 6, 1.6, 0, 7); ctx.fill(); }
  } else if (kind === 'staff') {
    line(0, 24, 0, -34, '#8a6238', 3.6); line(0, -36, 0, -46, '#eef3f8', 4); line(0, -34, 0, -31, '#c8402f', 5);
  } else if (kind === 'ranged') {
    ctx.save(); ctx.translate(2, -8); drawShuriken(ctx, 9); ctx.restore();
  } else if (kind === 'chain') {
    line(0, 6, 0, -16, '#5a3a22', 3.6);
    ctx.strokeStyle = OUT; ctx.lineWidth = 5.4; ctx.beginPath(); ctx.arc(10, -16, 10, Math.PI, Math.PI * 1.85); ctx.stroke();
    ctx.strokeStyle = '#eef3f8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(10, -16, 10, Math.PI, Math.PI * 1.85); ctx.stroke();
    ctx.strokeStyle = '#9aa0ad'; ctx.lineWidth = 1.8; ctx.setLineDash([2.5, 2.5]);
    ctx.beginPath(); ctx.moveTo(0, 6); ctx.quadraticCurveTo(-12, 18, -5, 28); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#6a6f7c'; ctx.beginPath(); ctx.arc(-5, 29, 3, 0, 7); ctx.fill();
  }
  ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
}
function drawShuriken(ctx, r) {
  ctx.fillStyle = '#e6ebf2'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, q = i % 2 ? r * 0.35 : r; ctx.lineTo(Math.cos(a) * q, Math.sin(a) * q); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(0, 0, r * 0.15, 0, 7); ctx.fill();
}

const SS = 1.5; // supersampling for crisp art on large screens
function mix(a, b, k) {
  const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16);
  const f = s => Math.round((p >> s & 255) * (1 - k) + (q >> s & 255) * k);
  return '#' + ((1 << 24) + (f(16) << 16) + (f(8) << 8) + f(0)).toString(16).slice(1);
}
const SCENES = {
  bamboo: { sky: ['#1560cf', '#3f9ff0', '#c4ebff'], cloud: ['#ffffff', '#8fb0d6'], orb: ['#fffbe0', 735, 60, 26], rock: ['#e2d6b6', '#6f8086'],
    greens: ['#17502a', '#2f9a3c', '#9be04e'], grass: ['#7fdc45', '#2a8a30'], stone: ['#efe9d4', '#b5b39c'], blossom: '#f59ac6', dragon: '#2f9cf5', amb: 'petal' },
  harbor: { sky: ['#243a94', '#e8744f', '#ffd690'], cloud: ['#ffe0b8', '#9a5278'], orb: ['#fff0c0', 450, 178, 34], rock: ['#e0aa86', '#57466a'],
    greens: ['#1b4a3c', '#2f8a52', '#b4d860'], grass: ['#8fc850', '#2f7a44'], stone: ['#e8cfae', '#a08a7c'], blossom: '#ff9a8a', dragon: '#2fc9b6', amb: 'petal', water: true, tint: 'rgba(255,140,70,.10)' },
  ash: { sky: ['#4a2a48', '#d65f38', '#ffc874'], cloud: ['#ffcfa0', '#6e3a48'], orb: ['#ffe2a0', 640, 110, 36], rock: ['#c9a48a', '#4a3a40'],
    greens: ['#6a1a12', '#cf4a1c', '#ffae3c'], grass: ['#c9a83c', '#6a5a22'], stone: ['#d9c4a8', '#8f7c6c'], blossom: '#ff7a2a', amb: 'ember', tint: 'rgba(255,90,30,.08)' },
  storm: { sky: ['#15203f', '#3a5584', '#a4bad2'], cloud: ['#d0dbec', '#34405c'], orb: ['#f0f4ff', 150, 62, 22], rock: ['#a2acbc', '#38425a'],
    greens: ['#12362c', '#226049', '#66a882'], grass: ['#55946f', '#1f4c3a'], stone: ['#b9c0cc', '#6c7486'], blossom: '#c8d8ff', dragon: '#d5dff0', amb: 'rain', lightning: true, tint: 'rgba(30,50,110,.16)' },
  keep: { sky: ['#05030d', '#2a0e2c', '#8f2032'], cloud: ['#8a2c40', '#190b1c'], orb: ['#ff5a4a', 170, 76, 38], rock: ['#74566e', '#191222'],
    greens: ['#360a16', '#8f1a2a', '#ea4a3c'], grass: ['#55305a', '#180e1e'], stone: ['#7a6880', '#3a3046'], blossom: '#ff5a5a', dragon: '#d6322a', amb: 'ember', night: true, tint: 'rgba(60,0,40,.18)' },
  dusk: { sky: ['#35287c', '#d55f9c', '#ffc890'], cloud: ['#ffd6de', '#855696'], orb: ['#fff0c8', 450, 168, 36], rock: ['#dcb0ae', '#584672'],
    greens: ['#8a2a5c', '#e56aa2', '#ffcbe0'], grass: ['#9ccf5a', '#3a7a48'], stone: ['#f0dcd0', '#a8949c'], blossom: '#ff9ac4', dragon: '#f2c23c', amb: 'petal', tint: 'rgba(255,110,150,.08)' },
};
const HORIZON = 205, sceneCache = {};
const ell = (ctx, x, y, rx, ry, rot) => { ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.3, rx), Math.max(0.3, ry), rot || 0, 0, 7); ctx.fill(); };

function cumulus(ctx, R, cx, cy, w, h, light, dark) {
  const blobs = [];
  for (let i = 0; i < 48; i++) {
    const u = R() * 2 - 1, top = Math.sqrt(1 - u * u), r = (0.1 + R() * 0.15) * w * (0.45 + 0.55 * top);
    blobs.push([cx + u * w * 0.5, cy - R() * top * h, r]);
  }
  blobs.sort((a, b) => a[1] - b[1]);
  for (const [x, y, r] of blobs) {
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
    g.addColorStop(0, light); g.addColorStop(0.7, light); g.addColorStop(1, mix(light, dark, 0.45));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
}
function clump(ctx, R, x, y, r, tones) {
  for (let p = 0; p < 3; p++) {
    ctx.fillStyle = tones[p];
    for (let i = 0; i < 7 - p * 2; i++) ell(ctx, x + (R() - 0.5) * r * (2 - p * 0.5) - p * r * 0.15, y + (R() - 0.5) * r * 0.7 - p * r * 0.22, r * (0.55 - p * 0.13), r * (0.42 - p * 0.1));
  }
}
function pine(ctx, R, x, base, h, tones) {
  const lean = (R() - 0.5) * h * 0.6;
  ctx.strokeStyle = mix(tones[0], '#3a2416', 0.7); ctx.lineWidth = Math.max(1.2, h * 0.07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x + lean * 0.1, base - h * 0.55, x + lean, base - h * 0.95); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const k = i / 3, px = x + lean * (0.3 + 0.7 * k) + (R() - 0.5) * h * 0.55 * (1 - k * 0.6), py = base - h * (0.45 + 0.58 * k), rx = h * (0.42 - 0.18 * k) * (0.8 + R() * 0.4), ry = rx * 0.3;
    ctx.fillStyle = tones[0]; ell(ctx, px, py + ry * 0.5, rx, ry);
    ctx.fillStyle = tones[1]; ell(ctx, px, py, rx * 0.95, ry * 0.85);
    ctx.fillStyle = tones[2]; ell(ctx, px - rx * 0.2, py - ry * 0.35, rx * 0.6, ry * 0.42);
  }
}
function pillar(ctx, R, x, base, w, h, P, haze) {
  const hz = c => mix(c, P.sky[2], haze), L = hz(P.rock[0]), D = hz(P.rock[1]), tones = P.greens.map(hz), n = 12, pts = [];
  for (let i = 0; i <= n; i++) pts.push([x - w / 2 * (1 - 0.3 * i / n) + (R() - 0.5) * w * 0.16, base - h * i / n]);
  for (let i = n; i >= 0; i--) pts.push([x + w / 2 * (1 - 0.3 * i / n) + (R() - 0.5) * w * 0.16, base - h * i / n]);
  ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
  const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  g.addColorStop(0, L); g.addColorStop(0.45, mix(L, D, 0.35)); g.addColorStop(1, D);
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip(); ctx.lineCap = 'round';
  for (let i = 0; i < 22; i++) {
    const sx = x + (R() - 0.5) * w, sy = base - R() * h, len = h * (0.08 + R() * 0.2);
    ctx.strokeStyle = R() < 0.6 ? 'rgba(20,24,40,.16)' : 'rgba(255,255,255,.16)'; ctx.lineWidth = 1 + R() * w * 0.03;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + (R() - 0.5) * 6, sy + len); ctx.stroke();
  }
  ctx.restore();
  for (let i = 0; i < 6; i++) {
    const side = R() < 0.5 ? -1 : 1, ly = base - h * (0.12 + R() * 0.75), lx = x + side * w * (0.28 + R() * 0.12);
    if (R() < 0.75) pine(ctx, R, lx + side * w * 0.08, ly, w * (0.3 + R() * 0.25), tones);
    clump(ctx, R, lx, ly, w * 0.17, tones);
  }
  for (let i = 0; i < 3; i++) pine(ctx, R, x + (i - 1) * w * 0.26, base - h + 4, w * (0.4 + R() * 0.3), tones);
  clump(ctx, R, x, base - h + 2, w * 0.3, tones);
}
function canopy(ctx, R, cx, cy, rx, ry, tones, n) {
  for (let p = 0; p < 3; p++) {
    ctx.fillStyle = tones[p];
    for (let i = 0, m = n * [1, 0.9, 0.5][p]; i < m; i++) {
      const a = R() * 6.283, d = Math.sqrt(R()), px = cx + Math.cos(a) * d * rx, py = cy + Math.sin(a) * d * ry;
      if (p === 2 && (py - cy) / ry + (px - cx) / rx * 0.5 > 0.15) continue;
      if (p === 0) ell(ctx, px, py, 8 + R() * 9, 6 + R() * 6); else ell(ctx, px, py, 3.5 + R() * 5, 1.8 + R() * 2.4, R() * 3.14);
    }
  }
}
function roofShape(ctx, cx, y, tw, th, roof, hi) {
  ctx.fillStyle = roof;
  ctx.beginPath(); ctx.moveTo(cx - tw * 0.8, y + th * 0.38); ctx.quadraticCurveTo(cx - tw * 0.5, y + th * 0.3, cx - tw * 0.34, y);
  ctx.lineTo(cx + tw * 0.34, y); ctx.quadraticCurveTo(cx + tw * 0.5, y + th * 0.3, cx + tw * 0.8, y + th * 0.38);
  ctx.lineTo(cx + tw * 0.7, y + th * 0.5); ctx.lineTo(cx - tw * 0.7, y + th * 0.5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = hi; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(cx - tw * 0.8, y + th * 0.38); ctx.quadraticCurveTo(cx - tw * 0.5, y + th * 0.3, cx - tw * 0.34, y); ctx.lineTo(cx + tw * 0.34, y); ctx.quadraticCurveTo(cx + tw * 0.5, y + th * 0.3, cx + tw * 0.8, y + th * 0.38); ctx.stroke();
}
function pavilion(ctx, cx, base, w, tiers, P) {
  const red = P.night ? '#5e161e' : '#c93a2a', roof = P.night ? '#120c18' : '#2b3c60', hi = P.night ? '#4a3050' : '#7f9fd0', th = w * 0.42;
  ctx.fillStyle = P.stone[0]; ctx.fillRect(cx - w * 0.62, base - 5, w * 1.24, 5);
  ctx.fillStyle = P.stone[1]; ctx.fillRect(cx - w * 0.62, base - 1.5, w * 1.24, 1.5);
  for (let i = 0; i < tiers; i++) {
    const tw = w * (1 - i * 0.22), y = base - 5 - (i + 1) * th;
    ctx.fillStyle = red; ctx.fillRect(cx - tw / 2, y + th * 0.42, tw, th * 0.58);
    ctx.fillStyle = P.night ? '#ffb347' : '#4a1512';
    for (let k = 0; k < 3; k++) ctx.fillRect(cx - tw * 0.36 + k * tw * 0.27, y + th * 0.55, tw * 0.18, th * 0.38);
    ctx.fillStyle = mix(red, '#000000', 0.25); ctx.fillRect(cx - tw / 2, y + th * 0.42, tw * 0.07, th * 0.58); ctx.fillRect(cx + tw / 2 - tw * 0.07, y + th * 0.42, tw * 0.07, th * 0.58);
    roofShape(ctx, cx, y, tw, th, roof, hi);
  }
  ctx.fillStyle = '#f2c84b'; ctx.beginPath(); ctx.arc(cx, base - 5 - tiers * th - 3, 2.6, 0, 7); ctx.fill();
}
function gate(ctx, cx, base, w, h, P) {
  const red = P.night ? '#6a1820' : '#d23c2a', dk = mix(red, '#000000', 0.3);
  for (const s of [-1, 1]) { ctx.fillStyle = red; ctx.fillRect(cx + s * w * 0.36 - w * 0.045, base - h, w * 0.09, h); ctx.fillStyle = dk; ctx.fillRect(cx + s * w * 0.36 + w * 0.015, base - h, w * 0.03, h); }
  ctx.fillStyle = red; ctx.fillRect(cx - w * 0.5, base - h * 0.74, w, h * 0.1); ctx.fillRect(cx - w * 0.44, base - h * 0.97, w * 0.88, h * 0.16);
  roofShape(ctx, cx, base - h * 1.3, w * 0.86, h * 0.7, P.night ? '#120c18' : '#2b3c60', P.night ? '#4a3050' : '#7f9fd0');
  ctx.fillStyle = '#f4f0e0'; ctx.beginPath(); ctx.arc(cx, base - h * 0.89, h * 0.055, 0, 7); ctx.fill();
}
function waterfall(ctx, x, y1, y2, w) {
  const g = ctx.createLinearGradient(0, y1, 0, y2); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(220,240,255,.55)');
  ctx.fillStyle = g; ctx.fillRect(x - w / 2, y1, w, y2 - y1);
  ctx.strokeStyle = 'rgba(150,200,240,.6)'; ctx.lineWidth = 0.8;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - w / 2 + i * w / 4, y1); ctx.lineTo(x - w / 2 + i * w / 4, y2); ctx.stroke(); }
  mist(ctx, x, y2, w * 5, 16);
}
function mist(ctx, x, y, rx, ry) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
}

function buildScene(key) {
  if (sceneCache[key]) return sceneCache[key];
  const P = SCENES[key], R = seeded(key.length * 7919 + key.charCodeAt(0) * 31);
  const mk = () => { const c = document.createElement('canvas'); c.width = AW * SS; c.height = AH * SS; const x = c.getContext('2d'); x.scale(SS, SS); return [c, x]; };
  const [back, b] = mk(), [front, f] = mk();
  const blossom = [mix(P.blossom, '#40102a', 0.5), P.blossom, mix(P.blossom, '#ffffff', 0.6)];
  // ----- back: sky, clouds, distant pillars -----
  let g = b.createLinearGradient(0, 0, 0, HORIZON + 20);
  g.addColorStop(0, P.sky[0]); g.addColorStop(0.55, P.sky[1]); g.addColorStop(1, P.sky[2]);
  b.fillStyle = g; b.fillRect(0, 0, AW, AH);
  if (P.night || P.lightning) { b.fillStyle = '#fff'; for (let i = 0; i < 90; i++) { b.globalAlpha = R() * 0.8; b.fillRect(R() * AW, R() * 160, 1.4, 1.4); } b.globalAlpha = 1; }
  const [oc, ox, oy, or] = P.orb;
  g = b.createRadialGradient(ox, oy, or * 0.5, ox, oy, or * 5); g.addColorStop(0, oc); g.addColorStop(0.1, oc + '99'); g.addColorStop(1, oc + '00');
  b.fillStyle = g; b.fillRect(0, 0, AW, HORIZON + 30);
  b.fillStyle = oc; b.beginPath(); b.arc(ox, oy, or, 0, 7); b.fill();
  for (const [cx, cy, w, h] of [[120, 200, 250, 85], [545, 196, 290, 100], [840, 200, 210, 75], [330, 62, 120, 26], [690, 44, 100, 22]]) cumulus(b, R, cx, cy, w, h, P.cloud[0], P.cloud[1]);
  if (P.lightning) {
    b.strokeStyle = 'rgba(245,248,255,.95)'; b.lineWidth = 2.5; b.shadowColor = '#bcd4ff'; b.shadowBlur = 16;
    b.beginPath(); b.moveTo(600, 20); b.lineTo(578, 70); b.lineTo(602, 78); b.lineTo(568, 140); b.lineTo(586, 146); b.lineTo(560, 200); b.stroke(); b.shadowBlur = 0;
  }
  for (const [x, w, h] of [[300, 46, 150], [372, 36, 105], [470, 30, 80], [556, 54, 172], [636, 40, 118]]) pillar(b, R, x, HORIZON + 6, w, h, P, 0.38);
  g = b.createLinearGradient(0, HORIZON - 70, 0, HORIZON + 10); g.addColorStop(0, P.sky[2] + '00'); g.addColorStop(1, P.sky[2] + 'cc');
  b.fillStyle = g; b.fillRect(0, HORIZON - 70, AW, 90);
  // ----- front: near pillars, temples, ground, foliage -----
  pillar(f, R, 215, HORIZON + 16, 84, 245, P, 0.22); pillar(f, R, 695, HORIZON + 16, 92, 262, P, 0.22);
  if (P.water) {
    g = f.createLinearGradient(0, HORIZON - 26, 0, HORIZON + 12); g.addColorStop(0, P.sky[2]); g.addColorStop(1, '#2b5a8a');
    f.fillStyle = g; f.fillRect(250, HORIZON - 26, 420, 40);
    f.fillStyle = 'rgba(255,240,200,.7)'; for (let i = 0; i < 50; i++) f.fillRect(360 + R() * 180, HORIZON - 24 + R() * 34, 6 + R() * 24, 1.4);
    f.fillStyle = '#1a1626';
    f.beginPath(); f.moveTo(505, HORIZON - 14); f.lineTo(640, HORIZON - 14); f.lineTo(626, HORIZON + 4); f.lineTo(522, HORIZON + 4); f.closePath(); f.fill();
    for (const [mx, mh] of [[540, 84], [580, 104], [612, 72]]) {
      f.fillStyle = '#1a1626'; f.fillRect(mx - 1.5, HORIZON - 14 - mh, 3, mh);
      f.fillStyle = '#c23a2c'; f.beginPath(); f.moveTo(mx - 20, HORIZON - mh - 6); f.quadraticCurveTo(mx + 4, HORIZON - mh * 0.6, mx - 20, HORIZON - 28); f.lineTo(mx + 18, HORIZON - 28); f.quadraticCurveTo(mx + 26, HORIZON - mh * 0.6, mx + 18, HORIZON - mh - 6); f.fill();
    }
    pavilion(f, 330, HORIZON + 8, 62, 2, P);
  } else {
    mist(f, 450, HORIZON + 2, 260, 34);
    gate(f, 450, HORIZON + 10, 150, 78, P);
    pavilion(f, 322, HORIZON + 10, 58, 2, P); pavilion(f, 588, HORIZON + 10, 66, 3, P);
  }
  pillar(f, R, 105, HORIZON + 26, 120, 340, P, 0.04); pillar(f, R, 812, HORIZON + 26, 130, 360, P, 0.04);
  waterfall(f, 168, HORIZON - 110, HORIZON + 14, 9); waterfall(f, 748, HORIZON - 140, HORIZON + 14, 11);
  pavilion(f, 118, HORIZON - 96, 46, 2, P); pavilion(f, 800, HORIZON - 122, 50, 2, P);
  g = f.createLinearGradient(0, HORIZON, 0, AH); g.addColorStop(0, P.grass[0]); g.addColorStop(1, P.grass[1]);
  f.fillStyle = g; f.fillRect(0, HORIZON + 10, AW, AH - HORIZON - 10);
  for (let x = -10; x < AW + 20; x += 20) if (x < 385 || x > 515) clump(f, R, x, HORIZON + 10 + R() * 4, 15 + R() * 8, x % 60 < 20 ? blossom : P.greens);
  // stone courtyard where the fight happens
  f.save(); f.beginPath(); f.ellipse(450, 335, 440, 112, 0, 0, 7); f.clip();
  g = f.createLinearGradient(0, 220, 0, AH); g.addColorStop(0, P.stone[0]); g.addColorStop(1, P.stone[1]);
  f.fillStyle = g; f.fillRect(0, 210, AW, 240);
  f.strokeStyle = 'rgba(40,40,60,.22)'; f.lineWidth = 1.3;
  for (let y = 232, k = 0; y < AH; y += 13 + k * 4, k++) {
    f.beginPath(); f.moveTo(0, y); f.lineTo(AW, y); f.stroke();
    for (let i = 0; i < 9; i++) { const x = (i * 110 + (k % 2) * 55 + R() * 20) % AW; f.beginPath(); f.moveTo(x, y); f.lineTo(x + (x - 450) * 0.05, y + 13 + k * 4); f.stroke(); }
  }
  for (let i = 0; i < 60; i++) { f.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.18)' : 'rgba(60,90,60,.14)'; ell(f, R() * AW, 225 + R() * 220, 8 + R() * 22, 2 + R() * 4); }
  f.restore();
  f.fillStyle = P.stone[0]; f.beginPath(); f.moveTo(415, HORIZON + 12); f.lineTo(485, HORIZON + 12); f.lineTo(520, 232); f.lineTo(380, 232); f.fill();
  for (let i = 0; i < 80; i++) { const a = R() * 6.283, x = 450 + Math.cos(a) * 440, y = 335 + Math.sin(a) * 112; if (y > HORIZON + 22 && (x < 380 || x > 520 || y > 300)) clump(f, R, x, y, 7 + R() * 7, P.greens); }
  const flowers = ['#ff5a3a', '#ffd23a', '#ffffff', P.blossom];
  for (let i = 0; i < 520; i++) {
    const x = R() * AW, y = HORIZON + 16 + R() * (AH - HORIZON - 16), dx = (x - 450) / 440, dy = (y - 335) / 112;
    if (dx * dx + dy * dy < 1.02) continue;
    const k = 0.6 + (y - HORIZON) / 180;
    if (R() < 0.8) { f.strokeStyle = mix(P.grass[0], R() < 0.5 ? '#ffffff' : '#0a3a14', R() * 0.4); f.lineWidth = 1.5; for (let q = -1; q <= 1; q++) { f.beginPath(); f.moveTo(x, y); f.quadraticCurveTo(x + q * 2 * k, y - 6 * k, x + q * 5 * k, y - 11 * k); f.stroke(); } }
    else { f.fillStyle = flowers[i % 4]; for (let q = 0; q < 5; q++) ell(f, x + Math.cos(q * 1.26) * 2.4 * k, y + Math.sin(q * 1.26) * 2.4 * k, 1.6 * k, 1.6 * k); f.fillStyle = '#ffe680'; ell(f, x, y, 1.1 * k, 1.1 * k); }
  }
  // framing trees and bushes
  const trunk = (x1, y1, cx, cy, x2, y2, w) => { f.strokeStyle = P.night ? '#150c12' : '#4a3020'; f.lineWidth = w; f.lineCap = 'round'; f.beginPath(); f.moveTo(x1, y1); f.quadraticCurveTo(cx, cy, x2, y2); f.stroke(); f.strokeStyle = 'rgba(255,220,170,.18)'; f.lineWidth = w * 0.25; f.beginPath(); f.moveTo(x1 - w * 0.25, y1); f.quadraticCurveTo(cx - w * 0.25, cy, x2 - w * 0.2, y2); f.stroke(); };
  trunk(-6, 330, 30, 180, 70, 80, 16); trunk(906, 340, 880, 200, 835, 90, 18); trunk(845, 300, 820, 262, 800, 236, 6);
  canopy(f, R, 60, 55, 150, 80, P.greens, 520); canopy(f, R, 845, 62, 160, 90, P.greens, 560);
  canopy(f, R, 800, 226, 62, 30, blossom, 200); canopy(f, R, 26, 250, 50, 28, blossom, 130);
  canopy(f, R, 330, -6, 110, 22, P.greens, 150); canopy(f, R, 610, -8, 100, 20, P.greens, 130);
  canopy(f, R, 30, 430, 90, 34, P.greens, 240); canopy(f, R, 872, 432, 95, 36, P.greens, 250); canopy(f, R, 150, 446, 60, 16, blossom, 90);
  if (!P.night) {
    f.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { const x = 180 + i * 150; g = f.createLinearGradient(x, 0, x - 140, AH); g.addColorStop(0, 'rgba(255,250,220,.13)'); g.addColorStop(1, 'rgba(255,250,220,0)'); f.fillStyle = g; f.beginPath(); f.moveTo(x, 0); f.lineTo(x + 46, 0); f.lineTo(x - 130, AH); f.lineTo(x - 230, AH); f.fill(); }
    f.globalCompositeOperation = 'source-over';
  }
  if (P.tint) { f.fillStyle = P.tint; f.fillRect(0, 0, AW, AH); b.fillStyle = P.tint; b.fillRect(0, 0, AW, AH); }
  g = f.createRadialGradient(AW / 2, AH / 2, 260, AW / 2, AH / 2, 600); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, P.night ? 'rgba(0,0,0,.6)' : 'rgba(0,10,30,.3)');
  f.fillStyle = g; f.fillRect(0, 0, AW, AH);
  return (sceneCache[key] = { back, front });
}

// A sky dragon that weaves between the far peaks.
function drawDragon(ctx, t, col) {
  const N = 180, pts = [], dark = mix(col, '#001040', 0.45), light = mix(col, '#ffffff', 0.55);
  for (let i = 0; i <= N; i++) {
    const a = t * 0.32 - i / N * 4.4;
    pts.push([455 + 235 * Math.cos(a) + 26 * Math.sin(3 * a + t * 0.6), 96 + 58 * Math.sin(a * 1.7) + 16 * Math.cos(2.3 * a + t * 0.4)]);
  }
  const rad = i => { const u = i / N; return 2 + 13 * Math.pow(1 - u, 0.75) * Math.min(1, 0.55 + i / 22); };
  for (let i = N; i >= 1; i--) {
    const [x, y] = pts[i], [px, py] = pts[i - 1], r = rad(i), ang = Math.atan2(py - y, px - x), nx = Math.sin(ang), ny = -Math.cos(ang), up = ny < 0 ? 1 : -1;
    if (i % 5 === 0) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(x + nx * up * r * 0.7 - Math.cos(ang) * r * 0.6, y + ny * up * r * 0.7 - Math.sin(ang) * r * 0.6); ctx.lineTo(x + nx * up * r * 1.9 - Math.cos(ang) * r * 1.4, y + ny * up * r * 1.9 - Math.sin(ang) * r * 1.4); ctx.lineTo(x + nx * up * r * 0.7 + Math.cos(ang) * r * 0.6, y + ny * up * r * 0.7 + Math.sin(ang) * r * 0.6); ctx.fill(); }
    const g = ctx.createRadialGradient(x + nx * up * r * 0.4, y + ny * up * r * 0.4, r * 0.1, x, y, r);
    g.addColorStop(0, light); g.addColorStop(0.5, col); g.addColorStop(1, dark);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    if (i % 4 === 0 && r > 4) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x, y, r * 0.7, ang - 1, ang + 1); ctx.stroke(); }
  }
  for (const i of [38, 96]) { const [x, y] = pts[i], r = rad(i); ctx.strokeStyle = dark; ctx.lineWidth = r * 0.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y + r * 0.5); ctx.lineTo(x + 5, y + r * 1.8); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2; for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x + 5, y + r * 1.8); ctx.lineTo(x + 5 + k * 3.5, y + r * 1.8 + 5); ctx.stroke(); } }
  const [hx, hy] = pts[0], ang = Math.atan2(hy - pts[6][1], hx - pts[6][0]);
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); if (Math.cos(ang) < 0) ctx.scale(1, -1);
  ctx.fillStyle = '#ffffff'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-6, -8 + k * 4); ctx.lineTo(-30 - 5 * Math.sin(t * 5 + k), -16 + k * 8); ctx.lineTo(-4, -3 + k * 4); ctx.fill(); }
  ctx.strokeStyle = '#f4e2a8'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-2, -8); ctx.quadraticCurveTo(-14, -20, -24, -19); ctx.moveTo(2, -8); ctx.quadraticCurveTo(-6, -24, -14, -27); ctx.stroke();
  const g = ctx.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, light); g.addColorStop(0.5, col); g.addColorStop(1, dark);
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-10, -11); ctx.quadraticCurveTo(8, -13, 26, -6); ctx.quadraticCurveTo(31, -1, 27, 4); ctx.quadraticCurveTo(10, 11, -10, 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = light; ctx.beginPath(); ctx.moveTo(4, 5); ctx.quadraticCurveTo(16, 8, 27, 4); ctx.quadraticCurveTo(14, 3, 4, 5); ctx.fill();
  ctx.fillStyle = '#fff'; ell(ctx, 9, -4, 3.6, 2.6); ctx.fillStyle = '#10203a'; ell(ctx, 10, -4, 1.6, 1.8);
  ctx.strokeStyle = light; ctx.lineWidth = 1.3;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(25, s * 2); ctx.bezierCurveTo(44, s * 10 + 6 * Math.sin(t * 3), 52, s * 22, 70, s * 14 + 8 * Math.sin(t * 3 + s)); ctx.stroke(); }
  ctx.restore();
}

function mkAmbient(key) {
  return Array.from({ length: 46 }, () => ({ x: Math.random() * AW, y: Math.random() * AH, v: 0.5 + Math.random(), p: Math.random() * 6 }));
}
function drawAmbient(ctx, list, kind, t, dt, H) {
  for (const a of list) {
    if (kind === 'rain') {
      a.y += 620 * a.v * dt; a.x -= 120 * dt;
      ctx.strokeStyle = 'rgba(200,215,240,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x - 4, a.y + 18); ctx.stroke();
    } else if (kind === 'ember') {
      a.y -= 40 * a.v * dt; a.x += Math.sin(t * 2 + a.p) * 20 * dt;
      ctx.fillStyle = `rgba(255,${130 + a.p * 15 | 0},50,${0.35 + 0.3 * Math.sin(t * 4 + a.p)})`; ctx.beginPath(); ctx.arc(a.x, a.y, 1.6 * a.v + 0.6, 0, 7); ctx.fill();
    } else {
      a.y += 34 * a.v * dt; a.x += (Math.sin(t * 1.5 + a.p) * 30 - 22) * dt;
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(t * 2 * a.v + a.p);
      ctx.fillStyle = kind === 'petal' ? 'rgba(255,190,210,.8)' : 'rgba(170,215,120,.75)';
      ctx.beginPath(); ctx.ellipse(0, 0, 4.5, 2, 0, 0, 7); ctx.fill(); ctx.restore();
    }
    if (a.y > H + 20) { a.y = -10; a.x = Math.random() * AW; }
    if (a.y < -20) { a.y = H + 10; a.x = Math.random() * AW; }
    if (a.x < -20) a.x = AW + 10;
  }
}

let heroAmb = null, heroKey = null;
function paintCanvases() {
  const t = performance.now() / 1000;
  document.querySelectorAll('canvas.portrait').forEach(c => {
    const ctx = c.getContext('2d'), col = ELEMENTS[c.dataset.el].color;
    const g = ctx.createRadialGradient(36, 40, 4, 36, 40, 60);
    g.addColorStop(0, col + '66'); g.addColorStop(1, '#120e0c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, c.width, c.height);
    drawNinja(ctx, 32, 88, { el: c.dataset.el, kind: c.dataset.kind || 'none', s: 1.12 });
  });
  document.querySelectorAll('canvas.wicon').forEach(c => {
    const ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    if (c.dataset.kind === 'ranged') { ctx.translate(24, 24); ctx.rotate(0.4); drawShuriken(ctx, 15); }
    else { ctx.translate(18, 40); ctx.rotate(0.5); ctx.scale(1.05, 1.05); drawWeapon(ctx, c.dataset.kind); }
    ctx.restore();
  });
  const h = document.querySelector('canvas.hero');
  if (h) {
    const ctx = h.getContext('2d'), key = h.dataset.scene;
    if (heroKey !== key) { heroKey = key; heroAmb = mkAmbient(key); }
    const sc = buildScene(key), dr = SCENES[key].dragon;
    ctx.setTransform(SS, 0, 0, SS, 0, 0);
    ctx.drawImage(sc.back, 0, 40 * SS, AW * SS, 240 * SS, 0, 0, AW, 240);
    if (dr) { ctx.save(); ctx.translate(0, -40); drawDragon(ctx, t, dr); ctx.restore(); }
    ctx.drawImage(sc.front, 0, 40 * SS, AW * SS, 240 * SS, 0, 0, AW, 240);
    drawAmbient(ctx, heroAmb, SCENES[key].amb, t, 1 / 30, 240);
    const team = S.name ? S.ninjas : [{ el: 'ember', weapon: 'wolf' }, { el: 'tide', weapon: 'bo' }, { el: 'gale', weapon: 'kunai' }, { el: 'stone', weapon: 'tetsubo' }];
    team.forEach((n, i) => drawNinja(ctx, AW / 2 - (team.length - 1) * 38 + i * 76, 206 + (i % 2) * 14, { el: n.el, kind: (WMAP[n.weapon] || {}).kind || 'none', s: 1.5, t: t + i, bob: Math.sin(t * 3 + i) * 1.5, face: i < team.length / 2 ? 1 : -1 }));
  }
}

// ---------- Battle ----------
const B = { active: false, speed: 1 };
const arena = $('#arena'), actx = arena.getContext('2d');
const AW = 900, AH = 440;
arena.width = AW * 1.5; arena.height = AH * 1.5;

function mkUnit(d, side, i, n) {
  const st = statsOf(d, side === 0);
  const lane = 225 + (i + 0.5) * (195 / n);
  return Object.assign(st, { side, name: d.name, el: d.el, lvl: d.lvl, boss: !!d.boss, cloth: d.cloth,
    maxHp: st.hp, x: side === 0 ? 90 + (i % 2) * 55 : AW - 90 - (i % 2) * 55, y: lane,
    timer: rnd(0.2, 0.8), stun: 0, bleed: 0, bleedDps: 0, anim: 0, flash: 0, target: null,
    hat: d.hat, run: 0,
    range: st.kind === 'ranged' ? 380 : (d.boss ? 92 : 66), scale: d.boss ? 1.9 : 1.3, phase: Math.random() * 6 });
}

function startBattle(opts) {
  B.units = S.ninjas.map((n, i) => mkUnit(n, 0, i, S.ninjas.length))
    .concat(opts.enemies.map((e, i) => mkUnit(e, 1, i, opts.enemies.length)));
  B.texts = []; B.shots = []; B.fx = []; B.shake = 0; B.amb = mkAmbient(opts.scene); B.time = 0; B.done = false; B.opts = opts; B.speed = 1; B.active = true; B.last = 0;
  $('#battle-title').textContent = opts.title;
  $('#battle').classList.remove('hidden');
  markSpeed();
  requestAnimationFrame(frame);
}
function markSpeed() {
  document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('active', b.dataset.speed === String(B.speed)));
}
const alive = side => B.units.filter(u => u.side === side && u.hp > 0);
function say(u, txt, color, big) { B.texts.push({ x: u.x + rnd(-12, 12), y: u.y - 96 * u.scale, txt, color, big, t: 0.9 }); }

function hurt(u, dmg, color, label) {
  u.hp = Math.max(0, u.hp - dmg); u.flash = 0.15;
  say(u, label || String(Math.round(dmg)), color || '#fff', !!label);
  if (u.hp <= 0) for (let i = 0; i < 7; i++) B.fx.push({ type: 'puff', x: u.x, y: u.y - 25 * u.scale, vx: rnd(-40, 40), vy: rnd(-50, 10), t: 0.6, T: 0.6 });
}
function step(dt) {
  B.time += dt;
  for (const u of B.units) {
    u.anim = Math.max(0, u.anim - dt); u.flash = Math.max(0, u.flash - dt);
    if (u.hp <= 0) continue;
    if (u.bleed > 0) { u.bleed -= dt; u.hp = Math.max(0, u.hp - u.bleedDps * dt); if (u.hp <= 0) { say(u, 'bled out', '#ef7a66'); continue; } }
    if (u.stun > 0) { u.stun -= dt; continue; }
    if (!u.target || u.target.hp <= 0) {
      let best = null, bd = 1e9;
      for (const e of B.units) if (e.side !== u.side && e.hp > 0) { const d = Math.hypot(e.x - u.x, (e.y - u.y) * 2); if (d < bd) { bd = d; best = e; } }
      u.target = best;
    }
    const t = u.target; if (!t) continue;
    const dx = t.x - u.x, dy = t.y - u.y, dist = Math.hypot(dx, dy);
    u.timer -= dt;
    if (dist > u.range) { const v = 170 * dt / dist; u.x += dx * v; u.y += dy * v; u.run += dt * 14; continue; }
    u.run = 0;
    if (u.timer > 0) continue;
    u.timer = u.cd * rnd(0.9, 1.1); u.anim = 0.25;
    if (u.kind === 'ranged') B.shots.push({ x1: u.x, y1: u.y - 45, x2: t.x, y2: t.y - 45, t: 0.18, T: 0.18 });
    if (Math.random() < t.dodge) { say(t, 'dodge', '#9fd3ff'); continue; }
    let dmg = u.atk * rnd(0.85, 1.15), color = '#fff', label;
    if (BEATS[u.el] === t.el) dmg *= 1.25; else if (BEATS[t.el] === u.el) dmg *= 0.85;
    if (Math.random() < u.crit) { dmg *= 1.8; color = '#ffd447'; label = Math.round(dmg) + '!'; }
    hurt(t, dmg, color, label);
    const ec = ELEMENTS[u.el].color, hy = t.y - 40 * t.scale;
    B.fx.push({ type: 'slash', x: t.x, y: hy, r: 26 * t.scale, a: rnd(0, 6), color: ec, t: 0.2, T: 0.2 });
    for (let i = 0; i < (label ? 9 : 4); i++) B.fx.push({ type: 'spark', x: t.x, y: hy, vx: rnd(-70, 70), vy: rnd(-90, 20), color: i % 2 ? ec : '#fff', t: 0.35, T: 0.35 });
    if (label) B.shake = 8;
    if (u.fx === 'bleed' && Math.random() < 0.35) { t.bleed = 3; t.bleedDps = u.atk * 0.18; }
    if (u.fx === 'stun' && Math.random() < 0.2) { t.stun = 1; say(t, 'stunned', '#c9a8ff'); }
    if (u.fx === 'leech') u.hp = Math.min(u.maxHp, u.hp + dmg * 0.2);
  }
  // keep fighters from stacking on one spot
  for (let i = 0; i < B.units.length; i++) for (let j = i + 1; j < B.units.length; j++) {
    const p = B.units[i], q = B.units[j];
    if (p.hp <= 0 || q.hp <= 0) continue;
    const need = p.side === q.side ? 50 : 40, dx = q.x - p.x, dy = (q.y - p.y) * 1.8 || 0.01, d = Math.hypot(dx, dy);
    if (d >= need) continue;
    const push = (need - d) * Math.min(1, dt * 8) / 2, ux = d ? dx / d : 0, uy = d ? dy / d : 1;
    p.x -= ux * push; q.x += ux * push; p.y -= uy * push; q.y += uy * push;
  }
  for (const u of B.units) { u.y = Math.max(228, Math.min(AH - 12, u.y)); u.x = Math.max(30, Math.min(AW - 30, u.x)); }
  for (const t of B.texts) { t.t -= dt; t.y -= 30 * dt; }
  B.texts = B.texts.filter(t => t.t > 0);
  for (const s of B.shots) s.t -= dt;
  B.shots = B.shots.filter(s => s.t > 0);
  for (const f of B.fx) f.t -= dt;
  B.fx = B.fx.filter(f => f.t > 0);
  B.shake *= Math.pow(0.002, dt);
  const a = alive(0).length, b = alive(1).length;
  if (!a || !b) { B.done = true; B.win = a > 0; }
  else if (B.time > 150) {
    const frac = side => B.units.filter(u => u.side === side).reduce((s, u) => s + u.hp / u.maxHp, 0) / B.units.filter(u => u.side === side).length;
    B.done = true; B.win = frac(0) > frac(1);
  }
}
function drawBattle() {
  const ctx = actx, sc = SCENES[B.opts.scene];
  ctx.save();
  ctx.setTransform(SS, 0, 0, SS, 0, 0);
  if (B.shake > 0.2) ctx.translate(rnd(-B.shake, B.shake), rnd(-B.shake, B.shake));
  const scn = buildScene(B.opts.scene);
  ctx.drawImage(scn.back, 0, 0, AW, AH);
  if (sc.dragon) drawDragon(ctx, B.time, sc.dragon);
  ctx.drawImage(scn.front, 0, 0, AW, AH);
  for (const u of [...B.units].sort((p, q) => (p.hp > 0) - (q.hp > 0) || p.y - q.y)) {
    const face = u.side === 0 ? 1 : -1, a = u.anim / 0.25;
    const lunge = u.anim > 0 && u.kind !== 'ranged' ? Math.sin(a * Math.PI) * 18 * face : 0;
    drawNinja(ctx, u.x + lunge, u.y, { el: u.el, kind: u.kind, s: u.scale, face, boss: u.boss, cloth: u.cloth, hat: u.hat,
      dead: u.hp <= 0, flash: u.flash, t: B.time + u.phase, run: u.run, bob: u.hp > 0 ? Math.sin(B.time * 5 + u.phase) * 1.5 : 0,
      swing: u.anim > 0 ? -1.3 + (1 - a) * 2.5 : 0.25 });
  }
  drawAmbient(ctx, B.amb, sc.amb, B.time, 1 / 60, AH);
  for (const s of B.shots) {
    const k = 1 - s.t / s.T;
    ctx.save(); ctx.translate(s.x1 + (s.x2 - s.x1) * k, s.y1 + (s.y2 - s.y1) * k - Math.sin(k * Math.PI) * 18); ctx.rotate(B.time * 30); drawShuriken(ctx, 8); ctx.restore();
  }
  for (const f of B.fx) {
    const k = 1 - f.t / f.T;
    if (f.type === 'slash') {
      ctx.strokeStyle = f.color; ctx.lineCap = 'round'; ctx.globalAlpha = 1 - k;
      ctx.lineWidth = 7 * (1 - k) + 1; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.8 + k * 0.5), f.a + k * 2, f.a + k * 2 + 2.2); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5 * (1 - k) + 0.5; ctx.stroke();
    } else if (f.type === 'spark') {
      ctx.globalAlpha = 1 - k; ctx.fillStyle = f.color; ctx.beginPath(); ctx.arc(f.x + f.vx * k, f.y + f.vy * k + 60 * k * k, 2.6 * (1 - k) + 0.8, 0, 7); ctx.fill();
    } else {
      ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = '#d9d2c6'; ctx.beginPath(); ctx.arc(f.x + f.vx * k, f.y + f.vy * k, 8 + 16 * k, 0, 7); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  for (const u of B.units) {
    if (u.hp <= 0) continue;
    const w = 38 * u.scale, top = u.y - 84 * u.scale - (u.hat === 'straw' || u.boss ? 10 : 0);
    ctx.fillStyle = 'rgba(0,0,0,.75)'; rr(ctx, u.x - w / 2 - 2, top - 2, w + 4, 9, 4); ctx.fill();
    const hg = ctx.createLinearGradient(0, top, 0, top + 5);
    if (u.side === 0) { hg.addColorStop(0, '#8df0c0'); hg.addColorStop(1, '#2f9a6c'); } else { hg.addColorStop(0, '#ff8a70'); hg.addColorStop(1, '#b02a1c'); }
    ctx.fillStyle = hg; rr(ctx, u.x - w / 2, top, Math.max(3, w * u.hp / u.maxHp), 5, 2.5); ctx.fill();
    ctx.font = (u.boss ? 'bold 14px' : 'bold 12px') + ' Georgia'; ctx.textAlign = 'center';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3.5; ctx.fillStyle = u.boss ? '#ffd76a' : '#fff';
    const label = (u.boss ? u.name : u.name.split(' ').pop()) + '  Lv ' + u.lvl;
    ctx.strokeText(label, u.x, top - 7); ctx.fillText(label, u.x, top - 7);
    if (u.stun > 0) { ctx.fillStyle = '#d9c2ff'; ctx.font = 'bold 16px Georgia'; ctx.fillText('✦ ✦', u.x, top + 26); }
    if (u.bleed > 0) { ctx.fillStyle = '#ff3b2a'; ctx.beginPath(); ctx.arc(u.x - w / 2 - 8, top + 2.5, 3.5, 0, 7); ctx.fill(); }
  }
  ctx.textAlign = 'center';
  for (const t of B.texts) {
    ctx.font = `bold ${t.big ? 26 : 18}px Georgia`; ctx.globalAlpha = Math.min(1, t.t * 2.5);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.strokeText(t.txt, t.x, t.y); ctx.fillStyle = t.color; ctx.fillText(t.txt, t.x, t.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
function frame(ts) {
  if (!B.active) return;
  const dt = Math.min(0.05, B.last ? (ts - B.last) / 1000 : 0.016); B.last = ts;
  if (!B.done) for (let i = 0; i < B.speed; i++) if (!B.done) step(dt);
  drawBattle();
  if (B.done) { B.active = false; setTimeout(() => B.opts.onEnd(B.win), 500); return; }
  requestAnimationFrame(frame);
}
function skipBattle() {
  let guard = 0;
  while (!B.done && guard++ < 20000) step(0.05);
}
function closeBattle() { $('#battle').classList.add('hidden'); }

// ---------- Rewards ----------
function grant(win, enemies, o) {
  const sum = enemies.reduce((a, e) => a + e.lvl * (e.boss ? 3 : 1), 0), avg = sum / enemies.length;
  let gold = (20 + 12 * sum) * (hasRelic('coin') ? 1.2 : 1) * (o.mult || 1);
  let xp = (12 + 7 * avg) * (hasRelic('scroll') ? 1.2 : 1) * (o.first ? 2.5 : 1) * (o.mult || 1);
  let honor = (20 + 8 * avg) * (o.first ? 2 : 1);
  if (!win) { gold = 0; xp *= 0.3; honor = 0; }
  gold = Math.round(gold); xp = Math.round(xp); honor = Math.round(honor);
  const lines = [];
  if (gold) lines.push(`<span class="gold">+${gold} gold</span>`);
  if (honor) lines.push(`+${honor} honor`);
  lines.push(`+${xp} XP to each ninja`);
  S.gold += gold; S.honor += honor;
  if (win) S.wins++; else S.losses++;
  if (o.jade && win) { S.jade += o.jade; lines.push(`<span class="jade">+${o.jade} jade</span>`); }
  for (const n of S.ninjas) {
    if (n.lvl >= MAX_LVL) continue;
    n.xp += xp;
    let ups = 0;
    while (n.lvl < MAX_LVL && n.xp >= xpNeed(n.lvl)) { n.xp -= xpNeed(n.lvl); n.lvl++; ups++; }
    if (ups) lines.push(`<b>${esc(n.name)}</b> reached level ${n.lvl}!`);
  }
  while (S.honor >= honorNeed(S.clvl)) {
    S.honor -= honorNeed(S.clvl); S.clvl++;
    const unlocked = WEAPONS.filter(w => w.req === S.clvl).map(w => w.name);
    lines.push(`<b class="gold">Clan level ${S.clvl}!</b>` + (ROSTER_CAP(S.clvl) > ROSTER_CAP(S.clvl - 1) ? ' A new roster slot opened.' : '') +
      (unlocked.length ? ' Forge unlocked: ' + unlocked.join(', ') + '.' : ''));
  }
  save();
  return lines;
}

// ---------- Enemy generation ----------
function enemyWeapon(lvl) {
  const i = Math.floor((lvl - 1) * 0.85) - 1;
  return i < 0 ? null : WEAPONS[Math.min(i, WEAPONS.length - 2)].id;
}
function stageEnemies(idx) {
  const c = Math.floor(idx / 4), s = idx % 4, ch = CHAPTERS[c], lvl = 1 + c * 3 + s, out = [];
  if (s === 3) out.push({ name: ch.boss.name, el: ch.boss.el, lvl: lvl + 1, weapon: ch.boss.weapon, boss: true, cloth: '#3a1418', hat: ch.hat });
  for (let i = 0; i < STAGE_COUNT[c][s]; i++) {
    const l = Math.max(1, lvl - (s === 3 ? 1 : i % 2));
    out.push({ name: ch.foes[i % 3], el: pick(Object.keys(ELEMENTS)), lvl: l, weapon: enemyWeapon(l), cloth: ch.cloth, hat: ch.hat });
  }
  return out;
}
function rollSkirmish() {
  const base = avgLvl(), n = S.ninjas.length;
  skirmish = [['Scouting party', -1, -1, 0.8], ['Rival clan', 0, 0, 1], ['Elite warband', 2, 1, 1.5]].map(([kind, dl, dn, mult]) => {
    const count = Math.max(1, Math.min(6, n + dn)), el = Object.keys(ELEMENTS);
    return { kind, mult, clan: `${pick(CLAN_A)} ${pick(CLAN_B)} Clan`,
      team: Array.from({ length: count }, () => { const l = Math.max(1, base + dl + rint(-1, 0)); return { name: pick(NAMES), el: pick(el), lvl: l, weapon: enemyWeapon(l), trait: pick(Object.keys(TRAITS)), cloth: '#5a2230' }; }) };
  });
}

// ---------- Modal ----------
let modalBtns = [];
function modal(html, btns) {
  modalBtns = btns || [{ label: 'Continue' }];
  $('#modal-box').innerHTML = html + '<div class="btns">' + modalBtns.map((b, i) =>
    `<button class="${i === modalBtns.length - 1 ? 'primary' : ''}" data-modal="${i}">${b.label}</button>`).join('') + '</div>';
  $('#modal').classList.remove('hidden');
}
function closeModal() { $('#modal').classList.add('hidden'); }

// ---------- Fights ----------
function useStamina() {
  tickStamina();
  if (S.stamina <= 0) { modal('<h2>Your clan is exhausted</h2><p>Stamina returns over time, or brew a pot of tea in the Dojo.</p>'); return false; }
  if (S.stamina === MAX_STAM) S.stamTs = Date.now();
  S.stamina--; save(); return true;
}
function fightStage(idx) {
  if (idx !== S.progress && idx >= S.progress) return;
  const c = Math.floor(idx / 4), s = idx % 4, ch = CHAPTERS[c], first = idx === S.progress;
  const go = () => {
    if (!useStamina()) return;
    const enemies = stageEnemies(idx);
    startBattle({ title: `${ch.name} — ${s === 3 ? ch.boss.name : STAGE_NAMES[s]}`, scene: ch.scene, enemies, onEnd: win => {
      if (win && first) S.progress++;
      const lines = grant(win, enemies, { first: win && first, jade: win && first ? (s === 3 ? 3 : 1) : 0 });
      const story = win && first && s === 3 ? `<p class="story">${ch.outro}</p>` : '';
      const ending = win && first && idx === 19 ? '<h2>The Lantern is home.</h2>' : '';
      modal(`<h2>${win ? 'Victory!' : 'Defeat'}</h2>${win ? '' : '<p class="dim">Train in the Dojo, visit the Forge, or recruit at the Tavern and try again.</p>'}
        <ul class="clean">${lines.map(l => `<li>${l}</li>`).join('')}</ul>${story}${ending}`,
        [{ label: 'Continue', cb: () => { closeBattle(); render(); } }]);
    } });
  };
  const text = first && s === 0 ? ch.intro : first && s === 3 ? ch.bossIntro : null;
  if (text) modal(`<h2>${ch.name}</h2><p class="story">${text}</p>`, [{ label: 'To battle!', cb: go }]); else go();
}
function fightSkirmish(i) {
  const f = skirmish[i]; if (!f || !useStamina()) return;
  startBattle({ title: `Skirmish — ${f.clan}`, scene: 'dusk', enemies: f.team, onEnd: win => {
    const lines = grant(win, f.team, { mult: f.mult, jade: win && Math.random() < 0.1 * f.mult ? 1 : 0 });
    skirmish = null;
    modal(`<h2>${win ? 'Victory!' : 'Defeat'}</h2><p class="dim">${esc(f.clan)} ${win ? 'retreats in disgrace.' : 'holds the field.'}</p>
      <ul class="clean">${lines.map(l => `<li>${l}</li>`).join('')}</ul>`, [{ label: 'Continue', cb: () => { closeBattle(); render(); } }]);
  } });
}

// ---------- Views ----------
const TABS = [['village', 'Story'], ['skirmish', 'Skirmish'], ['clan', 'Clan'], ['forge', 'Forge'], ['tavern', 'Tavern'], ['dojo', 'Dojo'], ['shrine', 'Shrine']];
const elTag = el => `<span class="tag el-${el}">${ELEMENTS[el].name}</span>`;
const portrait = d => `<canvas class="portrait" width="72" height="96" data-el="${d.el}" data-kind="${(WMAP[d.weapon] || {}).kind || 'none'}"></canvas>`;
function weaponLine(w) {
  const bits = [`+${w.atk} atk`];
  if (w.spd) bits.push(w.spd < 1 ? 'fast' : 'slow');
  if (w.kind === 'ranged') bits.push('ranged');
  if (w.crit) bits.push(`+${Math.round(w.crit * 100)}% crit`);
  if (w.fx) bits.push(FX_DESC[w.fx]);
  return bits.join(' · ');
}

function renderTop() {
  tickStamina();
  const next = S.stamina < MAX_STAM ? ` <span class="dim small">(+1 in ${Math.ceil((REGEN - (Date.now() - S.stamTs)) / 1000)}s)</span>` : '';
  $('#topbar').innerHTML = `<span class="clan">${esc(S.name)}</span>
    <span class="stat">Clan Lv ${S.clvl} <span class="bar xp"><i style="width:${100 * S.honor / honorNeed(S.clvl)}%"></i></span></span>
    <span class="stat gold">${S.gold} gold</span><span class="stat jade">${S.jade} jade</span>
    <span class="stat">Stamina ${S.stamina}/${MAX_STAM}${next}</span>`;
}
function render() {
  if (!S.name) return renderIntro();
  $('#topbar').classList.remove('hidden'); $('#tabs').classList.remove('hidden');
  renderTop();
  $('#tabs').innerHTML = TABS.map(([id, label]) => `<button data-a="tab" data-v="${id}" class="${tab === id ? 'active' : ''}">${label}</button>`).join('');
  $('#main').innerHTML = VIEWS[tab]();
  paintCanvases();
}

let introEl = 'ember';
function renderIntro() {
  $('#topbar').classList.add('hidden'); $('#tabs').classList.add('hidden');
  $('#main').innerHTML = `<div class="herowrap"><canvas class="hero" width="1350" height="360" data-scene="bamboo"></canvas><div class="herotitle"><h1>Nine Peaks</h1><span>Clan of the Lantern</span></div></div>
    <p class="story">For a thousand years the Lantern of Dawn has burned in your village shrine, and for a thousand years the sun has risen over the Nine Peaks. Last night the flame was stolen. The elders are too old to give chase. The task falls to you — and to whatever clan you can gather.</p>
    <h2>Name your clan</h2>
    <input type="text" id="clan-name" maxlength="24" placeholder="e.g. Autumn Crane Clan">
    <h2 style="margin-top:14px">Choose your founder's element</h2>
    <p class="dim small">Ember burns Gale · Gale scatters Stone · Stone dams Tide · Tide quenches Ember</p>
    <div class="choices">${Object.keys(ELEMENTS).map(e => `<button data-a="introEl" data-v="${e}" class="el-${e} ${introEl === e ? 'sel' : ''}">${ELEMENTS[e].name}</button>`).join('')}</div>
    <button class="primary" data-a="begin">Light the first torch</button>`;
}

const VIEWS = {
  village() {
    let h = '';
    if (S.progress >= 20) h += '<p class="story">The Lantern of Dawn burns in the shrine once more. Replay any battle, or seek glory in the Skirmish grounds.</p>';
    CHAPTERS.forEach((ch, c) => {
      if (c * 4 > S.progress) return;
      h += `<div class="chapter"><h3>Chapter ${c + 1}: ${ch.name}</h3>`;
      for (let s = 0; s < 4; s++) {
        const idx = c * 4 + s; if (idx > S.progress) break;
        const done = idx < S.progress, n = STAGE_COUNT[c][s] + (s === 3 ? 1 : 0);
        h += `<div class="stage ${done ? 'done' : ''}"><span>${s === 3 ? '<b class="red">Boss:</b> ' + ch.boss.name : STAGE_NAMES[s]}
          <span class="dim small">· ${n} foe${n > 1 ? 's' : ''} · Lv ${1 + c * 3 + s}${done ? ' · cleared' : ''}</span></span>
          <button data-a="stage" data-v="${idx}" class="${done ? '' : 'primary'}">${done ? 'Replay' : 'Fight'}</button></div>`;
      }
      h += '</div>';
    });
    const cur = CHAPTERS[Math.min(4, Math.floor(S.progress / 4))];
    return `<div class="herowrap"><canvas class="hero" width="1350" height="360" data-scene="${cur.scene}"></canvas><div class="herotitle"><h1>${cur.name}</h1><span>${S.progress >= 20 ? 'The Lantern burns again' : 'The Road to the Lantern'}</span></div></div>${h}`;
  },
  skirmish() {
    if (!skirmish) rollSkirmish();
    return `<div class="spread"><h2>Skirmish Grounds</h2><span class="dim">Record: ${S.wins} wins · ${S.losses} losses</span></div>
      <p class="dim">Rival clans roam the valleys. Each skirmish costs 1 stamina.</p><div class="grid">` +
      skirmish.map((f, i) => `<div class="card"><h3>${esc(f.clan)}</h3><div class="dim small">${f.kind} · rewards x${f.mult}</div>
        <ul class="clean small">${f.team.map(e => `<li>${esc(e.name)} Lv ${e.lvl} ${elTag(e.el)}</li>`).join('')}</ul>
        <button class="primary" data-a="skirmish" data-v="${i}">Attack</button></div>`).join('') +
      `</div><p><button data-a="reroll">Scout for other clans</button></p>`;
  },
  clan() {
    const invIds = Object.keys(S.inv).filter(id => S.inv[id] > 0);
    return `<div class="spread"><h2>Your Clan</h2><span class="dim">${S.ninjas.length}/${ROSTER_CAP(S.clvl)} ninjas</span></div><div class="grid">` +
      S.ninjas.map(n => {
        const st = statsOf(n, true), w = WMAP[n.weapon];
        return `<div class="card"><div class="row">${portrait(n)}<div class="grow">
          <div class="spread"><h3>${esc(n.name)}</h3><span>Lv ${n.lvl}</span></div>
          <div>${elTag(n.el)} <span class="tag" title="${TRAITS[n.trait].desc}">${TRAITS[n.trait].name}</span></div>
          <div class="small dim">${TRAITS[n.trait].desc}</div>
          <div class="small">HP ${st.hp} · Atk ${st.atk} · Crit ${Math.round(st.crit * 100)}%</div>
          <span class="bar xp" title="XP"><i style="width:${n.lvl >= MAX_LVL ? 100 : 100 * n.xp / xpNeed(n.lvl)}%"></i></span></div></div>
          <div class="small" style="margin:6px 0">${w ? `<b>${w.name}</b> — ${weaponLine(w)}` : '<span class="dim">Unarmed</span>'}</div>
          <div class="spread"><select data-c="equip" data-v="${n.id}"><option value="">Change weapon…</option>
            ${w ? '<option value="none">Unequip</option>' : ''}
            ${invIds.map(id => `<option value="${id}">${WMAP[id].name} (+${WMAP[id].atk}) x${S.inv[id]}</option>`).join('')}</select>
          ${S.ninjas.length > 1 ? `<button data-a="dismiss" data-v="${n.id}">Dismiss</button>` : ''}</div></div>`;
      }).join('') + `</div><p class="dim small">Spare weapons: ${invIds.length ? invIds.map(id => `${WMAP[id].name} x${S.inv[id]}`).join(', ') : 'none — visit the Forge.'}</p>`;
  },
  forge() {
    return `<h2>The Forge</h2><p class="dim">Better steel unlocks as your clan gains honor.</p><div class="grid">` +
      WEAPONS.map(w => {
        const locked = S.clvl < w.req, cost = w.jade ? `<span class="jade">${w.jade} jade</span>` : `<span class="gold">${w.price} gold</span>`;
        const can = !locked && (w.jade ? S.jade >= w.jade : S.gold >= w.price);
        return `<div class="card ${locked ? 'locked' : ''}"><div class="row"><canvas class="wicon" width="48" height="48" data-kind="${w.kind}"></canvas><div class="grow"><div class="spread"><h3>${w.name}</h3>${cost}</div>
          <div class="small">${weaponLine(w)}</div></div></div>
          <div class="spread" style="margin-top:6px"><span class="dim small">${locked ? 'Requires clan level ' + w.req : 'Owned spare: ' + (S.inv[w.id] || 0)}</span>
          <button data-a="buy" data-v="${w.id}" ${can ? '' : 'disabled'}>Buy</button></div></div>`;
      }).join('') + '</div>';
  },
  tavern() {
    if (!S.tavern.length) rollTavern();
    const full = S.ninjas.length >= ROSTER_CAP(S.clvl);
    return `<div class="spread"><h2>The Crooked Pine Tavern</h2><button data-a="rerollTavern" ${S.gold >= 25 ? '' : 'disabled'}>New faces (25 gold)</button></div>
      <p class="dim">${full ? 'Your roster is full. Raise your clan level for more slots.' : 'Wandering ninjas looking for a clan worth their blade.'}</p><div class="grid">` +
      S.tavern.map((n, i) => `<div class="card"><div class="row">${portrait(n)}<div class="grow"><div class="spread"><h3>${esc(n.name)}</h3><span>Lv ${n.lvl}</span></div>
        <div>${elTag(n.el)} <span class="tag">${TRAITS[n.trait].name}</span></div><div class="small dim">${TRAITS[n.trait].desc}</div></div></div>
        <div class="spread" style="margin-top:6px"><span class="gold">${n.cost} gold</span>
        <button data-a="recruit" data-v="${i}" ${!full && S.gold >= n.cost ? '' : 'disabled'}>Recruit</button></div></div>`).join('') + '</div>';
  },
  dojo() {
    const tea = 40 * S.clvl;
    return `<h2>The Dojo</h2><p class="dim">Pay the old master to drill a ninja. Each session grants half a level of experience.</p><div class="grid">` +
      S.ninjas.map(n => { const cost = 30 * n.lvl; return `<div class="card"><div class="spread"><h3>${esc(n.name)} <span class="dim">Lv ${n.lvl}</span></h3>
        <button data-a="train" data-v="${n.id}" ${S.gold >= cost && n.lvl < MAX_LVL ? '' : 'disabled'}>Train (${cost} gold)</button></div>
        <span class="bar xp"><i style="width:${n.lvl >= MAX_LVL ? 100 : 100 * n.xp / xpNeed(n.lvl)}%"></i></span></div>`; }).join('') +
      `</div><h2 style="margin-top:16px">Tea House</h2><div class="spread"><span class="dim">Mountain tea restores all stamina.</span>
      <button data-a="tea" ${S.gold >= tea && S.stamina < MAX_STAM ? '' : 'disabled'}>Brew tea (${tea} gold)</button></div>
      <p style="margin-top:24px"><button data-a="reset">Abandon clan and start over</button></p>`;
  },
  shrine() {
    return `<h2>The Shrine</h2><p class="dim">Offer jade for relics that bless the whole clan. Jade is won from first victories on the road, from bosses, and sometimes in skirmishes.</p><div class="grid">` +
      RELICS.map(r => { const own = hasRelic(r.id); return `<div class="card"><div class="spread"><h3>${r.name}</h3><span class="jade">${own ? 'Owned' : r.jade + ' jade'}</span></div>
        <div class="spread"><span class="small">${r.desc}</span>${own ? '' : `<button data-a="relic" data-v="${r.id}" ${S.jade >= r.jade ? '' : 'disabled'}>Offer</button>`}</div></div>`; }).join('') + '</div>';
  },
};

function rollTavern() {
  S.tavern = Array.from({ length: 3 }, () => {
    const n = mkNinja(Math.max(1, avgLvl() - rint(0, 1)));
    n.cost = Math.round(90 * S.ninjas.length * S.ninjas.length * (1 + n.lvl * 0.1));
    return n;
  });
  save();
}
function unequip(n) { if (n.weapon) { S.inv[n.weapon] = (S.inv[n.weapon] || 0) + 1; n.weapon = null; } }

// ---------- Actions ----------
const A = {
  tab(v) { tab = v; },
  introEl(v) { const name = $('#clan-name').value; introEl = v; render(); $('#clan-name').value = name; return true; },
  begin() {
    const name = $('#clan-name').value.trim();
    if (!name) { $('#clan-name').focus(); return true; }
    S.name = name;
    S.ninjas.push(mkNinja(1, introEl));
    const friend = mkNinja(1, BEATS[BEATS[introEl]]);
    while (friend.name === S.ninjas[0].name) friend.name = pick(NAMES);
    S.ninjas.push(friend);
    save(); render();
    modal(`<h2>${esc(name)} is founded</h2><p class="story">${esc(S.ninjas[0].name)} ties on a headband. ${esc(friend.name)}, a childhood friend, will not let them go alone. Two ninjas, sixty gold, and a long road.</p>
      <p class="dim small">Fight along the Story road, buy weapons at the Forge and equip them in the Clan tab, recruit at the Tavern, and train in the Dojo. Elements matter: each one is strong against another.</p>`, [{ label: 'Set out' }]);
    return true;
  },
  stage(v) { fightStage(+v); return true; },
  skirmish(v) { fightSkirmish(+v); return true; },
  reroll() { skirmish = null; },
  buy(v) {
    const w = WMAP[v]; if (!w || S.clvl < w.req) return;
    if (w.jade) { if (S.jade < w.jade) return; S.jade -= w.jade; } else { if (S.gold < w.price) return; S.gold -= w.price; }
    S.inv[v] = (S.inv[v] || 0) + 1;
  },
  recruit(v) {
    const n = S.tavern[+v];
    if (!n || S.gold < n.cost || S.ninjas.length >= ROSTER_CAP(S.clvl)) return;
    S.gold -= n.cost; delete n.cost; S.ninjas.push(n); rollTavern();
  },
  rerollTavern() { if (S.gold >= 25) { S.gold -= 25; rollTavern(); } },
  dismiss(v) {
    const n = S.ninjas.find(x => x.id === +v); if (!n || S.ninjas.length < 2) return;
    modal(`<h2>Dismiss ${esc(n.name)}?</h2><p>They will leave the clan for good. Their weapon stays with you.</p>`,
      [{ label: 'Keep' }, { label: 'Dismiss', cb: () => { unequip(n); S.ninjas = S.ninjas.filter(x => x !== n); S.tavern = []; save(); render(); } }]);
    return true;
  },
  train(v) {
    const n = S.ninjas.find(x => x.id === +v); if (!n || n.lvl >= MAX_LVL) return;
    const cost = 30 * n.lvl; if (S.gold < cost) return;
    S.gold -= cost; n.xp += Math.ceil(xpNeed(n.lvl) / 2);
    while (n.lvl < MAX_LVL && n.xp >= xpNeed(n.lvl)) { n.xp -= xpNeed(n.lvl); n.lvl++; }
  },
  tea() { const c = 40 * S.clvl; if (S.gold >= c && S.stamina < MAX_STAM) { S.gold -= c; S.stamina = MAX_STAM; } },
  relic(v) { const r = RELICS.find(x => x.id === v); if (r && !hasRelic(v) && S.jade >= r.jade) { S.jade -= r.jade; S.relics.push(v); } },
  reset() {
    modal('<h2>Abandon your clan?</h2><p>All progress will be erased.</p>', [{ label: 'Cancel' }, { label: 'Erase everything', cb: () => {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
      S = newState(); tab = 'village'; skirmish = null; render(); } }]);
    return true;
  },
};

document.addEventListener('click', e => {
  const m = e.target.closest('[data-modal]');
  if (m) { const b = modalBtns[+m.dataset.modal]; closeModal(); if (b && b.cb) b.cb(); return; }
  const sp = e.target.closest('[data-speed]');
  if (sp) { if (sp.dataset.speed === 'skip') skipBattle(); else { B.speed = +sp.dataset.speed; markSpeed(); } return; }
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const handled = A[el.dataset.a](el.dataset.v);
  if (!handled) { save(); render(); }
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-c="equip"]');
  if (!el || !el.value) return;
  const n = S.ninjas.find(x => x.id === +el.dataset.v); if (!n) return;
  if (el.value === 'none') unequip(n);
  else if (S.inv[el.value] > 0) { unequip(n); S.inv[el.value]--; n.weapon = el.value; }
  save(); render();
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'clan-name') A.begin(); });

S = load();
render();
setInterval(() => { if (S.name && $('#battle').classList.contains('hidden')) renderTop(); }, 1000);
(function heroLoop() { if (document.querySelector('canvas.hero') && $('#battle').classList.contains('hidden')) paintCanvases(); setTimeout(heroLoop, 33); })();
