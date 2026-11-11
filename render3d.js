'use strict';
/* 3D renderer for battles and the story banner. Everything is generated in code. */
const R3 = (() => {
  const api = { ok: false };
  if (!window.THREE) return api;
  const T = THREE, PI = Math.PI;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ canvas: document.getElementById('arena3d'), antialias: true, powerPreference: 'high-performance' });
  } catch (e) { return api; }
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  const W2 = 900, H2 = 440;
  const camera = new T.PerspectiveCamera(40, W2 / H2, 0.5, 1400);
  const scene = new T.Scene(), figGroup = new T.Group();
  scene.add(figGroup);
  let world = null, worldKey = null, quality = 'high', figs = [], heroSig = null, curW = 0, curH = 0;

  const LIGHT = {
    bamboo: { sun: [-0.45, 0.75, 0.5], col: '#fff4dc', dir: 2.7, hemi: 1.3, disc: [0.5, 0.5, -0.7] },
    harbor: { sun: [-0.7, 0.42, 0.35], col: '#ffb478', dir: 2.5, hemi: 1.1, disc: [0, 0.1, -1] },
    ash:    { sun: [0.6, 0.5, 0.4], col: '#ffc090', dir: 2.4, hemi: 1.1, disc: [0.45, 0.28, -0.85] },
    storm:  { sun: [-0.3, 0.8, 0.4], col: '#c4d2f0', dir: 1.7, hemi: 1.2, disc: [-0.6, 0.5, -0.6] },
    keep:   { sun: [-0.5, 0.6, 0.35], col: '#ff9a9a', dir: 1.5, hemi: 0.9, disc: [-0.5, 0.42, -0.75] },
    dusk:   { sun: [0.6, 0.42, 0.4], col: '#ffc8a8', dir: 2.4, hemi: 1.2, disc: [0, 0.12, -1] },
  };

  // ---------- noise ----------
  function rng(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function hash(x, y) { let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y) { let s = 0, a = 0.5; for (let i = 0; i < 4; i++) { s += a * vnoise(x, y); x *= 2.03; y *= 2.03; a *= 0.5; } return s; }
  const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  // terrain height: flat courtyard, rolling hills, a lake behind the gate
  function ground(x, z) {
    const d = Math.hypot(x, z);
    const hills = (fbm(x * 0.045 + 7, z * 0.045 + 3) - 0.38) * 7 * sstep(16, 42, d);
    const lake = sstep(-17, -27, z) * sstep(95, 60, Math.abs(x)) * sstep(-170, -120, z);
    return hills * (1 - lake) - 2.6 * lake;
  }

  // ---------- shared geometry ----------
  const G = {
    sphere: new T.SphereGeometry(1, 14, 10), half: new T.SphereGeometry(1, 14, 6, 0, PI * 2, 0, PI / 2),
    cyl: new T.CylinderGeometry(1, 1, 1, 12), box: new T.BoxGeometry(1, 1, 1), cone: new T.ConeGeometry(1, 1, 12),
    cone4: new T.ConeGeometry(1, 1, 4), torus: new T.TorusGeometry(1, 0.1, 6, 20), ico: new T.IcosahedronGeometry(1, 1),
    face: new T.SphereGeometry(0.485, 16, 6, PI / 2 - 0.95, 1.9, 1.22, 0.5),
    crest: new T.TorusGeometry(0.34, 0.04, 6, 16, PI), sickle: new T.TorusGeometry(0.24, 0.03, 6, 12, PI * 0.9),
    trunk: new T.CylinderGeometry(0.6, 1, 1, 7).translate(0, 0.5, 0),
  };
  const blade = new T.BufferGeometry();
  blade.setAttribute('position', new T.Float32BufferAttribute([-0.05, 0, 0, 0.05, 0, 0, 0, 0.5, 0], 3));
  blade.setAttribute('normal', new T.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
  G.blade = blade;
  const petalGeo = new T.PlaneGeometry(1, 0.55);

  class Inst {
    constructor(geo, mat, shadow) { this.geo = geo; this.mat = mat; this.shadow = shadow; this.m = []; }
    add(px, py, pz, sx, sy, sz, color, ry, rx, rz) { this.m.push([px, py, pz, sx, sy, sz, rx || 0, ry || 0, rz || 0, color]); }
    build(parent) {
      if (!this.m.length) return null;
      const mesh = new T.InstancedMesh(this.geo, this.mat, this.m.length), o = new T.Object3D(), c = new T.Color();
      this.m.forEach((a, i) => { o.position.set(a[0], a[1], a[2]); o.scale.set(a[3], a[4], a[5]); o.rotation.set(a[6], a[7], a[8]); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); mesh.setColorAt(i, c.set(a[9])); });
      mesh.castShadow = !!this.shadow; mesh.receiveShadow = true; mesh.frustumCulled = false;
      parent.add(mesh); return mesh;
    }
  }
  function mesh(geo, mat, parent, sx, sy, sz, px, py, pz, rx, ry, rz) {
    const m = new T.Mesh(geo, mat);
    m.scale.set(sx, sy, sz); m.position.set(px || 0, py || 0, pz || 0); m.rotation.set(rx || 0, ry || 0, rz || 0);
    m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function canvasTex(size, draw, repeat) {
    const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; if (repeat) t.repeat.set(repeat, repeat); t.anisotropy = 4; return t;
  }

  // ---------- world ----------
  function disposeTree(o) {
    o.traverse(n => {
      if (n.geometry && !Object.values(G).includes(n.geometry) && n.geometry !== petalGeo) n.geometry.dispose();
      const ms = n.material ? (Array.isArray(n.material) ? n.material : [n.material]) : [];
      ms.forEach(m => { for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose(); m.dispose(); });
    });
  }

  function buildWorld(key) {
    const P = SCENES[key], L = LIGHT[key], R = rng(key.length * 7919 + key.charCodeAt(0) * 31), g = new T.Group(), ups = [], hi = quality === 'high';
    const uTime = { value: 0 };
    const fogCol = P.night ? mix(P.sky[1], P.sky[2], 0.4) : P.sky[2];
    scene.fog = new T.Fog(fogCol, 50, P.night ? 200 : 300);

    // sky dome
    const disc = new T.Vector3(...L.disc).normalize();
    g.add(new T.Mesh(new T.SphereGeometry(900, 32, 16), new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new T.Color(P.sky[0]) }, mid: { value: new T.Color(P.sky[1]) }, bot: { value: new T.Color(P.sky[2]) }, sunCol: { value: new T.Color(P.orb[0]) }, sunDir: { value: disc } },
      vertexShader: 'varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 top, mid, bot, sunCol, sunDir; varying vec3 vDir;
        void main(){ vec3 d = normalize(vDir); float h = d.y;
          vec3 c = mix(bot, mid, smoothstep(0.0, 0.22, h)); c = mix(c, top, smoothstep(0.18, 0.75, h));
          float s = max(dot(d, sunDir), 0.0); c += sunCol * (smoothstep(0.9988, 0.9993, s) * 1.5 + pow(s, 60.0) * 0.45 + pow(s, 6.0) * 0.12);
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    })));
    if (P.night || P.lightning) {
      const pos = []; for (let i = 0; i < 500; i++) { const a = R() * PI * 2, e = 0.15 + R() * 1.3; pos.push(Math.cos(a) * Math.cos(e) * 850, Math.sin(e) * 850, Math.sin(a) * Math.cos(e) * 850); }
      const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
      g.add(new T.Points(sg, new T.PointsMaterial({ color: '#ffffff', size: 2.2, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8 })));
    }

    // lights
    const hemi = new T.HemisphereLight(mix(P.sky[1], '#ffffff', 0.45), mix(P.grass[0], '#ffffff', 0.15), L.hemi); g.add(hemi);
    const fill = new T.DirectionalLight('#ffffff', P.night ? 1.1 : 0.7); fill.position.set(4, 9, 30); g.add(fill);
    const sun = new T.DirectionalLight(L.col, L.dir);
    sun.position.set(L.sun[0] * 70, L.sun[1] * 70, L.sun[2] * 70); sun.castShadow = hi;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 24, bottom: -24, near: 1, far: 190 });
    g.add(sun, sun.target);
    if (P.lightning) ups.push(t => { const ph = t % 7; hemi.intensity = L.hemi + (ph < 0.12 || (ph > 0.25 && ph < 0.32) ? 3.5 : 0); });

    // clouds
    const cloudMat = new T.MeshLambertMaterial({ color: P.cloud[0], emissive: P.cloud[1], emissiveIntensity: P.night ? 0.25 : 0.55, fog: false });
    const clouds = new Inst(G.ico, cloudMat);
    for (let i = 0; i < 11; i++) {
      const a = -PI * (0.08 + 0.84 * (i + R() * 0.6) / 11), dist = 330 + R() * 260, cx = Math.cos(a) * dist, cz = Math.sin(a) * dist, cy = 40 + R() * 150, w = 40 + R() * 55;
      for (let k = 0; k < 16; k++) { const u = R() * 2 - 1, top = Math.sqrt(1 - u * u), r = w * (0.22 + R() * 0.25) * (0.5 + 0.5 * top); clouds.add(cx + u * w * Math.sin(a) * -1, cy + R() * top * w * 0.5, cz + u * w * Math.cos(a), r, r * 0.85, r, '#ffffff'); }
    }
    clouds.build(g);

    // terrain
    const tg = new T.PlaneGeometry(520, 520, 130, 130); tg.rotateX(-PI / 2);
    const tp = tg.attributes.position, tc = new Float32Array(tp.count * 3), col = new T.Color();
    for (let i = 0; i < tp.count; i++) {
      const x = tp.getX(i), z = tp.getZ(i), h = ground(x, z); tp.setY(i, h - 0.12 - 0.6 * sstep(20, 15, Math.hypot(x, z)));
      col.set(mix(P.grass[1], P.grass[0], Math.min(1, fbm(x * 0.09, z * 0.09) * 1.3)));
      if (h < -0.4) col.lerp(new T.Color(P.stone[1]), sstep(-0.4, -1.4, h));
      tc[i * 3] = col.r; tc[i * 3 + 1] = col.g; tc[i * 3 + 2] = col.b;
    }
    tg.setAttribute('color', new T.BufferAttribute(tc, 3)); tg.computeVertexNormals();
    const terrain = new T.Mesh(tg, new T.MeshLambertMaterial({ vertexColors: true })); terrain.receiveShadow = true; g.add(terrain);

    // water
    const nrm = canvasTex(128, (c, n) => {
      const img = c.createImageData(n, n), hgt = (x, y) => Math.sin(x * 6.283 * 3 + 1.3 * Math.sin(y * 6.283 * 2)) + 0.5 * Math.sin(y * 6.283 * 5 + 1.7 * Math.cos(x * 6.283 * 3));
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const e = 1 / n, dx = hgt(x / n + e, y / n) - hgt(x / n - e, y / n), dy = hgt(x / n, y / n + e) - hgt(x / n, y / n - e), i = (y * n + x) * 4; img.data[i] = 128 - dx * 300; img.data[i + 1] = 128 - dy * 300; img.data[i + 2] = 255; img.data[i + 3] = 255; }
      c.putImageData(img, 0, 0);
    }, 40);
    nrm.colorSpace = T.NoColorSpace;
    const water = new T.Mesh(new T.PlaneGeometry(520, 520).rotateX(-PI / 2), new T.MeshStandardMaterial({ color: mix(P.sky[1], '#0b4468', P.night ? 0.7 : 0.4), roughness: 0.18, metalness: 0.05, normalMap: nrm, normalScale: new T.Vector2(0.5, 0.5), transparent: true, opacity: 0.9 }));
    water.position.y = -0.7; water.receiveShadow = true; g.add(water);
    ups.push(t => nrm.offset.set(t * 0.012, t * 0.02));

    // courtyard
    const stoneTex = canvasTex(512, (c, n) => {
      c.fillStyle = P.stone[0]; c.fillRect(0, 0, n, n);
      const q = n / 8;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { c.fillStyle = mix(P.stone[0], P.stone[1], R() * 0.55); c.fillRect(x * q + (y % 2 ? q / 2 : 0) - q, y * q, q * 3, q); c.fillRect(x * q + (y % 2 ? q / 2 : 0), y * q, q, q); }
      for (let i = 0; i < 900; i++) { c.fillStyle = R() < 0.5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.07)'; c.fillRect(R() * n, R() * n, 2 + R() * 5, 2 + R() * 3); }
      c.strokeStyle = mix(P.stone[1], '#000000', 0.35); c.lineWidth = 3;
      for (let y = 0; y <= 8; y++) { c.beginPath(); c.moveTo(0, y * q); c.lineTo(n, y * q); c.stroke(); for (let x = 0; x <= 8; x++) { const xx = x * q + (y % 2 ? q / 2 : 0); c.beginPath(); c.moveTo(xx, y * q); c.lineTo(xx, y * q + q); c.stroke(); } }
    }, 3);
    const yard = new T.Mesh(new T.CylinderGeometry(14.4, 14.9, 0.7, 56), [new T.MeshStandardMaterial({ color: P.stone[1], roughness: 0.9 }), new T.MeshStandardMaterial({ map: stoneTex, roughness: 0.85 }), new T.MeshStandardMaterial({ color: P.stone[1] })]);
    yard.position.y = -0.35; yard.receiveShadow = true; g.add(yard);
    const rim = new T.Mesh(new T.TorusGeometry(14.5, 0.22, 6, 56), new T.MeshStandardMaterial({ color: mix(P.stone[0], P.stone[1], 0.6), roughness: 0.9 }));
    rim.rotation.x = PI / 2; rim.receiveShadow = true; g.add(rim);

    // instanced vegetation
    const leafMat = new T.MeshStandardMaterial({ roughness: 0.9, flatShading: true });
    const leaves = new Inst(G.ico, leafMat, true), trunks = new Inst(G.trunk, new T.MeshStandardMaterial({ roughness: 1 }), true);
    const pads = new Inst(G.sphere, new T.MeshStandardMaterial({ roughness: 0.9 }), true);
    const blossom = [mix(P.blossom, '#40102a', 0.45), P.blossom, mix(P.blossom, '#ffffff', 0.55)];
    const tone = (tones, k) => (k = Math.max(0, Math.min(1, k))) < 0.5 ? mix(tones[0], tones[1], k * 2) : mix(tones[1], tones[2], k * 2 - 1);
    const barkCol = P.night ? '#1c1218' : '#5a3a26';
    function pine(x, y, z, h, tones) {
      const lean = (R() - 0.5) * 0.5;
      trunks.add(x, y, z, h * 0.06, h, h * 0.06, barkCol, 0, 0, lean);
      for (let i = 0; i < 4; i++) { const k = i / 3, r = h * (0.42 - 0.2 * k) * (0.8 + R() * 0.4); pads.add(x - Math.sin(lean) * h * (0.45 + 0.5 * k) + (R() - 0.5) * h * 0.4 * (1 - k), y + h * (0.5 + 0.5 * k), z + (R() - 0.5) * h * 0.4 * (1 - k), r, r * 0.28, r, tone(tones, 0.2 + k * 0.6 + R() * 0.2)); }
    }
    function bush(x, y, z, r, tones) { for (let i = 0; i < 5; i++) { const s = r * (0.5 + R() * 0.5); leaves.add(x + (R() - 0.5) * r * 1.6, y + s * 0.5 + R() * r * 0.3, z + (R() - 0.5) * r * 1.6, s, s * 0.8, s, tone(tones, R()), R() * 6); } }
    function tree(x, z, h, tones, lean) {
      const y = ground(x, z) - 0.2;
      trunks.add(x, y, z, h * 0.09, h * 0.7, h * 0.09, barkCol, 0, 0, lean || 0);
      const cx = x - Math.sin(lean || 0) * h * 0.7, cy = y + h * 0.82;
      for (let i = 0; i < 26; i++) { const a = R() * 6.283, e = (R() - 0.3) * 1.2, d = Math.pow(R(), 0.5) * h * 0.46, s = h * (0.13 + R() * 0.1); leaves.add(cx + Math.cos(a) * Math.cos(e) * d * 1.25, cy + Math.sin(e) * d * 0.75, z + Math.sin(a) * Math.cos(e) * d * 1.25, s, s * 0.8, s, tone(tones, 0.62 + Math.sin(e) * 0.4 + (R() - 0.5) * 0.3), R() * 6, R() * 6); }
    }

    // rock pillars
    const rockMat = new T.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 });
    const falls = [];
    function pillar(x, z, r, h, deco) {
      const geo = new T.CylinderGeometry(r * 0.72, r, h, 16, 14), p = geo.attributes.position, cols = new Float32Array(p.count * 3), sd = R() * 100, c1 = new T.Color(P.rock[0]), c2 = new T.Color(P.rock[1]), gr = new T.Color(P.greens[1]);
      for (let i = 0; i < p.count; i++) {
        const vx = p.getX(i), vy = p.getY(i), vz = p.getZ(i), a = Math.atan2(vz, vx), k = 1 + (fbm(Math.cos(a) * 1.6 + sd, vy * 0.16 + Math.sin(a) * 1.6) - 0.45) * 0.75 + (vnoise(a * 4 + sd, vy * 0.9) - 0.5) * 0.16;
        p.setXYZ(i, vx * k, vy + (Math.abs(vy) > h * 0.49 ? (vnoise(vx + sd, vz) - 0.3) * r * 0.7 : 0), vz * k);
      }
      geo.computeVertexNormals();
      const n = geo.attributes.normal;
      for (let i = 0; i < p.count; i++) {
        col.copy(c1).lerp(c2, Math.min(1, fbm(p.getX(i) * 0.4 + sd, p.getY(i) * 0.12) * 1.5 + (0.5 - p.getY(i) / h) * 0.2));
        if (n.getY(i) > 0.45) col.lerp(gr, 0.85);
        cols[i * 3] = col.r; cols[i * 3 + 1] = col.g; cols[i * 3 + 2] = col.b;
      }
      geo.setAttribute('color', new T.BufferAttribute(cols, 3));
      const base = Math.min(ground(x, z), 0) - 2, m = new T.Mesh(geo, rockMat);
      m.position.set(x, base + h / 2, z); m.castShadow = deco; m.receiveShadow = true; g.add(m);
      const top = base + h;
      for (let i = 0; i < (deco ? 4 : 2); i++) { const a = R() * 6.283, d = R() * r * 0.45; pine(x + Math.cos(a) * d, top - 0.3, z + Math.sin(a) * d, r * (0.7 + R() * 0.6), P.greens); }
      bush(x, top, z, r * 0.5, P.greens);
      for (let i = 0; i < (deco ? 7 : 3); i++) { const a = R() * 6.283, yy = base + h * (0.25 + R() * 0.65), rr = r * (0.82 + 0.1 * R()); if (R() < 0.7) pine(x + Math.cos(a) * rr, yy, z + Math.sin(a) * rr, r * (0.4 + R() * 0.4), P.greens); bush(x + Math.cos(a) * rr * 0.95, yy, z + Math.sin(a) * rr * 0.95, r * 0.28, R() < 0.2 ? blossom : P.greens); }
      return top;
    }
    const near = [[-20, -10, 3.4, 30], [20.5, -12, 3.8, 34], [-29, 3, 4.2, 38], [30, 1, 4.6, 41], [-10, -40, 3.2, 27], [12, -45, 3.6, 34], [-27, -34, 3.8, 36], [29, -38, 3.4, 31], [0, -68, 3.4, 26]];
    near.forEach(([x, z, r, h], i) => { pillar(x, z, r, h, true); if (i < 2) falls.push([x + (i ? -0.5 : 0.5), z + r * 1.02, h * 0.55]); });
    for (let i = 0; i < (hi ? 16 : 9); i++) pillar((R() - 0.5) * 240, -85 - R() * 120, 4 + R() * 5, 30 + R() * 45, false);

    // waterfalls and mist
    const fallMat = new T.ShaderMaterial({ transparent: true, depthWrite: false, side: T.DoubleSide, uniforms: { t: uTime },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform float t; varying vec2 vUv;
        void main(){ float n = sin(vUv.x * 38.0 + sin(vUv.y * 7.0 - t * 3.0) * 2.0) * 0.5 + 0.5; float s = fract(vUv.y * 3.0 + t * 1.3 + sin(vUv.x * 21.0) * 0.25);
          float edge = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * smoothstep(1.0, 0.93, vUv.y);
          gl_FragColor = vec4(mix(vec3(0.72, 0.88, 1.0), vec3(1.0), n * s + 0.25), (0.7 + 0.3 * s) * edge); }` });
    const mistTex = canvasTex(64, c => { const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, 64, 64); });
    const mists = [];
    for (const [x, z, h] of falls) {
      const by = ground(x, z);
      const f = new T.Mesh(new T.PlaneGeometry(1.5, h), fallMat); f.position.set(x, by + h / 2 - 0.3, z); g.add(f);
      for (let i = 0; i < 3; i++) { const s = new T.Sprite(new T.SpriteMaterial({ map: mistTex, transparent: true, opacity: 0.5, depthWrite: false, fog: false })); s.position.set(x + (i - 1) * 1.2, by + 0.8, z + 0.6); s.scale.set(5, 3.4, 1); g.add(s); mists.push(s); }
    }
    ups.push(t => mists.forEach((s, i) => { s.material.opacity = 0.38 + 0.16 * Math.sin(t * 1.6 + i * 1.9); s.scale.x = 5 + Math.sin(t + i) * 0.8; }));

    // buildings
    const red = new T.MeshStandardMaterial({ color: P.night ? '#6a1a22' : '#c8382a', roughness: 0.7 });
    const wall = new T.MeshStandardMaterial({ color: P.night ? '#3a1016' : '#8f2a20', roughness: 0.8, emissive: P.night ? '#ff9a3a' : '#000000', emissiveIntensity: P.night ? 0.9 : 0 });
    const roof = new T.MeshStandardMaterial({ color: P.night ? '#17121f' : '#2b3c60', roughness: 0.6, flatShading: true });
    const stone = new T.MeshStandardMaterial({ color: P.stone[0], roughness: 0.9 }), gold = new T.MeshStandardMaterial({ color: '#f2c84b', roughness: 0.4, metalness: 0.5 });
    function pavilion(x, y, z, w, tiers) {
      mesh(G.box, stone, g, w * 1.5, 0.5, w * 1.5, x, y + 0.25, z);
      let yy = y + 0.5;
      for (let i = 0; i < tiers; i++) {
        const tw = w * (1 - i * 0.2), th = w * 0.55;
        mesh(G.box, wall, g, tw * 0.8, th, tw * 0.8, x, yy + th / 2, z);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) mesh(G.cyl, red, g, tw * 0.06, th, tw * 0.06, x + sx * tw * 0.5, yy + th / 2, z + sz * tw * 0.5);
        mesh(G.cone4, roof, g, tw * 1.15, tw * 0.22, tw * 1.15, x, yy + th + tw * 0.11, z, 0, PI / 4);
        mesh(G.cone4, roof, g, tw * 0.75, tw * 0.5, tw * 0.75, x, yy + th + tw * 0.3, z, 0, PI / 4);
        yy += th + tw * 0.2;
      }
      mesh(G.sphere, gold, g, w * 0.07, w * 0.12, w * 0.07, x, yy + w * 0.34, z);
    }
    // gate at the back of the courtyard
    for (const s of [-1, 1]) { mesh(G.cyl, red, g, 0.45, 6.4, 0.45, s * 3.9, 3.2, -13.2); mesh(G.box, stone, g, 1.3, 0.5, 1.3, s * 3.9, 0.25, -13.2); }
    mesh(G.box, red, g, 9.6, 0.55, 0.6, 0, 4.7, -13.2); mesh(G.box, red, g, 10.6, 0.6, 0.8, 0, 6.2, -13.2);
    mesh(G.box, roof, g, 10.4, 0.4, 1.4, 0, 6.9, -13.2);
    mesh(G.box, roof, g, 12.2, 0.22, 2.2, 0, 6.6, -13.2);
    mesh(G.cyl, gold, g, 0.42, 0.1, 0.42, 0, 5.45, -12.85, PI / 2);
    pavilion(-10.5, 0, -14.5, 3, 2); pavilion(11, 0, -15, 3.4, 3);
    pavilion(-20, pillarLedge(-20, -10, 3.4, 30, 0.42), -6.5, 2.2, 2); pavilion(20.5, pillarLedge(20.5, -12, 3.8, 34, 0.5), -8, 2.4, 2);
    function pillarLedge(x, z, r, h, k) { const y = Math.min(ground(x, z), 0) - 2 + h * k; mesh(G.cyl, stone, g, r * 0.75, 0.5, r * 0.75, x, y, z + r * 0.9); return y + 0.2; }
    if (P.night) for (const s of [-1, 1]) { const pl = new T.PointLight('#ff8a3a', 60, 30, 2); pl.position.set(s * 4.5, 3.5, -11.5); g.add(pl); mesh(G.sphere, new T.MeshBasicMaterial({ color: '#ffb060' }), g, 0.3, 0.4, 0.3, s * 4.5, 3.6, -12.2).castShadow = false; }
    if (P.water) {
      const hull = new T.MeshStandardMaterial({ color: '#2a2030', roughness: 0.9 }), sail = new T.MeshStandardMaterial({ color: '#c8382a', roughness: 0.9, side: T.DoubleSide });
      const ship = new T.Group(); ship.position.set(13, -0.6, -34); ship.rotation.y = 0.5; g.add(ship);
      mesh(G.box, hull, ship, 11, 1.8, 3.2, 0, 0.7, 0); mesh(G.box, hull, ship, 3, 1.4, 3, 4.6, 2.2, 0);
      for (const [mx, mh] of [[-3, 8], [0.5, 10], [3.6, 7]]) { mesh(G.cyl, hull, ship, 0.14, mh, 0.14, mx, mh / 2 + 1.4, 0); mesh(G.box, sail, ship, 0.1, mh * 0.6, 3.6, mx + 0.25, mh * 0.6 + 1.6, 0); }
      ups.push(t => { ship.position.y = -0.6 + Math.sin(t * 0.8) * 0.12; ship.rotation.z = Math.sin(t * 0.6) * 0.02; });
    }

    // trees, bushes, flowers, grass
    tree(-16.5, 6.5, 13, P.greens, 0.22); tree(17, 7.5, 14, P.greens, -0.2); tree(-23, -4, 11, P.greens, 0.1); tree(23.5, -5, 12, P.greens, -0.1);
    tree(-15.5, -8.5, 6.5, blossom, 0.15); tree(16, -9, 7, blossom, -0.2); tree(-21, 12, 6, blossom, 0); tree(22, 13, 6.5, blossom, 0.1);
    for (let i = 0; i < 60; i++) {
      const a = R() * 6.283, d = 15.5 + R() * 55, x = Math.cos(a) * d, z = Math.sin(a) * d, y = ground(x, z);
      if (y < -0.3 || (Math.abs(x) < 15 && z > 8)) continue;
      if (R() < 0.3 && d > 24) tree(x, z, 6 + R() * 7, R() < 0.3 ? blossom : P.greens, (R() - 0.5) * 0.3); else bush(x, y, z, 0.7 + R() * 0.9, R() < 0.25 ? blossom : P.greens);
    }
    for (let i = 0; i < 46; i++) { const a = i / 46 * 6.283 + R() * 0.1; if (Math.abs(Math.cos(a)) < 0.3 && Math.sin(a) < 0) continue; bush(Math.cos(a) * 15.3, 0, Math.sin(a) * 15.3, 0.55 + R() * 0.4, i % 5 === 0 ? blossom : P.greens); }
    leaves.build(g); trunks.build(g); pads.build(g);
    const flowers = new Inst(G.sphere, new T.MeshLambertMaterial()), fcols = ['#ff5a3a', '#ffd23a', '#ffffff', P.blossom];
    for (let i = 0; i < 420; i++) { const a = R() * 6.283, d = 15 + R() * R() * 34, x = Math.cos(a) * d, z = Math.sin(a) * d, y = ground(x, z); if (y > -0.2) flowers.add(x, y + 0.28, z, 0.11, 0.11, 0.11, fcols[i % 4]); }
    flowers.build(g);
    const grassMat = new T.MeshLambertMaterial({ side: T.DoubleSide });
    grassMat.onBeforeCompile = sh => {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          transformed.x += sin(uTime * 2.0 + instanceMatrix[3][0] * 0.5 + instanceMatrix[3][2] * 0.7) * 0.3 * position.y;
        #endif`);
    };
    const grass = new Inst(G.blade, grassMat);
    for (let i = 0, n = hi ? 9000 : 2500; i < n; i++) { const a = R() * 6.283, d = 14.9 + R() * R() * 38, x = Math.cos(a) * d, z = Math.sin(a) * d, y = ground(x, z); if (y > -0.25) grass.add(x, y, z, 1.4, 1 + R() * 1.4, 1.4, mix(P.grass[0], R() < 0.5 ? P.grass[1] : '#ffffff', R() * 0.45), R() * 6.283); }
    grass.build(g);

    // drifting petals / embers / rain
    const kind = P.amb, n = kind === 'rain' ? 420 : 150;
    const pm = new T.InstancedMesh(kind === 'ember' ? G.sphere : petalGeo, new T.MeshBasicMaterial({ color: kind === 'ember' ? '#ff9a3a' : kind === 'rain' ? '#c8d8f0' : mix(P.blossom, '#ffffff', 0.3), side: T.DoubleSide, transparent: true, opacity: kind === 'rain' ? 0.5 : 0.9 }), n);
    pm.frustumCulled = false; g.add(pm);
    const parts = Array.from({ length: n }, () => ({ x: (R() - 0.5) * 50, y: R() * 18, z: -14 + R() * 30, v: 0.5 + R(), p: R() * 6 })), o = new T.Object3D();
    let last = 0;
    ups.push(t => {
      const dt = Math.min(0.1, Math.max(0, t - last)); last = t;
      parts.forEach((a, i) => {
        if (kind === 'rain') { a.y -= 26 * a.v * dt; a.x -= 4 * dt; o.scale.set(0.03, 1.2, 1); o.rotation.set(0, 0, -0.15); }
        else if (kind === 'ember') { a.y += 1.4 * a.v * dt; a.x += Math.sin(t * 2 + a.p) * 0.6 * dt; const s = 0.05 + 0.03 * Math.sin(t * 5 + a.p); o.scale.set(s, s, s); }
        else { a.y -= 1.1 * a.v * dt; a.x += (Math.sin(t * 1.3 + a.p) * 1.2 - 0.7) * dt; o.scale.set(0.22, 0.22, 0.22); o.rotation.set(t * a.v * 2 + a.p, t * 1.3 + a.p, a.p); }
        if (a.y < 0) { a.y = 18; a.x = (R() - 0.5) * 50; } if (a.y > 18) a.y = 0; if (a.x < -25) a.x = 25;
        o.position.set(a.x, a.y, a.z); o.updateMatrix(); pm.setMatrixAt(i, o.matrix);
      });
      pm.instanceMatrix.needsUpdate = true;
    });

    if (P.dragon) ups.push(buildDragon(g, P.dragon));
    scene.add(g);
    return { g, update(t) { uTime.value = t; for (const f of ups) f(t); } };
  }

  // ---------- dragon ----------
  function buildDragon(parent, color) {
    const N = 110, grp = new T.Group(); parent.add(grp);
    const bodyMat = new T.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.25 }), white = new T.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 }), horn = new T.MeshStandardMaterial({ color: '#f4e2a8', roughness: 0.5 });
    const belly = new T.MeshStandardMaterial({ color: mix(color, '#ffffff', 0.6), roughness: 0.5 });
    const body = new T.InstancedMesh(G.sphere, bodyMat, N), under = new T.InstancedMesh(G.sphere, belly, N), mane = new T.InstancedMesh(G.cone, white, Math.floor(N / 2));
    for (const m of [body, under, mane]) { m.frustumCulled = false; grp.add(m); }
    const head = new T.Group(); grp.add(head);
    mesh(G.sphere, bodyMat, head, 1.5, 1.35, 2.3, 0, 0, 0.4); mesh(G.sphere, bodyMat, head, 1.05, 0.8, 1.7, 0, -0.25, 2.3); mesh(G.sphere, belly, head, 0.9, 0.5, 1.6, 0, -0.75, 1.9);
    for (const s of [-1, 1]) {
      mesh(G.cone, horn, head, 0.2, 2.8, 0.2, s * 0.8, 1.7, -0.9, -0.9, 0, -s * 0.25); mesh(G.cone, horn, head, 0.13, 1.2, 0.13, s * 1.0, 1.9, -0.2, -0.3, 0, -s * 0.5);
      mesh(G.sphere, new T.MeshBasicMaterial({ color: '#ffffff' }), head, 0.3, 0.3, 0.2, s * 1.05, 0.5, 1.5); mesh(G.sphere, new T.MeshBasicMaterial({ color: '#10203a' }), head, 0.15, 0.2, 0.12, s * 1.15, 0.5, 1.68);
      for (let k = 0; k < 4; k++) mesh(G.cone, white, head, 0.35, 2.4, 0.35, s * (1.1 + k * 0.1), 0.3 - k * 0.5, -1.2, -1.9, 0, -s * 0.6);
    }
    const whisk = [-1, 1].map(s => { const w = new T.Group(); w.position.set(s * 0.7, -0.2, 3.4); head.add(w); mesh(G.cone, belly, w, 0.07, 5, 0.07, 0, 0, 2.3, PI / 2); return w; });
    grp.traverse(m => { m.castShadow = false; m.receiveShadow = false; });
    const o = new T.Object3D(), p = new T.Vector3(), q = new T.Vector3();
    const at = (t, u, v) => { const a = t * 0.3 - u * 3.9; return v.set(46 * Math.cos(a) + 5 * Math.sin(3 * a), 24 + 8 * Math.sin(a * 1.7) + 2.5 * Math.cos(2.3 * a + t * 0.4), -46 + 20 * Math.sin(a) + 4 * Math.cos(2 * a)); };
    return t => {
      for (let i = 0; i < N; i++) {
        const u = i / N, r = (0.3 + 1.55 * Math.pow(1 - u, 0.7)) * Math.min(1, 0.6 + i / 14);
        at(t, u, p); at(t, u + 0.004, q);
        o.position.copy(p); o.lookAt(q); o.scale.set(r, r, r * 1.5); o.updateMatrix(); body.setMatrixAt(i, o.matrix);
        o.position.y -= r * 0.35; o.scale.set(r * 0.8, r * 0.8, r * 1.5); o.updateMatrix(); under.setMatrixAt(i, o.matrix);
        if (i % 2 === 0) { o.position.copy(p); o.position.y += r * 0.9; o.rotation.set(0.6, 0, 0); o.scale.set(r * 0.35, r * 1.5, r * 0.35); o.updateMatrix(); mane.setMatrixAt(i / 2, o.matrix); }
      }
      body.instanceMatrix.needsUpdate = under.instanceMatrix.needsUpdate = mane.instanceMatrix.needsUpdate = true;
      at(t, 0, p); at(t, -0.012, q); head.position.copy(p); head.lookAt(q);
      whisk.forEach((w, i) => { w.rotation.set(Math.sin(t * 2.4 + i) * 0.25, (i ? 1 : -1) * 0.5 + Math.sin(t * 2 + i * 2) * 0.2, 0); });
    };
  }

  // ---------- ninjas ----------
  const fm = (color, o) => new T.MeshStandardMaterial(Object.assign({ color, roughness: 0.75 }, o));
  function buildFigure(d) {
    const root = new T.Group(), body = new T.Group(); root.add(body);
    const elc = ELEMENTS[d.el].color, cloth = mix(d.cloth || '#34449a', '#ffffff', d.cloth ? 0.18 : 0);
    const M = { cloth: fm(cloth), dark: fm(mix(cloth, '#000000', 0.4)), el: fm(elc, { emissive: elc, emissiveIntensity: 0.3 }), skin: fm(d.boss ? '#cfc8be' : '#f0c9a0'),
      white: fm('#ffffff'), black: fm('#16121c'), steel: fm('#e8eef6', { metalness: 0.7, roughness: 0.25 }), wood: fm('#6b4a2b'), gold: fm('#e2b44c', { metalness: 0.5, roughness: 0.4 }),
      red: fm('#b3202a'), straw: fm('#d8b86a'), iron: fm('#3a3a46', { metalness: 0.4, roughness: 0.5 }), eye: d.boss ? fm('#ff3b2f', { emissive: '#ff2a1a', emissiveIntensity: 2 }) : fm(d.hat === 'mask' ? '#ffe26a' : '#ffffff') };
    const hips = [-1, 1].map(s => { const h = new T.Group(); h.position.set(s * 0.19, 0.62, 0); body.add(h); mesh(G.cyl, M.dark, h, 0.15, 0.52, 0.15, 0, -0.27, 0); mesh(G.box, M.black, h, 0.22, 0.13, 0.36, 0, -0.56, 0.07); return h; });
    mesh(G.cyl, M.cloth, body, 0.4, 0.8, 0.38, 0, 1.0, 0); mesh(G.sphere, M.cloth, body, 0.43, 0.24, 0.4, 0, 1.38, 0);
    mesh(G.cyl, M.el, body, 0.43, 0.13, 0.41, 0, 0.74, 0); mesh(G.box, M.el, body, 0.12, 0.22, 0.08, 0.14, 0.7, 0.41);
    const head = new T.Group(); head.position.set(0, 1.84, 0); body.add(head);
    mesh(G.sphere, d.hat === 'monk' ? M.skin : M.cloth, head, 0.47, 0.47, 0.47);
    if (d.hat !== 'monk') mesh(G.face, d.hat === 'mask' ? M.red : M.skin, head, 1, 1, 1);
    if (d.hat === 'mask') mesh(G.cone, M.red, head, 0.07, 0.42, 0.07, 0, -0.04, 0.66, PI / 2);
    for (const s of [-1, 1]) {
      mesh(G.sphere, M.eye, head, 0.085, 0.1, 0.04, s * 0.16, 0.02, 0.455);
      if (!d.boss) mesh(G.sphere, M.black, head, 0.042, 0.055, 0.02, s * 0.155, 0.02, 0.488);
      mesh(G.box, M.black, head, 0.17, 0.035, 0.03, s * 0.16, 0.15, 0.455, 0, 0, s * 0.35);
    }
    mesh(G.torus, M.el, head, 0.475, 0.475, 0.9, 0, 0.19, 0, PI / 2);
    const tail = new T.Group(); tail.position.set(0, 0.19, -0.44); head.add(tail);
    for (const s of [-1, 1]) mesh(G.box, M.el, tail, 0.1, 0.025, 0.6, s * 0.08, -0.04, -0.3, 0, s * 0.2);
    const crest = () => mesh(G.crest, M.gold, head, 1, 1, 1, 0, 0.78, 0.3, 0, 0, PI);
    if (d.hat === 'straw') mesh(G.cone, M.straw, head, 0.8, 0.38, 0.8, 0, 0.5, 0);
    else if (d.hat === 'bandana') mesh(G.half, M.red, head, 0.5, 0.5, 0.5, 0, 0.06, 0);
    else if (d.hat === 'helm' || (d.boss && d.hat !== 'mask' && d.hat !== 'monk')) { mesh(G.half, M.iron, head, 0.52, 0.52, 0.52, 0, 0.05, 0); mesh(G.cyl, M.iron, head, 0.64, 0.05, 0.64, 0, 0.07, 0); crest(); }
    if (d.hat === 'monk') mesh(G.torus, M.wood, body, 0.3, 0.3, 1.3, 0, 1.45, 0, PI / 2);
    const arms = [-1, 1].map(s => { const a = new T.Group(); a.position.set(s * 0.52, 1.36, 0); body.add(a); mesh(G.cyl, M.cloth, a, 0.12, 0.5, 0.12, 0, -0.25, 0); mesh(G.sphere, M.skin, a, 0.125, 0.125, 0.125, 0, -0.55, 0); return a; });
    const wg = new T.Group(); wg.position.set(0, -0.55, 0); arms[1].add(wg);
    const k = d.kind;
    if (k === 'blade') { mesh(G.cyl, M.wood, wg, 0.04, 0.24, 0.04, 0, 0, 0, PI / 2); mesh(G.box, M.gold, wg, 0.22, 0.06, 0.05, 0, 0, 0.14); mesh(G.box, M.steel, wg, 0.075, 0.022, 1.0, 0, 0, 0.66); }
    else if (k === 'heavy') { mesh(G.cyl, M.wood, wg, 0.045, 0.6, 0.045, 0, 0, 0.18, PI / 2); mesh(G.cyl, M.iron, wg, 0.14, 0.62, 0.14, 0, 0, 0.78, PI / 2); for (let i = 0; i < 8; i++) mesh(G.sphere, M.steel, wg, 0.04, 0.04, 0.04, Math.cos(i * 2.4) * 0.14, Math.sin(i * 2.4) * 0.14, 0.55 + i * 0.065); }
    else if (k === 'staff') { mesh(G.cyl, M.wood, wg, 0.04, 2.0, 0.04, 0, 0, 0.25, PI / 2); mesh(G.cone, M.steel, wg, 0.07, 0.3, 0.07, 0, 0, 1.4, PI / 2); mesh(G.cyl, M.red, wg, 0.055, 0.1, 0.055, 0, 0, 1.2, PI / 2); }
    else if (k === 'ranged') { mesh(G.box, M.steel, wg, 0.4, 0.025, 0.1, 0, 0, 0.16, 0, 0.4); mesh(G.box, M.steel, wg, 0.1, 0.025, 0.4, 0, 0, 0.16, 0, 0.4); }
    else if (k === 'chain') { mesh(G.cyl, M.wood, wg, 0.04, 0.5, 0.04, 0, 0, 0.12, PI / 2); mesh(G.sickle, M.steel, wg, 1, 1, 1, 0, 0.22, 0.38, 0, PI / 2, 0); for (let i = 0; i < 5; i++) mesh(G.sphere, M.iron, wg, 0.035, 0.035, 0.035, 0, -0.08 - i * 0.09, -0.1 - i * 0.02); }
    let cape = null;
    if (d.boss) {
      cape = new T.Group(); cape.position.set(0, 1.42, -0.3); body.add(cape); mesh(G.box, M.red, cape, 0.98, 1.3, 0.04, 0, -0.65, -0.03);
      for (const s of [-1, 1]) mesh(G.sphere, M.gold, body, 0.21, 0.13, 0.21, s * 0.52, 1.44, 0);
    }
    root.scale.setScalar(d.s || 1);
    figGroup.add(root);
    return { root, body, hips, arms, tail, cape, mats: Object.values(M), flashMats: [M.cloth, M.dark, M.skin], dead: 0, yaw: null, ph: Math.random() * 6, kind: k };
  }
  function setFigures(defs) {
    for (const f of figs) { figGroup.remove(f.root); f.mats.forEach(m => m.dispose()); }
    figs = defs.map(buildFigure);
    return figs;
  }
  function pose(f, o) {
    const a = o.anim, run = o.run ? Math.sin(o.run) : 0, t = o.t + f.ph;
    f.root.position.set(o.x, 0, o.z); f.root.rotation.y = o.yaw;
    f.hips[0].rotation.x = run * 0.9; f.hips[1].rotation.x = -run * 0.9;
    f.arms[0].rotation.set(-run * 0.7, 0, -0.18);
    f.arms[1].rotation.set(a > 0 ? -2.8 + (1 - a) * 2.5 : -1.0 + Math.sin(t * 2) * 0.06 + run * 0.3, 0, 0.12);
    f.tail.rotation.x = 0.35 + Math.sin(t * 6) * 0.22 + Math.abs(run) * 0.3;
    if (f.cape) f.cape.rotation.x = 0.22 + Math.sin(t * 3) * 0.08 + Math.abs(run) * 0.4;
    f.dead = o.alive ? 0 : Math.min(1, f.dead + 0.09);
    f.body.rotation.x = -f.dead * 1.5; f.body.position.y = (o.alive ? Math.sin(t * 5) * 0.03 : 0) + f.dead * 0.32;
    const fl = Math.min(0.7, (o.flash || 0) * 5);
    for (const m of f.flashMats) m.emissive.setScalar(fl);
  }

  // ---------- frame plumbing ----------
  function size(w, h) {
    if (w === curW && h === curH) return;
    curW = w; curH = h; renderer.setPixelRatio(1); renderer.setSize(w, h, false);
  }
  function setWorld(key) {
    if (worldKey === key && world) return;
    if (world) { scene.remove(world.g); disposeTree(world.g); }
    world = buildWorld(key); worldKey = key;
  }
  const wx = x => (x - 450) / 36, wz = y => (y - 328) / 22;
  const v1 = new T.Vector3(), v2 = new T.Vector3();

  api.startBattle = (key, units) => {
    setWorld(key); heroSig = null;
    setFigures(units.map(u => ({ el: u.el, kind: u.kind, boss: u.boss, cloth: u.cloth, hat: u.hat, s: u.scale / 1.3 * 1.22 }))).forEach((f, i) => { units[i].fig = f; });
  };
  api.battleFrame = (units, t, shake, since) => {
    const wrap = renderer.domElement.parentElement, pr = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : 1);
    size(Math.max(2, Math.round(wrap.clientWidth * pr)), Math.max(2, Math.round(wrap.clientWidth * H2 / W2 * pr)));
    for (const u of units) {
      const f = u.fig; if (!f) continue;
      const x = wx(u.x), z = wz(u.y), tg = u.target;
      let yaw = u.side === 0 ? PI / 2 : -PI / 2;
      if (tg && u.hp > 0) yaw = Math.atan2(wx(tg.x) - x, wz(tg.y) - z);
      if (f.yaw == null) f.yaw = yaw;
      let dy = yaw - f.yaw; while (dy > PI) dy -= PI * 2; while (dy < -PI) dy += PI * 2; f.yaw += dy * 0.2;
      const a = u.anim / 0.25, lunge = u.anim > 0 && u.kind !== 'ranged' ? Math.sin(a * PI) * 0.55 : 0, fy = f.yaw * 0.72;
      pose(f, { x: x + Math.sin(f.yaw) * lunge, z: z + Math.cos(f.yaw) * lunge, yaw: fy, anim: u.anim > 0 ? a : 0, run: u.run, t, alive: u.hp > 0, flash: u.flash });
    }
    const k = 1 - Math.min(1, since / 1.8), e = k * k * k, sw = Math.sin(performance.now() / 9000) * 1.4;
    camera.fov = 42; camera.aspect = W2 / H2; camera.updateProjectionMatrix();
    camera.position.set(sw + e * 10 + (Math.random() - 0.5) * shake * 0.04, 5.6 + e * 16 + (Math.random() - 0.5) * shake * 0.04, 20 + e * 26);
    camera.lookAt(sw * 0.3, 3.3 + e * 9, -2);
    camera.updateMatrixWorld();
    world.update(performance.now() / 1000);
    renderer.render(scene, camera);
  };
  // sim-space point (ground x, y, height in px) -> overlay canvas coordinates
  api.project = (x, y, h) => {
    v1.set(wx(x), h * 1.02 / 36, wz(y)); v2.copy(v1); v2.y += 1;
    v1.project(camera); v2.project(camera);
    return { x: (v1.x * 0.5 + 0.5) * W2, y: (-v1.y * 0.5 + 0.5) * H2, k: Math.max(0.6, Math.min(1.5, (v2.y - v1.y) * 0.5 * H2 / 36 / 0.85)) };
  };
  api.heroFrame = (canvas, key, team, t) => {
    setWorld(key);
    const sig = key + '|' + team.map(n => n.el + n.kind).join(',');
    if (sig !== heroSig) { heroSig = sig; setFigures(team.map(n => ({ el: n.el, kind: n.kind, s: 1 }))); }
    const pr = quality === 'high' ? 1 : 0.6;
    size(Math.round(canvas.width * pr), Math.round(canvas.height * pr));
    figs.forEach((f, i) => pose(f, { x: (i - (figs.length - 1) / 2) * 1.9, z: 2 + (i % 2) * 1.1, yaw: ((figs.length - 1) / 2 - i) * 0.12, anim: 0, run: 0, t, alive: true }));
    camera.fov = 30; camera.aspect = canvas.width / canvas.height; camera.updateProjectionMatrix();
    camera.position.set(Math.sin(t * 0.12) * 3, 3.4, 15.5); camera.lookAt(0, 3.3, 0);
    world.update(t);
    renderer.render(scene, camera);
    canvas.getContext('2d').drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
  };
  api.setQuality = q => { if (q === quality) return; quality = q; if (world) { scene.remove(world.g); disposeTree(world.g); world = null; } };
  api.ok = true;
  return api;
})();
