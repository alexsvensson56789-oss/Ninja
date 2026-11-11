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
  { name: 'The Bamboo Road', bg: ['#86b8c9', '#dfe9c8', '#5f8a5a', '#4d6b3a'], cloth: '#5a4632',
    foes: ['Road Bandit', 'Cutpurse', 'Toll Thug'],
    boss: { name: 'Gorobei the Toll-King', el: 'stone', weapon: 'bo' },
    intro: 'On the night of the first frost, the Lantern of Dawn — the flame that has guarded the Nine Peaks for a thousand years — vanished from your village shrine. The only trail leads down the Bamboo Road, where bandits now demand tolls in the name of a new master.',
    bossIntro: '"Nobody walks my road for free," rumbles Gorobei, hefting a staff as thick as a tree. "The Hollow Shogun pays me well to keep it shut."',
    outro: 'Gorobei spits out a tooth. "The Lantern? Shipped out through the Drowned Harbor. Take it up with the pirates — if you can swim."' },
  { name: 'The Drowned Harbor', bg: ['#3d5a80', '#98c1d9', '#2f4858', '#33505c'], cloth: '#1f4e5f',
    foes: ['Deck Rat', 'Harbor Cutthroat', 'Net-Thrower'],
    boss: { name: 'Madam Riptide', el: 'tide', weapon: 'kusari' },
    intro: 'Half-sunken warehouses lean over black water. The smugglers of the Drowned Harbor answer to one captain, and she does not like questions about her cargo.',
    bossIntro: 'Madam Riptide swings a dripping chain in slow circles. "A lantern that never goes out? I sold it to monks who pay in ash. But you will not live to follow it."',
    outro: 'The pirates scatter. In the captain\'s ledger you find a single line: "One lantern — delivered to the Ashen Monastery."' },
  { name: 'The Ashen Monastery', bg: ['#4a3b3b', '#c98f5d', '#5c4a45', '#4b3d38'], cloth: '#6b2f25',
    foes: ['Fallen Acolyte', 'Ash Monk', 'Cinder Warden'],
    boss: { name: 'Abbot Cinder', el: 'ember', weapon: 'fans' },
    intro: 'The monastery burned long ago, yet its monks still pray — to the Shogun now, not to the mountain. Smoke rises from a courtyard where no fire is lit.',
    bossIntro: 'The Abbot opens two fans of glowing iron. "The Lantern\'s flame is wasted on villagers. In the Shogun\'s forge it will burn the whole world clean."',
    outro: 'As the Abbot falls, the smoke clears. Far above, on the Storm Pass, lightning circles the road to the Hollow Keep.' },
  { name: 'The Storm Pass', bg: ['#2b2d42', '#8d99ae', '#3a3f58', '#4a4e63'], cloth: '#3c3f6b',
    foes: ['Sky Scout', 'Storm Archer', 'Masked Windblade'],
    boss: { name: 'Mistress Kazehana', el: 'gale', weapon: 'bow' },
    intro: 'The pass is a knife-edge of rock above the clouds. The masked Sky Clan guards it, and they have never let an outsider cross.',
    bossIntro: '"You climbed well," says Mistress Kazehana, nocking an arrow that hums like a hornet. "Now let us see how you fall."',
    outro: 'Kazehana lowers her bow. "The Shogun promised us the sky. He lied — there is nothing inside that armor. Go. End it."' },
  { name: 'The Hollow Keep', bg: ['#0f0a14', '#5b1f2a', '#1d1420', '#241a26'], cloth: '#2a2a2a',
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
function drawNinja(ctx, x, y, o) {
  const s = o.s || 1, el = ELEMENTS[o.el].color, cloth = o.cloth || '#1d2540';
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.3)';
  ctx.beginPath(); ctx.ellipse(0, 0, 18 * s, 5 * s, 0, 0, 7); ctx.fill();
  ctx.scale((o.face || 1) * s, s);
  if (o.dead) { ctx.globalAlpha = 0.45; ctx.translate(-14, -8); ctx.rotate(-Math.PI / 2); }
  ctx.translate(0, o.bob || 0);
  // headband tails
  ctx.strokeStyle = el; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-11, -55); ctx.lineTo(-23, -51 + (o.bob || 0)); ctx.moveTo(-11, -54); ctx.lineTo(-21, -45 + (o.bob || 0)); ctx.stroke();
  ctx.fillStyle = cloth;
  ctx.fillRect(-8, -14, 6, 14); ctx.fillRect(2, -14, 6, 14);
  rr(ctx, -11, -38, 22, 26, 6); ctx.fill();
  ctx.fillStyle = el; ctx.fillRect(-11, -22, 22, 4);
  ctx.fillStyle = cloth; ctx.beginPath(); ctx.arc(0, -48, 12, 0, 7); ctx.fill();
  if (o.boss) {
    ctx.fillStyle = '#e2b44c';
    ctx.beginPath(); ctx.moveTo(-9, -57); ctx.lineTo(-13, -70); ctx.lineTo(-3, -59); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9, -57); ctx.lineTo(13, -70); ctx.lineTo(3, -59); ctx.fill();
  }
  ctx.fillStyle = o.boss ? '#c9c2b8' : '#e8c39e'; rr(ctx, -6, -52, 16, 7, 3); ctx.fill();
  ctx.fillStyle = o.boss ? '#c8402f' : '#111'; ctx.fillRect(0, -50, 3, 3); ctx.fillRect(6, -50, 3, 3);
  ctx.fillStyle = el; ctx.fillRect(-12, -58, 24, 4);
  // arm + weapon
  ctx.translate(7, -31);
  ctx.rotate(o.swing == null ? 0.25 : o.swing);
  ctx.fillStyle = cloth; ctx.fillRect(0, -3, 11, 6);
  ctx.translate(11, 0);
  drawWeapon(ctx, o.kind);
  ctx.restore();
  if (o.flash > 0) {
    ctx.save(); ctx.globalAlpha = Math.min(0.6, o.flash * 4); ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x, y - 34 * s, 20 * s, 0, 7); ctx.fill(); ctx.restore();
  }
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawWeapon(ctx, kind) {
  ctx.lineCap = 'round';
  const line = (x1, y1, x2, y2, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  if (kind === 'blade') { line(0, 4, 0, -4, '#6b4a2b', 4); line(-4, -5, 4, -5, '#e2b44c', 3); line(0, -7, 0, -32, '#dfe6ee', 3); }
  else if (kind === 'heavy') { line(0, 6, 0, -14, '#6b4a2b', 4); line(0, -16, 0, -34, '#3a3a3a', 10); ctx.fillStyle = '#999'; for (let i = 0; i < 3; i++) ctx.fillRect(-6, -20 - i * 6, 2, 2), ctx.fillRect(4, -23 - i * 6, 2, 2); }
  else if (kind === 'staff') { line(0, 20, 0, -36, '#8a6238', 4); line(0, -36, 0, -42, '#dfe6ee', 4); }
  else if (kind === 'ranged') { ctx.fillStyle = '#dfe6ee'; ctx.save(); ctx.translate(2, -6); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(3, 0); ctx.lineTo(-3, 0); ctx.fill(); } ctx.restore(); }
  else if (kind === 'chain') { line(0, 4, 0, -14, '#6b4a2b', 4); ctx.strokeStyle = '#dfe6ee'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(8, -14, 8, Math.PI, Math.PI * 1.9); ctx.stroke(); ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(0, 4); ctx.quadraticCurveTo(-10, 16, -4, 24); ctx.stroke(); ctx.setLineDash([]); }
}
function drawBackdrop(ctx, W, H, bg) {
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = bg[2];
  ctx.beginPath(); ctx.moveTo(0, 200);
  const peaks = [60, 110, 180, 90, 260, 70, 360, 130, 470, 60, 560, 120, 680, 80, 780, 125, 900, 95];
  for (let i = 0; i < peaks.length; i += 2) ctx.lineTo(peaks[i], peaks[i + 1]);
  ctx.lineTo(W, 200); ctx.fill();
  ctx.fillStyle = bg[3]; ctx.fillRect(0, 190, W, H - 190);
  ctx.fillStyle = 'rgba(0,0,0,.12)';
  for (let i = 0; i < 14; i++) ctx.fillRect((i * 137) % W, 215 + (i * 53) % 210, 40, 3);
}
function paintPortraits() {
  document.querySelectorAll('canvas.portrait').forEach(c => {
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    drawNinja(ctx, 30, 74, { el: c.dataset.el, kind: c.dataset.kind || 'none', s: 1 });
  });
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
    range: st.kind === 'ranged' ? 360 : (d.boss ? 70 : 52), scale: d.boss ? 1.5 : 1, phase: Math.random() * 6 });
}

function startBattle(opts) {
  B.units = S.ninjas.map((n, i) => mkUnit(n, 0, i, S.ninjas.length))
    .concat(opts.enemies.map((e, i) => mkUnit(e, 1, i, opts.enemies.length)));
  B.texts = []; B.shots = []; B.time = 0; B.done = false; B.opts = opts; B.speed = 1; B.active = true; B.last = 0;
  $('#battle-title').textContent = opts.title;
  $('#battle').classList.remove('hidden');
  markSpeed();
  requestAnimationFrame(frame);
}
function markSpeed() {
  document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('active', b.dataset.speed === String(B.speed)));
}
const alive = side => B.units.filter(u => u.side === side && u.hp > 0);
function say(u, txt, color) { B.texts.push({ x: u.x + rnd(-10, 10), y: u.y - 70 * u.scale, txt, color, t: 0.9 }); }

function hurt(u, dmg, color, label) {
  u.hp = Math.max(0, u.hp - dmg); u.flash = 0.15;
  say(u, label || String(Math.round(dmg)), color || '#fff');
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
    if (dist > u.range) { const v = 150 * dt / dist; u.x += dx * v; u.y += dy * v; continue; }
    if (u.timer > 0) continue;
    u.timer = u.cd * rnd(0.9, 1.1); u.anim = 0.25;
    if (u.kind === 'ranged') B.shots.push({ x1: u.x, y1: u.y - 35, x2: t.x, y2: t.y - 35, t: 0.15 });
    if (Math.random() < t.dodge) { say(t, 'dodge', '#9fd3ff'); continue; }
    let dmg = u.atk * rnd(0.85, 1.15), color = '#fff', label;
    if (BEATS[u.el] === t.el) dmg *= 1.25; else if (BEATS[t.el] === u.el) dmg *= 0.85;
    if (Math.random() < u.crit) { dmg *= 1.8; color = '#ffd447'; label = Math.round(dmg) + '!'; }
    hurt(t, dmg, color, label);
    if (u.fx === 'bleed' && Math.random() < 0.35) { t.bleed = 3; t.bleedDps = u.atk * 0.18; }
    if (u.fx === 'stun' && Math.random() < 0.2) { t.stun = 1; say(t, 'stunned', '#c9a8ff'); }
    if (u.fx === 'leech') u.hp = Math.min(u.maxHp, u.hp + dmg * 0.2);
  }
  for (const t of B.texts) { t.t -= dt; t.y -= 30 * dt; }
  B.texts = B.texts.filter(t => t.t > 0);
  for (const s of B.shots) s.t -= dt;
  B.shots = B.shots.filter(s => s.t > 0);
  const a = alive(0).length, b = alive(1).length;
  if (!a || !b) { B.done = true; B.win = a > 0; }
  else if (B.time > 150) {
    const frac = side => B.units.filter(u => u.side === side).reduce((s, u) => s + u.hp / u.maxHp, 0) / B.units.filter(u => u.side === side).length;
    B.done = true; B.win = frac(0) > frac(1);
  }
}
function drawBattle() {
  const ctx = actx;
  drawBackdrop(ctx, AW, AH, B.opts.bg);
  for (const u of [...B.units].sort((p, q) => (p.hp > 0) - (q.hp > 0) || p.y - q.y)) {
    const face = u.side === 0 ? 1 : -1, a = u.anim / 0.25;
    const lunge = u.anim > 0 && u.kind !== 'ranged' ? Math.sin(a * Math.PI) * 14 * face : 0;
    drawNinja(ctx, u.x + lunge, u.y, { el: u.el, kind: u.kind, s: u.scale, face, boss: u.boss, cloth: u.cloth,
      dead: u.hp <= 0, flash: u.flash, bob: u.hp > 0 ? Math.sin(B.time * 5 + u.phase) * 1.5 : 0,
      swing: u.anim > 0 ? -1.1 + (1 - a) * 2.2 : 0.25 });
    if (u.hp > 0) {
      const w = 44 * u.scale, top = u.y - 72 * u.scale;
      ctx.fillStyle = '#000'; ctx.fillRect(u.x - w / 2 - 1, top - 1, w + 2, 7);
      ctx.fillStyle = u.side === 0 ? '#58c79a' : '#c8402f'; ctx.fillRect(u.x - w / 2, top, w * u.hp / u.maxHp, 5);
      ctx.font = 'bold 11px Georgia'; ctx.textAlign = 'center';
      ctx.fillStyle = u.boss ? '#e2b44c' : '#fff';
      ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
      const label = (u.boss ? u.name : u.name.split(' ').pop()) + ' ' + u.lvl;
      ctx.strokeText(label, u.x, top - 5); ctx.fillText(label, u.x, top - 5);
      if (u.stun > 0) { ctx.fillStyle = '#c9a8ff'; ctx.fillText('✦', u.x + 16, top + 14); }
      if (u.bleed > 0) { ctx.fillStyle = '#ef4a3a'; ctx.beginPath(); ctx.arc(u.x - 26 * u.scale, top + 3, 3, 0, 7); ctx.fill(); }
    }
  }
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
  for (const s of B.shots) { const k = 1 - s.t / 0.15; ctx.beginPath(); ctx.moveTo(s.x1 + (s.x2 - s.x1) * Math.max(0, k - 0.3), s.y1 + (s.y2 - s.y1) * Math.max(0, k - 0.3)); ctx.lineTo(s.x1 + (s.x2 - s.x1) * k, s.y1 + (s.y2 - s.y1) * k); ctx.stroke(); }
  ctx.font = 'bold 16px Georgia'; ctx.textAlign = 'center';
  for (const t of B.texts) { ctx.globalAlpha = Math.min(1, t.t * 2); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeText(t.txt, t.x, t.y); ctx.fillStyle = t.color; ctx.fillText(t.txt, t.x, t.y); }
  ctx.globalAlpha = 1;
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
  if (s === 3) out.push({ name: ch.boss.name, el: ch.boss.el, lvl: lvl + 1, weapon: ch.boss.weapon, boss: true, cloth: '#3a1010' });
  for (let i = 0; i < STAGE_COUNT[c][s]; i++) {
    const l = Math.max(1, lvl - (s === 3 ? 1 : i % 2));
    out.push({ name: ch.foes[i % 3], el: pick(Object.keys(ELEMENTS)), lvl: l, weapon: enemyWeapon(l), cloth: ch.cloth });
  }
  return out;
}
function rollSkirmish() {
  const base = avgLvl(), n = S.ninjas.length;
  skirmish = [['Scouting party', -1, -1, 0.8], ['Rival clan', 0, 0, 1], ['Elite warband', 2, 1, 1.5]].map(([kind, dl, dn, mult]) => {
    const count = Math.max(1, Math.min(6, n + dn)), el = Object.keys(ELEMENTS);
    return { kind, mult, clan: `${pick(CLAN_A)} ${pick(CLAN_B)} Clan`,
      team: Array.from({ length: count }, () => { const l = Math.max(1, base + dl + rint(-1, 0)); return { name: pick(NAMES), el: pick(el), lvl: l, weapon: enemyWeapon(l), trait: pick(Object.keys(TRAITS)), cloth: '#4a1f2a' }; }) };
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
    startBattle({ title: `${ch.name} — ${s === 3 ? ch.boss.name : STAGE_NAMES[s]}`, bg: ch.bg, enemies, onEnd: win => {
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
  startBattle({ title: `Skirmish — ${f.clan}`, bg: ['#40304a', '#d99a6c', '#4b3b52', '#5a4a3c'], enemies: f.team, onEnd: win => {
    const lines = grant(win, f.team, { mult: f.mult, jade: win && Math.random() < 0.1 * f.mult ? 1 : 0 });
    skirmish = null;
    modal(`<h2>${win ? 'Victory!' : 'Defeat'}</h2><p class="dim">${esc(f.clan)} ${win ? 'retreats in disgrace.' : 'holds the field.'}</p>
      <ul class="clean">${lines.map(l => `<li>${l}</li>`).join('')}</ul>`, [{ label: 'Continue', cb: () => { closeBattle(); render(); } }]);
  } });
}

// ---------- Views ----------
const TABS = [['village', 'Story'], ['skirmish', 'Skirmish'], ['clan', 'Clan'], ['forge', 'Forge'], ['tavern', 'Tavern'], ['dojo', 'Dojo'], ['shrine', 'Shrine']];
const elTag = el => `<span class="tag el-${el}">${ELEMENTS[el].name}</span>`;
const portrait = d => `<canvas class="portrait" width="60" height="84" data-el="${d.el}" data-kind="${(WMAP[d.weapon] || {}).kind || 'none'}"></canvas>`;
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
  paintPortraits();
}

let introEl = 'ember';
function renderIntro() {
  $('#topbar').classList.add('hidden'); $('#tabs').classList.add('hidden');
  $('#main').innerHTML = `<h1>Nine Peaks: Clan of the Lantern</h1>
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
    return `<h2>The Road to the Lantern</h2>${h}`;
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
        return `<div class="card ${locked ? 'locked' : ''}"><div class="spread"><h3>${w.name}</h3>${cost}</div>
          <div class="small">${weaponLine(w)}</div>
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
