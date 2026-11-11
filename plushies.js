/* ==============================================================
   SNUGGLEVALE CORNER — THE PLUSHIES
   How each plushie looks and where they stand.
   What they SAY is in what-they-say.js, not here.

   Each plushie is built from simple soft shapes. The helpers
   (kit.ball, kit.stick and friends) are explained in
   "START HERE - guide for helpers.md".

   spot:  x = left/right, z = toward/away from you (smaller z is
          closer to the workshop), facing = which way they turn
          when no one is near (0 faces down the path).
   Ground map: workshop door at x 0, z -4.8. Path runs from the
   door toward z 15. Blossom tree at x -6.3, z 0.1.
   Keep plushies at least 2 steps apart and off the path.

   Looks follow Lila's character registry and reference pictures.
   Where the pictures and the written notes differ, the pictures win.
   ============================================================== */

window.PLUSHIES = window.PLUSHIES || [];

/* ---------- Plushsmith ---------- */
window.PLUSHIES.push({
  name: "Plushsmith",
  spot: { x: -1.75, z: -3.55, facing: 0.3 },
  build(kit, p) {
    const { THREE, toon, ball, stick, heartGeo, smileGeo, blush, patchTex, hlMat, AMP } = kit;
    const I = p.inner; p.headY = 1.9;
    const peach = toon(0xf6b49a), peachD = toon(0xe99a82), lav = toon(0xc4ade8), dark = toon(0x3a2430);
    // body and patchwork apron
    const body = new THREE.Group(); body.position.y = 0.78; body.scale.set(1, 1.12, 0.95); I.add(body);
    body.add(ball(0.62, peach));
    body.add(new THREE.Mesh(new THREE.SphereGeometry(0.64, 28, 20, Math.PI/2 - 0.95, 1.9, 0.85, 1.6), toon(0xffffff, { map: patchTex() })));
    // apron pocket with a spool and a needle
    stick(body, new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.05), toon(0xf3e3d3)), 0.645, 0.2, -0.24, 0.012);
    const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.12, 12), toon(0xe56f8c)); stick(body, spool, 0.645, 0.15, -0.1, 0.04);
    const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6), toon(0xdfe3ea)); stick(body, needle, 0.645, 0.27, -0.08, 0.03); needle.rotateZ(-0.4);
    // feet
    for (const s of [-1, 1]) { const f = ball(0.2, peachD, 1.1, 0.6, 1.35); f.position.set(0.24*s, 0.1, 0.14); I.add(f); }
    // arms (the right one waves)
    for (const s of [-1, 1]) {
      const piv = new THREE.Group(); piv.position.set(0.56*s, 1.18, 0.02);
      const arm = ball(0.16, peach, 1, 2.0, 1); arm.position.y = -0.28; piv.add(arm);
      piv.rotation.z = 0.42*s; piv.userData.base = 0.42*s; I.add(piv);
      if (s === 1) p.waveArm = piv;
    }
    p.waveSign = 1;
    // head
    const head = new THREE.Group(); head.position.y = 1.82; I.add(head); p.head = head; const R = 0.5;
    head.add(ball(R, peach));
    // the seam down the middle of her face
    const seamG = new THREE.Group(); seamG.rotation.y = -Math.PI/2;
    const seam = new THREE.Mesh(new THREE.TorusGeometry(R + 0.004, 0.008, 4, 48, 2.5), toon(0xd98670)); seam.rotation.z = -1.25; seamG.add(seam); head.add(seamG);
    // lavender hair with a messy top bun and loose side strands
    const cap = new THREE.Mesh(new THREE.SphereGeometry(R + 0.03, 28, 16, 0, Math.PI*2, 0, 1.05), lav); cap.rotation.x = -0.42; head.add(cap);
    const bun = ball(0.24, lav, 1, 0.9, 1); bun.position.set(0, R + 0.16, -0.14); head.add(bun);
    const b2 = ball(0.12, lav); b2.position.set(0.16, R + 0.3, -0.06); head.add(b2);
    const b3 = ball(0.1, lav); b3.position.set(-0.15, R + 0.27, -0.2); head.add(b3);
    for (const s of [-1, 1]) {
      const st = ball(0.055, lav, 1, 3.2, 1, 12); st.position.set(0.44*s, -0.06, 0.24); st.rotation.z = 0.18*s; head.add(st);
      const ear = ball(0.12, peachD, 0.55, 1, 1); ear.position.set(0.5*s, 0.04, -0.04); head.add(ear);
    }
    // heart eyes, blush, nose, stitched smile
    const hg = heartGeo(0.06, 0.02);
    for (const s of [-1, 1]) {
      const e = new THREE.Group(); e.add(new THREE.Mesh(hg, dark));
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 6), hlMat); hl.position.set(0.025, 0.022, 0.02); e.add(hl);
      stick(head, e, R, 0.17*s, 0.06, 0.012);
      stick(head, blush(0.075), R, 0.3*s, -0.1, 0.006);
    }
    stick(head, ball(0.045, peachD, 1, 1, 1, 12), R, 0, -0.05, 0);
    stick(head, new THREE.Mesh(smileGeo(0.075, 0.012), dark), R, 0, -0.1, 0.026);
    // gentle sway while she stands
    p.idle = (t) => { p.inner.rotation.z = Math.sin(t*0.9 + p.phase)*0.03*AMP; head.rotation.z = Math.sin(t*0.7)*0.04*AMP; };
  }
});

/* ---------- Muddle ---------- */
window.PLUSHIES.push({
  name: "Muddle",
  spot: { x: 1.65, z: -3.7, facing: -0.25 },
  build(kit, p) {
    const { THREE, toon, ball, stick, heartGeo, shieldGeo, starGeo, smileGeo, blush, eye, AMP } = kit;
    const I = p.inner; p.headY = 1.3;
    const cream = toon(0xf7ead2), creamD = toon(0xead6b6), lilac = toon(0xd7bde8), dark = 0x2f2226, brown = toon(0x7a4a35);
    // body with his coral heart
    const body = new THREE.Group(); body.position.y = 0.55; body.scale.set(1.05, 1, 0.95); I.add(body);
    body.add(ball(0.5, cream));
    stick(body, new THREE.Mesh(heartGeo(0.07, 0.03), toon(0xff8b7b)), 0.5, 0, -0.08, 0.012);
    // his badge: always on. Gold shield with a star.
    const badge = new THREE.Group();
    badge.add(new THREE.Mesh(shieldGeo(0.075), toon(0xe9b949, { emissive: 0x3a2a00 })));
    const star = new THREE.Mesh(starGeo(0.045), toon(0xfff3d0)); star.position.z = 0.022; badge.add(star);
    stick(body, badge, 0.5, 0.2, 0.17, 0.012);
    // feet
    for (const s of [-1, 1]) { const f = ball(0.17, creamD, 1, 0.55, 1.45); f.position.set(0.22*s, 0.08, 0.2); I.add(f); }
    // arms (the left one waves)
    for (const s of [-1, 1]) {
      const piv = new THREE.Group(); piv.position.set(0.48*s, 0.78, 0.02);
      const arm = ball(0.13, cream, 1, 1.7, 1); arm.position.y = -0.2; piv.add(arm);
      piv.rotation.z = 0.35*s; piv.userData.base = 0.35*s; I.add(piv);
      if (s === -1) p.waveArm = piv;
    }
    p.waveSign = -1;
    // little tail
    const tail = ball(0.13, toon(0xffffff)); tail.position.set(0, 0.35, -0.5); I.add(tail);
    // head with upright ears, lilac inside
    const head = new THREE.Group(); head.position.y = 1.18; I.add(head); p.head = head; const R = 0.42;
    head.add(ball(R, cream));
    const ears = [];
    for (const s of [-1, 1]) {
      const eg = new THREE.Group(); eg.position.set(0.16*s, R*0.82, -0.02); eg.rotation.z = -0.12*s;
      const ear = ball(0.11, cream, 0.75, 2.7, 0.55); ear.position.y = 0.26; eg.add(ear);
      const inn = ball(0.065, lilac, 0.65, 2.4, 0.3); inn.position.set(0, 0.26, 0.045); eg.add(inn);
      head.add(eg); ears.push(eg);
      stick(head, eye(0.045, dark), R, 0.13*s, 0.06, 0);
      stick(head, blush(0.05), R, 0.24*s, -0.07, 0.005);
    }
    // brown triangle nose and smile
    const tri = new THREE.Shape(); tri.moveTo(0, -0.032); tri.lineTo(-0.042, 0.022); tri.lineTo(0.042, 0.022); tri.closePath();
    stick(head, new THREE.Mesh(new THREE.ShapeGeometry(tri), brown), R, 0, -0.04, 0.006);
    stick(head, new THREE.Mesh(smileGeo(0.05, 0.01), toon(dark)), R, 0, -0.08, 0.02);
    // when no one is near he looks around, keeping watch
    p.idle = (t, far) => {
      head.rotation.y = far ? Math.sin(t*0.45 + p.phase)*0.45*AMP : head.rotation.y*0.9;
      ears[0].rotation.z = 0.12 + Math.sin(t*1.3)*0.05*AMP;
      ears[1].rotation.z = -0.12 - Math.sin(t*1.3 + 1)*0.05*AMP;
    };
  }
});

/* ---------- SnuggleCat (original look, no bow) ---------- */
window.PLUSHIES.push({
  name: "SnuggleCat",
  spot: { x: -4.75, z: 1.75, facing: 0.55 },
  build(kit, p) {
    const { THREE, toon, ball, stick, smileGeo, blush, eye, AMP } = kit;
    const I = p.inner; p.baseY = 0.3; p.headY = 1.5;
    const teal = toon(0x74d3c4), tealD = toon(0x62c2b3), pink = toon(0xf7a8bb), cream = toon(0xfdf1e0), nose = toon(0x7a4a35), wh = toon(0x3e7f77);
    // her lavender cushion with little tufts
    const cush = ball(0.8, toon(0xc9b6e8), 1, 0.28, 1); cush.position.y = 0.2; p.outer.add(cush);
    for (let i = 0; i < 4; i++) { const a = Math.PI/4 + i*Math.PI/2; const ts = ball(0.07, toon(0xf3c3cf), 1, 1, 1, 10); ts.position.set(Math.cos(a)*0.74, 0.2, Math.sin(a)*0.74); p.outer.add(ts); }
    // round chubby body, haunches, paws with pink paw-pad dots
    const body = new THREE.Group(); body.position.y = 0.38; body.scale.set(1.1, 0.85, 1); I.add(body); body.add(ball(0.46, teal));
    for (const s of [-1, 1]) {
      const hp = ball(0.2, tealD, 1.2, 0.8, 1.3); hp.position.set(0.36*s, 0.12, 0.05); I.add(hp);
      const paw = ball(0.13, teal, 1, 0.7, 1.3); paw.position.set(0.2*s, 0.08, 0.36); I.add(paw);
      for (let k = -1; k <= 1; k++) { const d = ball(0.022, pink, 1, 1, 1, 8); d.position.set(0.2*s + k*0.045, 0.1, 0.52); I.add(d); }
    }
    // tail curled around her
    const tailG = new THREE.Group(); tailG.position.set(0, 0.1, 0); I.add(tailG);
    const tail = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.07, 8, 24, Math.PI*0.85), teal); tail.rotation.x = -Math.PI/2; tail.rotation.z = Math.PI*1.05; tailG.add(tail);
    // big round head, pink inner ears, big dark-brown eyes, whiskers, cream muzzle
    const head = new THREE.Group(); head.position.y = 1.0; I.add(head); p.head = head; const R = 0.5;
    head.add(ball(R, teal));
    const eyes = [];
    for (const s of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.3, 16), teal); ear.position.set(0.3*s, 0.4, -0.02); ear.rotation.z = -0.4*s; head.add(ear);
      const ein = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.19, 16), pink); ein.scale.z = 0.45; ein.position.set(0.3*s - 0.01*s, 0.38, 0.06); ein.rotation.z = -0.4*s; head.add(ein);
      const e = eye(0.085, 0x4b2c22); stick(head, e, R, 0.19*s, 0.07, 0); eyes.push(e);
      stick(head, blush(0.07), R, 0.31*s, -0.12, 0.006);
      const wg = new THREE.Group();
      for (let k = -1; k <= 1; k++) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.2, 4), wh); w.rotation.z = Math.PI/2 + k*0.18*s; w.position.set(0.09*s, k*0.035, 0); wg.add(w); }
      stick(head, wg, R, 0.25*s, -0.15, 0.04);
    }
    stick(head, ball(0.16, cream, 1.35, 0.85, 0.75), R, 0, -0.14, -0.05);
    stick(head, ball(0.04, nose, 1.3, 1, 0.8, 12), R, 0, -0.08, 0.07);
    stick(head, new THREE.Mesh(smileGeo(0.06, 0.011), toon(0x4b2c22)), R, 0, -0.15, 0.1);
    // slow tail swish, head tilt, and blinks
    let nextBlink = 2 + Math.random()*3, blinkT = -1;
    p.idle = (t, far, dt) => {
      tailG.rotation.y = Math.sin(t*0.8)*0.12*AMP;
      head.rotation.z = Math.sin(t*0.5 + p.phase)*0.05*AMP;
      nextBlink -= dt; if (nextBlink <= 0) { blinkT = 0; nextBlink = 3 + Math.random()*4; }
      let sy = 1;
      if (blinkT >= 0) { blinkT += dt; sy = blinkT < 0.18 ? Math.max(0.1, 1 - Math.sin(blinkT/0.18*Math.PI)*0.9) : 1; if (blinkT > 0.18) blinkT = -1; }
      eyes.forEach(e => e.scale.y = sy);
    };
    p.headTilt = true;   // she tilts her head instead of waving
  }
});

/* ---------- Tilda and her Wonderloop Path ----------
   Look: Lila's reference photo (PlushworldDocs/reference-photos/02-whispermind-quartet/tilda-01.png),
   as the registry says the photo wins: a curving question-mark shape, peach at the top
   into dusty blue into lavender at the base, gold star eyes, a small curved smile,
   stubby arm nubs, gold question marks stitched across her.
   Movement, from 4o's game profile for her: she bounces in loops trailing question marks,
   twirls hello, makes a quiet "bing" and a sparkle burst when hugged, and when Lila is sad
   she grows quieter: her question marks dim and her bouncing slows.
   Her place, from 4o's world map: "A spiraling ribbon trail that changes each time you
   walk it... tiny question-marks float in the air." It sits east, like her Twirl Zone
   in Fort Hope. */
(function(){
  const shared = { glow: 1 };   // shared by Tilda and her path: how brightly the question marks shine
  function questionTex(kit, color) {
    return kit.canvasTex(64, (x, s) => {
      x.fillStyle = color; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "bold 52px Georgia, 'Times New Roman', serif"; x.fillText("?", s/2, s/2 + 3);
    });
  }

  window.PLUSHIES.push({
    name: "Tilda",
    spot: { x: 5.6, z: 1.2, facing: -1.1 },

    place(kit, spot) {
      const { THREE, V3, scene, toon, AMP } = kit;
      // a little sandy path over from the main path
      kit.path([[2.2, 2.6], [3.3, 2.1], [4.2, 1.7]], 0.5);
      // the spiral ribbon: its colors start somewhere new each visit, so it changes each time
      const bands = [0xf4b6a3, 0xa9cdd2, 0xc4b5e3, 0xf6dfa0];
      const start = Math.random() * Math.PI * 2, shift = Math.floor(Math.random() * bands.length);
      const N = 150, turns = 2.3, r0 = 0.55, r1 = 1.75, w = 0.32;
      const verts = [], cols = [], idx = [], c = new THREE.Color();
      for (let i = 0; i <= N; i++) {
        const u = i / N, a = start + u * turns * Math.PI * 2, r = r0 + (r1 - r0) * u;
        const cx = Math.cos(a) * r, cz = Math.sin(a) * r;
        const nx = Math.cos(a), nz = Math.sin(a);        // outward, across the ribbon
        verts.push(cx - nx * w/2, 0, cz - nz * w/2,  cx + nx * w/2, 0, cz + nz * w/2);
        c.setHex(bands[(Math.floor(u * 18) + shift) % bands.length]);
        cols.push(c.r, c.g, c.b, c.r, c.g, c.b);
        if (i < N) { const k = i * 2; idx.push(k, k+1, k+2, k+1, k+3, k+2); }
        kit.keepClear(spot.x + cx, spot.z + cz);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      g.setIndex(idx); g.computeVertexNormals();
      const ribbon = new THREE.Mesh(g, toon(0xffffff, { vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
      ribbon.position.set(spot.x, 0.02, spot.z); ribbon.receiveShadow = true; scene.add(ribbon);
      // tiny question marks floating in the air
      const tex = questionTex(kit, "#f2c46d"), floaters = [];
      for (let i = 0; i < 9; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
        const sc = 0.22 + Math.random() * 0.14; s.scale.set(sc, sc, 1); scene.add(s);
        floaters.push({ s, a: Math.random() * 6.3, r: 0.9 + Math.random() * 1.1, h: 0.8 + Math.random() * 1.3, sp: 0.15 + Math.random() * 0.2, ph: Math.random() * 6 });
      }
      kit.onFrame((t) => {
        for (const f of floaters) {
          const a = f.a + t * f.sp * (0.4 + 0.6 * shared.glow) * AMP;
          f.s.position.set(spot.x + Math.cos(a) * f.r, f.h + Math.sin(t * 0.8 + f.ph) * 0.18 * AMP, spot.z + Math.sin(a) * f.r);
          f.s.material.opacity = 0.25 + 0.65 * shared.glow;
        }
      });
    },

    build(kit, p) {
      const { THREE, V3, toon, ball, stick, starGeo, smileGeo, AMP } = kit;
      const I = p.inner; p.headY = 1.7;
      // her body: one soft curl, thick in the middle and thin at both tips
      const pts = [[-0.40,1.10],[-0.48,1.38],[-0.25,1.62],[0.10,1.66],[0.32,1.45],[0.25,1.10],[0.00,0.80],[-0.25,0.50],[-0.20,0.24],[0.10,0.17],[0.40,0.28],[0.50,0.52]]
        .map(a => new V3(a[0], a[1] + 0.06, 0));
      const curve = new THREE.CatmullRomCurve3(pts);
      const TS = 120, RS = 18, R0 = 0.3;
      const prof = [[0,0.07],[0.1,0.15],[0.25,0.24],[0.4,0.31],[0.55,0.30],[0.7,0.27],[0.85,0.23],[0.95,0.15],[1,0.09]];
      const rad = u => { for (let i = 1; i < prof.length; i++) if (u <= prof[i][0]) { const a = prof[i-1], b = prof[i], k = (u - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * k; } return 0.09; };
      const peach = new THREE.Color(0xf2b19c), blue = new THREE.Color(0x9db8bd), lav = new THREE.Color(0xa99bc9), tc = new THREE.Color();
      const sm = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
      const grad = u => u < 0.6 ? tc.copy(peach).lerp(blue, sm((u - 0.3) / 0.3)) : tc.copy(blue).lerp(lav, sm((u - 0.62) / 0.28));
      const geo = new THREE.TubeGeometry(curve, TS, R0, RS, false);
      const pos = geo.attributes.position, cols = [], P = new V3(), V = new V3();
      for (let i = 0; i < pos.count; i++) {
        const u = Math.floor(i / (RS + 1)) / TS; curve.getPointAt(u, P);
        V.fromBufferAttribute(pos, i).sub(P).multiplyScalar(rad(u) / R0).add(P); pos.setXYZ(i, V.x, V.y, V.z);
        const cc = grad(u); cols.push(cc.r, cc.g, cc.b);
      }
      geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3)); geo.computeVertexNormals();
      const felt = toon(0xffffff, { vertexColors: true });
      const body = new THREE.Group(); I.add(body);
      body.add(new THREE.Mesh(geo, felt));
      for (const u of [0, 1]) { const tip = ball(rad(u), toon(grad(u).getHex()), 1, 1, 1, 16); curve.getPointAt(u, tip.position); body.add(tip); }
      // little arm nubs: blue on one side, peach on the other
      const at = u => curve.getPointAt(u, new V3());
      const L = at(0.62), Rt = at(0.47);
      const nubL = ball(0.09, toon(0x9db8bd), 1.7, 0.9, 1); nubL.position.set(L.x - 0.3, L.y + 0.06, 0.02); nubL.rotation.z = 0.35; body.add(nubL);
      const nubR = ball(0.09, toon(0xf2b19c), 1.7, 0.9, 1); nubR.position.set(Rt.x + 0.33, Rt.y - 0.08, 0.02); nubR.rotation.z = -0.3; body.add(nubR);
      // face: gold star eyes and a small curved smile
      const F = at(0.42), fr = rad(0.42);
      const face = new THREE.Group(); face.position.copy(F); body.add(face); p.head = face;
      const gold = toon(0xe0aa48, { emissive: 0x3a2600 });
      for (const s of [-1, 1]) stick(face, new THREE.Mesh(starGeo(0.05), gold), fr, 0.11 * s, 0.07, 0.01);
      stick(face, new THREE.Mesh(smileGeo(0.06, 0.011), gold), fr, 0, -0.03, 0.012);
      // gold question marks stitched across her lower body
      const qMat = new THREE.MeshBasicMaterial({ map: questionTex(kit, "#c8923c"), transparent: true, depthWrite: false });
      [[0.58,-0.12],[0.66,0.1],[0.74,-0.05],[0.82,0.12],[0.88,-0.1],[0.94,0.06]].forEach(([u, dx]) => {
        const c = at(u), q = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.11), qMat);
        q.position.set(c.x + dx, c.y + 0.02, rad(u) * 0.93); body.add(q);
      });
      // sparkle burst for hugs
      const sparkTex = kit.canvasTex(32, (x, s) => { x.fillStyle = "#fff3c4"; x.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 4 : 15; x.lineTo(s/2 + Math.cos(a) * r, s/2 + Math.sin(a) * r); } x.closePath(); x.fill(); });
      const sparks = [];
      for (let i = 0; i < 14; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sparkTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sp.visible = false; sp.scale.set(0.16, 0.16, 1); I.add(sp); sparks.push({ sp, v: new V3() }); }
      let sparkT = 9;
      p.onHug = () => {
        sparkT = 0; kit.chime(1568);
        sparks.forEach(s => { s.sp.visible = true; s.sp.position.set(0.15, 1.35, 0.25); s.v.set((Math.random() - 0.5) * 2.2, 0.6 + Math.random() * 1.6, (Math.random() - 0.2) * 1.4); });
      };
      p.quietT = 0;
      p.onMood = (m) => { if (m === "sad") p.quietT = 25; };   // she grows quieter for a while
      const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      p.idle = (t, far, dt) => {
        const quiet = p.quietT > 0; if (quiet) p.quietT -= dt;
        shared.glow += ((quiet ? 0.3 : 1) - shared.glow) * Math.min(1, dt * 1.5);
        const speed = quiet ? 1.3 : 3.2, amp = (quiet ? 0.025 : 0.11) * AMP;
        p.inner.position.y += Math.abs(Math.sin(t * speed + p.phase)) * amp;            // bouncing in little loops
        p.inner.rotation.z = Math.sin(t * speed * 0.5) * 0.07 * AMP * (quiet ? 0.3 : 1);
        p.inner.rotation.y = (AMP === 1 && p.waveT < 1.1) ? ease(p.waveT / 1.1) * Math.PI * 2 : 0;   // a twirl hello
        qMat.opacity = 0.45 + 0.55 * shared.glow;
        if (sparkT < 1.4) {
          sparkT += dt;
          sparks.forEach(s => { s.v.y -= 2.2 * dt; s.sp.position.addScaledVector(s.v, dt); s.sp.material.opacity = Math.max(0, 1 - sparkT / 1.4); });
          if (sparkT >= 1.4) sparks.forEach(s => s.sp.visible = false);
        }
      };
    }
  });
})();

/* ---------- TEMPLATE for a new plushie ----------
   Copy the example below (from window.PLUSHIES.push to the closing });)
   to just above this template, then change the name, spot, colors and shapes.
   Then add their lines to what-they-say.js under the same name.

window.PLUSHIES.push({
  name: "NewFriend",
  spot: { x: 4.5, z: 0.5, facing: -0.8 },
  build(kit, p) {
    const { THREE, toon, ball, stick, smileGeo, blush, eye } = kit;
    const I = p.inner; p.headY = 1.4;            // how high the hug hearts start
    const fur = toon(0xf2c6de);                   // main color
    const body = ball(0.5, fur); body.position.y = 0.55; I.add(body);
    const head = new THREE.Group(); head.position.y = 1.15; I.add(head); p.head = head;
    const R = 0.42; head.add(ball(R, fur));
    for (const s of [-1, 1]) {
      stick(head, eye(0.05, 0x2f2226), R, 0.13*s, 0.05, 0);
      stick(head, blush(0.05), R, 0.24*s, -0.07, 0.005);
    }
    stick(head, new THREE.Mesh(smileGeo(0.05, 0.01), toon(0x2f2226)), R, 0, -0.08, 0.02);
  }
});
------------------------------------------------- */
