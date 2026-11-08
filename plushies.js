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
