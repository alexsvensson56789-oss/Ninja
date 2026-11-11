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

const SCENES = {
  bamboo: { sky: ['#4f9ec4', '#a9dccf', '#f6f0c4'], orb: ['#fff8d0', 700, 70, 34], hills: ['#9ccaa6', '#69a476', '#417d52'], ground: ['#7aa652', '#35602a'], path: '#cdb87a', amb: 'leaf' },
  harbor: { sky: ['#172447', '#3b6490', '#f2a66d'], orb: ['#ffdca8', 190, 150, 40], hills: ['#55759a', '#3a5578', '#273c58'], ground: ['#7a6650', '#3a2e25'], path: '#a08a6c', amb: 'rain' },
  ash:    { sky: ['#231416', '#7a3826', '#e58d4c'], orb: ['#ffb873', 640, 120, 50], hills: ['#74504a', '#4d3431', '#2f2020'], ground: ['#62504a', '#2a2221'], path: '#84736a', amb: 'ember' },
  storm:  { sky: ['#12162a', '#343e62', '#8793ab'], orb: ['#e8eefc', 150, 70, 26], hills: ['#5d6685', '#3d4563', '#272c42'], ground: ['#62677a', '#2e3245'], path: '#868ba0', amb: 'rain' },
  keep:   { sky: ['#06040b', '#280d1a', '#7c1f2b'], orb: ['#ff5a4a', 160, 80, 40], hills: ['#3c1a29', '#25121d', '#150a13'], ground: ['#33263a', '#100a13'], path: '#55425a', amb: 'ember' },
  dusk:   { sky: ['#2a2150', '#b3567a', '#f7b56d'], orb: ['#ffe4a8', 450, 165, 46], hills: ['#80608c', '#59416c', '#3b2b4e'], ground: ['#74663f', '#3a301f'], path: '#b39c63', amb: 'petal' },
};
const HORIZON = 205, sceneCache = {};

function tower(ctx, cx, base, tiers, w, h, col, win) {
  for (let i = 0; i < tiers; i++) {
    const tw = w * (1 - i * 0.17), y = base - (i + 1) * h;
    ctx.fillStyle = col; ctx.fillRect(cx - tw / 2, y, tw, h);
    ctx.fillStyle = win;
    for (let k = -1; k <= 1; k++) ctx.fillRect(cx + k * tw * 0.28 - 3, y + h * 0.4, 6, h * 0.35);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(cx - tw * 0.8, y + 4); ctx.quadraticCurveTo(cx - tw * 0.55, y, cx - tw * 0.4, y - h * 0.35);
    ctx.lineTo(cx + tw * 0.4, y - h * 0.35); ctx.quadraticCurveTo(cx + tw * 0.55, y, cx + tw * 0.8, y + 4);
    ctx.lineTo(cx + tw * 0.74, y + 8); ctx.lineTo(cx - tw * 0.74, y + 8); ctx.closePath(); ctx.fill();
  }
}
function tree(ctx, R, x, base, h, trunk, leaf) {
  ctx.strokeStyle = trunk; ctx.lineWidth = h * 0.09; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x + h * 0.1, base - h * 0.5, x - h * 0.05, base - h * 0.8); ctx.stroke();
  ctx.lineWidth = h * 0.045;
  ctx.beginPath(); ctx.moveTo(x + h * 0.04, base - h * 0.5); ctx.lineTo(x + h * 0.3, base - h * 0.78); ctx.moveTo(x, base - h * 0.6); ctx.lineTo(x - h * 0.28, base - h * 0.85); ctx.stroke();
  if (!leaf) return;
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = shade(leaf, R() * 0.3 - 0.15); ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.arc(x + (R() - 0.5) * h * 0.85, base - h * (0.7 + R() * 0.45), h * (0.12 + R() * 0.1), 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function bambooStalk(ctx, R, x, base, h, col) {
  const lean = (R() - 0.5) * 30, seg = 34;
  ctx.lineCap = 'butt';
  for (let y = 0, i = 0; y < h; y += seg, i++) {
    const x1 = x + lean * y / h, x2 = x + lean * (y + seg - 3) / h;
    ctx.strokeStyle = shade(col, i % 2 ? 0.08 : -0.08); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x1, base - y); ctx.lineTo(x2, base - y - seg + 3); ctx.stroke();
    if (R() < 0.4) {
      ctx.fillStyle = shade(col, 0.2); const d = R() < 0.5 ? 1 : -1;
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(x2 + d * (12 + k * 5), base - y - seg + k * 5, 11, 2.6, d * (0.5 - k * 0.3), 0, 7); ctx.fill(); }
    }
  }
}

function buildScene(key) {
  if (sceneCache[key]) return sceneCache[key];
  const sc = SCENES[key], c = document.createElement('canvas'); c.width = AW; c.height = AH;
  const ctx = c.getContext('2d'), R = seeded(key.length * 7919 + key.charCodeAt(0));
  let g = ctx.createLinearGradient(0, 0, 0, HORIZON + 10);
  g.addColorStop(0, sc.sky[0]); g.addColorStop(0.6, sc.sky[1]); g.addColorStop(1, sc.sky[2]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, AW, AH);
  if (key === 'keep' || key === 'storm') { ctx.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { ctx.globalAlpha = R() * 0.7; ctx.fillRect(R() * AW, R() * 150, 1.5, 1.5); } ctx.globalAlpha = 1; }
  const [oc, ox, oy, or] = sc.orb;
  g = ctx.createRadialGradient(ox, oy, or * 0.6, ox, oy, or * 4);
  g.addColorStop(0, oc); g.addColorStop(0.12, oc + 'aa'); g.addColorStop(1, oc + '00');
  ctx.fillStyle = g; ctx.fillRect(0, 0, AW, HORIZON + 20);
  ctx.fillStyle = oc; ctx.beginPath(); ctx.arc(ox, oy, or, 0, 7); ctx.fill();
  // clouds
  for (let i = 0; i < 7; i++) {
    const cx = R() * AW, cy = 25 + R() * 100, w = 60 + R() * 90;
    ctx.fillStyle = key === 'storm' || key === 'keep' || key === 'ash' ? 'rgba(20,16,26,.45)' : 'rgba(255,255,255,.4)';
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(cx + (k - 2) * w * 0.22, cy + (k % 2) * 5, w * 0.3, 9 + R() * 8, 0, 0, 7); ctx.fill(); }
  }
  if (key === 'storm') {
    ctx.strokeStyle = 'rgba(240,244,255,.85)'; ctx.lineWidth = 2.5; ctx.shadowColor = '#cfe0ff'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.moveTo(610, 40); ctx.lineTo(590, 85); ctx.lineTo(612, 92); ctx.lineTo(580, 150); ctx.lineTo(596, 156); ctx.lineTo(574, 196); ctx.stroke(); ctx.shadowBlur = 0;
  }
  // mountain layers
  sc.hills.forEach((col, i) => {
    const amp = [95, 65, 38][i], p = [R() * 9, R() * 9, R() * 9];
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, HORIZON + 6);
    for (let x = 0; x <= AW; x += 6) {
      const n = Math.sin(x * 0.006 + p[0]) * 0.5 + Math.sin(x * 0.017 + p[1]) * 0.3 + Math.sin(x * 0.045 + p[2]) * 0.12 + (key === 'storm' ? Math.abs(Math.sin(x * 0.03 + p[1])) * 0.35 : 0);
      ctx.lineTo(x, HORIZON - 12 - i * 2 - amp * (0.5 + 0.5 * n));
    }
    ctx.lineTo(AW, HORIZON + 6); ctx.fill();
    const hz = ctx.createLinearGradient(0, HORIZON - amp, 0, HORIZON);
    hz.addColorStop(0, 'rgba(255,255,255,0)'); hz.addColorStop(1, sc.sky[2] + '55');
    ctx.fillStyle = hz; ctx.fillRect(0, HORIZON - amp - 20, AW, amp + 26);
  });
  // landmarks
  if (key === 'ash') { tower(ctx, 450, HORIZON + 4, 4, 120, 30, '#1f1414', '#ff9a3c'); tree(ctx, R, 150, HORIZON + 8, 110, '#1c1212'); tree(ctx, R, 770, HORIZON + 8, 95, '#1c1212'); }
  if (key === 'keep') { tower(ctx, 450, HORIZON + 4, 5, 190, 31, '#0b070d', '#e0342a'); tower(ctx, 245, HORIZON + 4, 3, 90, 26, '#0b070d', '#e0342a'); tower(ctx, 655, HORIZON + 4, 3, 90, 26, '#0b070d', '#e0342a'); }
  if (key === 'dusk') {
    ctx.fillStyle = '#b3261e'; ctx.fillRect(385, HORIZON - 92, 12, 100); ctx.fillRect(503, HORIZON - 92, 12, 100); ctx.fillRect(372, HORIZON - 76, 156, 9);
    ctx.beginPath(); ctx.moveTo(352, HORIZON - 108); ctx.quadraticCurveTo(450, HORIZON - 94, 548, HORIZON - 108); ctx.lineTo(540, HORIZON - 92); ctx.lineTo(360, HORIZON - 92); ctx.fill();
    tree(ctx, R, 110, HORIZON + 14, 150, '#3a2430', '#f3a6c0'); tree(ctx, R, 800, HORIZON + 14, 140, '#3a2430', '#f3a6c0'); tree(ctx, R, 250, HORIZON + 6, 80, '#3a2430', '#e58fb0');
  }
  if (key === 'harbor') {
    g = ctx.createLinearGradient(0, HORIZON - 30, 0, HORIZON + 10); g.addColorStop(0, '#f0a56c'); g.addColorStop(1, '#27425f');
    ctx.fillStyle = g; ctx.fillRect(0, HORIZON - 30, AW, 40);
    ctx.fillStyle = 'rgba(255,225,180,.5)'; for (let i = 0; i < 40; i++) ctx.fillRect(120 + R() * 150, HORIZON - 28 + R() * 34, 8 + R() * 22, 1.5);
    ctx.fillStyle = '#141a26';
    ctx.beginPath(); ctx.moveTo(590, HORIZON - 16); ctx.lineTo(790, HORIZON - 16); ctx.lineTo(770, HORIZON + 6); ctx.lineTo(615, HORIZON + 6); ctx.closePath(); ctx.fill();
    for (const [mx, mh] of [[640, 120], [700, 150], [750, 105]]) {
      ctx.fillRect(mx - 2, HORIZON - 16 - mh, 4, mh);
      ctx.fillStyle = '#2b2233'; ctx.beginPath(); ctx.moveTo(mx - 30, HORIZON - mh); ctx.quadraticCurveTo(mx + 6, HORIZON - mh * 0.6, mx - 30, HORIZON - 36); ctx.lineTo(mx + 26, HORIZON - 36); ctx.quadraticCurveTo(mx + 36, HORIZON - mh * 0.6, mx + 26, HORIZON - mh); ctx.fill(); ctx.fillStyle = '#141a26';
    }
  }
  // ground
  g = ctx.createLinearGradient(0, HORIZON, 0, AH); g.addColorStop(0, sc.ground[0]); g.addColorStop(1, sc.ground[1]);
  ctx.fillStyle = g; ctx.fillRect(0, HORIZON, AW, AH - HORIZON);
  g = ctx.createRadialGradient(AW / 2, 330, 40, AW / 2, 330, 480);
  g.addColorStop(0, sc.path + 'cc'); g.addColorStop(1, sc.path + '00');
  ctx.save(); ctx.translate(0, 330); ctx.scale(1, 0.28); ctx.translate(0, -330); ctx.fillStyle = g; ctx.fillRect(0, -400, AW, 1500); ctx.restore();
  if (key === 'harbor') {
    ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = 2;
    for (let y = HORIZON + 8, k = 0; y < AH; y += 14 + k * 5, k++) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(AW, y); ctx.stroke(); for (let i = 0; i < 7; i++) { const x = R() * AW; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 14 + k * 5); ctx.stroke(); } }
  } else {
    for (let i = 0; i < 260; i++) {
      const x = R() * AW, y = HORIZON + 6 + R() * (AH - HORIZON - 8), k = (y - HORIZON) / 230;
      ctx.fillStyle = R() < 0.5 ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.09)';
      ctx.beginPath(); ctx.ellipse(x, y, (6 + R() * 16) * (0.4 + k), 1.4 + k * 1.6, 0, 0, 7); ctx.fill();
    }
    const tuft = key === 'bamboo' || key === 'dusk';
    for (let i = 0; i < (tuft ? 90 : 40); i++) {
      const x = R() * AW, y = HORIZON + 10 + R() * (AH - HORIZON - 12), k = 0.5 + (y - HORIZON) / 200;
      if (tuft) { ctx.strokeStyle = shade(sc.ground[0], R() * 0.4 - 0.3); ctx.lineWidth = 1.6; for (let b = -1; b <= 1; b++) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + b * 4 * k, y - 8 * k); ctx.stroke(); } }
      else { ctx.fillStyle = shade(sc.ground[0], R() * 0.3 - 0.35); ctx.beginPath(); ctx.ellipse(x, y, 5 * k, 3 * k, 0, 0, 7); ctx.fill(); }
    }
  }
  if (key === 'bamboo') {
    for (let i = 0; i < 9; i++) bambooStalk(ctx, R, 15 + R() * 150, HORIZON + 10 + R() * 30, 250, '#3f7f45');
    for (let i = 0; i < 9; i++) bambooStalk(ctx, R, 735 + R() * 150, HORIZON + 10 + R() * 30, 250, '#3f7f45');
  }
  if (key === 'storm') { ctx.fillStyle = '#1c2033'; for (const [x, w, h] of [[40, 90, 120], [140, 60, 70], [800, 100, 140], [720, 60, 60]]) { ctx.beginPath(); ctx.moveTo(x - w / 2, HORIZON + 14); ctx.lineTo(x - w * 0.1, HORIZON - h); ctx.lineTo(x + w * 0.2, HORIZON - h * 0.6); ctx.lineTo(x + w / 2, HORIZON + 14); ctx.fill(); } }
  g = ctx.createRadialGradient(AW / 2, AH / 2, 220, AW / 2, AH / 2, 560);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, AW, AH);
  return (sceneCache[key] = c);
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
    ctx.drawImage(buildScene(key), 0, 40, AW, 240, 0, 0, AW, 240);
    drawAmbient(ctx, heroAmb, SCENES[key].amb, t, 1 / 30, 240);
    const team = S.name ? S.ninjas : [{ el: 'ember', weapon: 'wolf' }, { el: 'tide', weapon: 'bo' }, { el: 'gale', weapon: 'kunai' }, { el: 'stone', weapon: 'tetsubo' }];
    team.forEach((n, i) => drawNinja(ctx, AW / 2 - (team.length - 1) * 38 + i * 76, 206 + (i % 2) * 14, { el: n.el, kind: (WMAP[n.weapon] || {}).kind || 'none', s: 1.5, t: t + i, bob: Math.sin(t * 3 + i) * 1.5, face: i < team.length / 2 ? 1 : -1 }));
  }
}

// ---------- Battle ----------
const B = { active: false, speed: 1 };
const arena = $('#arena'), actx = arena.getContext('2d');
const AW = 900, AH = 440;

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
  if (B.shake > 0.2) ctx.translate(rnd(-B.shake, B.shake), rnd(-B.shake, B.shake));
  ctx.drawImage(buildScene(B.opts.scene), 0, 0);
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
  $('#main').innerHTML = `<div class="herowrap"><canvas class="hero" width="900" height="240" data-scene="bamboo"></canvas><div class="herotitle"><h1>Nine Peaks</h1><span>Clan of the Lantern</span></div></div>
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
    return `<div class="herowrap"><canvas class="hero" width="900" height="240" data-scene="${cur.scene}"></canvas><div class="herotitle"><h1>${cur.name}</h1><span>${S.progress >= 20 ? 'The Lantern burns again' : 'The Road to the Lantern'}</span></div></div>${h}`;
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
