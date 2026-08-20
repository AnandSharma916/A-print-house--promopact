/* ════════════════════════════════════════════
   A INDIA PRINT HOUSE — script.js (Rebuilt)
   Scroll Card Fan + Word-by-Word Reveal

   Ported from the standalone <script src="script.js"> IIFE to a module the
   React tree drives: the body is unchanged, but instead of self-running on
   DOMContentLoaded it runs when a page mounts and returns a teardown so a
   client-side route change does not leave stale ScrollTriggers or a second
   Lenis instance behind.

   Depends on the globals loaded by <VendorScripts variant="home">:
   gsap, ScrollTrigger, CustomEase, Lenis, Swiper, SplitType.
════════════════════════════════════════════ */
export default function initLegacyScript() {
  'use strict';

  /* Everything the teardown has to undo is registered here. */
  const disposers = [];

  if (typeof gsap !== 'undefined') {
    try {
      gsap.registerPlugin(ScrollTrigger, CustomEase);
      CustomEase.create('expo', '0.16, 1, 0.3, 1');
      CustomEase.create('cinematic', '0.77, 0, 0.175, 1');
    } catch (e) {
      console.warn("GSAP plugins registration failed, using fallback animations:", e);
    }
  }

  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];
  const isMobile = () => window.innerWidth <= 900;
  let particleSpeedMultiplier = 1.0;
  let scrollProgress = 0;
  let isHeroVisible = true;



  /* ══════════════════════════════════════════
     2. LENIS
  ══════════════════════════════════════════ */
  let lenis;
  function initLenis() {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = t => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    disposers.push(() => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    });

    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = qs(a.getAttribute('href'));
        if (target) { closeNav(); lenis.scrollTo(target, { offset: -80, duration: 1.4, easing: t => 1 - Math.pow(1 - t, 4) }); }
      });
    });
  }

  /* ══════════════════════════════════════════
     3. CURSOR
  ══════════════════════════════════════════ */
  function initCursor() {
    if (isMobile()) return;

    qsa('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.28;
        const dy = (e.clientY - r.top - r.height / 2) * 0.28;
        gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
    });
  }

  /* ══════════════════════════════════════════
     4. NAVBAR
  ══════════════════════════════════════════ */
  function initNavbar() {
    const header = qs('#site-header');
    const burger = qs('#hdr-burger');
    const overlay = qs('#nav-overlay');
    const closeBtn = qs('#no-close');

    ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => header.classList.add('scrolled'),
      onLeaveBack: () => header.classList.remove('scrolled'),
    });

    /* The menu is its own scroll container (it can outgrow a phone screen).
       Lenis calls preventDefault on wheel/touch while stopped, which would kill
       that native scroll — this attribute tells it to ignore events in here. */
    overlay.setAttribute('data-lenis-prevent', '');

    burger.addEventListener('click', () => overlay.classList.contains('open') ? closeNav() : openNav());
    closeBtn.addEventListener('click', closeNav);

    /* Collection is an accordion, so it's the one .no-link that must NOT close
       the menu — tapping it used to dismiss the whole overlay. */
    const collGroup = qs('.no-collection-group', overlay);
    const collHead = qs('.no-collection-head', overlay);

    qsa('.no-link', overlay).forEach(l => {
      if (l === collGroup) return;
      l.addEventListener('click', closeNav);
    });

    if (collGroup && collHead) {
      collHead.setAttribute('role', 'button');
      collHead.setAttribute('tabindex', '0');
      collHead.setAttribute('aria-expanded', 'false');

      const toggleCollection = () => {
        const open = collGroup.classList.toggle('open');
        collHead.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      collHead.addEventListener('click', toggleCollection);
      collHead.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCollection(); }
      });

      /* The product links themselves navigate away, so they still dismiss. */
      qsa('.no-col-link', collGroup).forEach(l => l.addEventListener('click', closeNav));
    }
  }
  function openNav() {
    qs('#nav-overlay').classList.add('open');
    qs('#hdr-burger').classList.add('open');
    /* Hides the z-index:999 social rail that otherwise sits on top of the menu. */
    document.body.classList.add('nav-open');
    if (lenis) lenis.stop();
  }
  function closeNav() {
    const overlay = qs('#nav-overlay');
    overlay.classList.remove('open');
    qs('#hdr-burger').classList.remove('open');
    document.body.classList.remove('nav-open');
    overlay.scrollTop = 0;
    /* Reopen collapsed, matching the closed state of the caret. */
    const collGroup = qs('.no-collection-group', overlay);
    if (collGroup) {
      collGroup.classList.remove('open');
      const head = qs('.no-collection-head', collGroup);
      if (head) head.setAttribute('aria-expanded', 'false');
    }
    if (lenis) lenis.start();
  }

  /* ══════════════════════════════════════════
     5. THREE.JS HERO BACKGROUND
  ══════════════════════════════════════════ */
  function initHeroCanvas() {
    const canvas = qs('#hero-canvas');
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create three separate groups of gold particles for dynamic depth-of-field sizing
    const pGroup1Count = 350;
    const pGroup2Count = 250;
    const pGroup3Count = 100;
    const count = pGroup1Count + pGroup2Count + pGroup3Count;

    const geo1 = new THREE.BufferGeometry();
    const geo2 = new THREE.BufferGeometry();
    const geo3 = new THREE.BufferGeometry();

    const pos1 = new Float32Array(pGroup1Count * 3);
    const pos2 = new Float32Array(pGroup2Count * 3);
    const pos3 = new Float32Array(pGroup3Count * 3);

    const vels = [];

    // Fill Group 1 (Small distant particles)
    for (let i = 0; i < pGroup1Count; i++) {
      pos1[i * 3] = (Math.random() - .5) * 20;
      pos1[i * 3 + 1] = (Math.random() - .5) * 12;
      pos1[i * 3 + 2] = (Math.random() - .5) * 8;
      vels.push({ x: (Math.random() - .5) * .0018, y: (Math.random() - .5) * .0018 });
    }
    // Fill Group 2 (Medium floating dust)
    for (let i = 0; i < pGroup2Count; i++) {
      pos2[i * 3] = (Math.random() - .5) * 20;
      pos2[i * 3 + 1] = (Math.random() - .5) * 12;
      pos2[i * 3 + 2] = (Math.random() - .5) * 8;
      vels.push({ x: (Math.random() - .5) * .0026, y: (Math.random() - .5) * .0026 });
    }
    // Fill Group 3 (Large foreground gold flakes)
    for (let i = 0; i < pGroup3Count; i++) {
      pos3[i * 3] = (Math.random() - .5) * 20;
      pos3[i * 3 + 1] = (Math.random() - .5) * 12;
      pos3[i * 3 + 2] = (Math.random() - .5) * 8;
      vels.push({ x: (Math.random() - .5) * .0012, y: (Math.random() - .5) * .0012 });
    }

    geo1.setAttribute('position', new THREE.BufferAttribute(pos1, 3));
    geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));
    geo3.setAttribute('position', new THREE.BufferAttribute(pos3, 3));

    // Exquisite crimson red colors corresponding to signature brand variables
    const mat1 = new THREE.PointsMaterial({ color: 0xc02125, size: 0.022, transparent: true, opacity: 0.22, sizeAttenuation: true });
    const mat2 = new THREE.PointsMaterial({ color: 0xe03e3f, size: 0.05, transparent: true, opacity: 0.38, sizeAttenuation: true });
    const mat3 = new THREE.PointsMaterial({ color: 0x961216, size: 0.095, transparent: true, opacity: 0.52, sizeAttenuation: true });

    scene.add(new THREE.Points(geo1, mat1));
    scene.add(new THREE.Points(geo2, mat2));
    scene.add(new THREE.Points(geo3, mat3));

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.5, .005, 8, 80), new THREE.MeshBasicMaterial({ color: 0xc02125, transparent: true, opacity: .03 }));
    ring1.rotation.x = 0.4; scene.add(ring1);
    const ring2 = ring1.clone(); ring2.rotation.x = 0.6; ring2.rotation.y = 0.3; ring2.material = ring1.material.clone(); ring2.material.opacity = .018; scene.add(ring2);

    let mx = 0, my = 0, frame = 0;
    window.addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; });

    isHeroVisible = true;

    (function animate() {
      requestAnimationFrame(animate);
      if (!isHeroVisible) return;
      frame++;

      const p1 = geo1.attributes.position.array;
      const p2 = geo2.attributes.position.array;
      const p3 = geo3.attributes.position.array;

      // Small particles update
      for (let i = 0; i < pGroup1Count; i++) {
        p1[i * 3] += vels[i].x * particleSpeedMultiplier;
        p1[i * 3 + 1] += vels[i].y * particleSpeedMultiplier;
        if (p1[i * 3] > 10) p1[i * 3] = -10; if (p1[i * 3] < -10) p1[i * 3] = 10;
        if (p1[i * 3 + 1] > 6) p1[i * 3 + 1] = -6; if (p1[i * 3 + 1] < -6) p1[i * 3 + 1] = 6;
      }

      // Medium particles update
      for (let i = 0; i < pGroup2Count; i++) {
        const idx = pGroup1Count + i;
        p2[i * 3] += vels[idx].x * particleSpeedMultiplier;
        p2[i * 3 + 1] += vels[idx].y * particleSpeedMultiplier;
        if (p2[i * 3] > 10) p2[i * 3] = -10; if (p2[i * 3] < -10) p2[i * 3] = 10;
        if (p2[i * 3 + 1] > 6) p2[i * 3 + 1] = -6; if (p2[i * 3 + 1] < -6) p2[i * 3 + 1] = 6;
      }

      // Large foreground flakes update
      for (let i = 0; i < pGroup3Count; i++) {
        const idx = pGroup1Count + pGroup2Count + i;
        p3[i * 3] += vels[idx].x * particleSpeedMultiplier;
        p3[i * 3 + 1] += vels[idx].y * particleSpeedMultiplier;
        if (p3[i * 3] > 10) p3[i * 3] = -10; if (p3[i * 3] < -10) p3[i * 3] = 10;
        if (p3[i * 3 + 1] > 6) p3[i * 3 + 1] = -6; if (p3[i * 3 + 1] < -6) p3[i * 3 + 1] = 6;
      }

      geo1.attributes.position.needsUpdate = true;
      geo2.attributes.position.needsUpdate = true;
      geo3.attributes.position.needsUpdate = true;

      ring1.rotation.z = frame * .001; ring2.rotation.z = -frame * .0008;
      ring1.rotation.y = mx * .15; ring2.rotation.x = .6 + my * .1;
      camera.position.x += (mx * .3 - camera.position.x) * .03;
      camera.position.y += (-my * .2 - camera.position.y) * .03;
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    });
  }

  /* ══════════════════════════════════════════
     6. HERO ENTRANCE — word-by-word stagger
  ══════════════════════════════════════════ */
  let interactionsActive = false;
  let hoveredIndex = -1;
  let localRotX = 0, localRotY = 0;
  let localSheenX = 0, localSheenY = 0;
  let gmx = 0, gmy = 0;

  function initHeroCardInteractions() {
    if (isMobile()) return;

    const cards = qsa('.fan-card');
    if (!cards.length) return;

    const baseOffsets = [
      { xPercent: -50, top: 0, rot: 0, z: 0 },
      { xPercent: -20, top: 10, rot: 8, z: 0 },
      { xPercent: -80, top: 18, rot: -7, z: 0 },
      { xPercent: -10, top: 26, rot: 14, z: 0 },
      { xPercent: -90, top: 34, rot: -12, z: 0 }
    ];

    let logicalPositions = [0, 1, 2, 3, 4];

    const state = cards.map((card, i) => {
      gsap.set(card, { transformOrigin: 'center 120%', transformPerspective: 2000 });
      return {
        el: card,
        sheen: qs('.fc-sheen', card),
        currXPercent: baseOffsets[i].xPercent,
        vxPercent: 0,
        currTop: baseOffsets[i].top,
        vTop: 0,
        cx: 0, cy: 0, cz: 0,
        vx: 0, vy: 0, vz: 0,
        crotX: 0, crotY: 0, crotZ: baseOffsets[i].rot,
        vrotX: 0, vrotY: 0, vrotZ: 0,
        cscale: 1,
        vscale: 0,
        csheenX: 0, csheenY: 0,
        vsheenX: 0, vsheenY: 0,
        copacity: 1,
        vopacity: 0,
        cblur: 0,
        vblur: 0,
        tx: 0, ty: 0, tz: 0,
        trotX: 0, trotY: 0, trotZ: baseOffsets[i].rot,
        tsheenX: 0, tsheenY: 0,
        tscale: 1,
        topacity: 1,
        tblur: 0
      };
    });

    window.addEventListener('mousemove', e => {
      if (window.scrollY > 150) return;
      gmx = (e.clientX / window.innerWidth - 0.5) * 2;
      gmy = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    state.forEach((s, i) => {
      s.el.addEventListener('click', () => {
        if (scrollProgress > 0.05) return; // Disable swap while scrolling
        console.log(`[Carousel] Card click index ${i}, center index is ${logicalPositions.indexOf(0)}, active status: ${interactionsActive}`);
        if (!interactionsActive) {
          console.warn("[Carousel] Swapping blocked: interactionsActive is false. Initializing manually...");
          interactionsActive = true;
        }
        const centerIdx = logicalPositions.indexOf(0);
        if (i !== centerIdx) {
          const clickPos = logicalPositions[i];
          logicalPositions[i] = 0;
          logicalPositions[centerIdx] = clickPos;
          console.log("[Carousel] Swap successful. New positions:", logicalPositions);
        }
      });

      s.el.addEventListener('mousemove', e => {
        if (!interactionsActive || scrollProgress > 0.05) return;
        hoveredIndex = i;
        s.el.classList.add('hovered');

        const rect = s.el.getBoundingClientRect();
        const localX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const localY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        localRotY = localX * 16;
        localRotX = -localY * 14;

        localSheenX = -localX * 45;
        localSheenY = -localY * 45;
      });

      s.el.addEventListener('mouseleave', () => {
        hoveredIndex = -1;
        s.el.classList.remove('hovered');
      });
    });

    let frame = 0;
    (function animateCards() {
      requestAnimationFrame(animateCards);
      if (!isHeroVisible) return;
      frame++;

      const t = frame * 0.015;

      state.forEach((s, i) => {
        if (!interactionsActive) return;

        // Base properties
        const logicalPos = logicalPositions[i];
        const targetConfig = baseOffsets[logicalPos];
        let zIndex = 1;

        let targetXPercent = targetConfig.xPercent;
        let targetTop = targetConfig.top;

        if (scrollProgress === 0) {
          // --- IDLE CAROUSEL & MOUSE PARALLAX STATE ---
          if (logicalPos === 0) {
            zIndex = 5;
            s.el.classList.add('active-center');
          } else {
            s.el.classList.remove('active-center');
            zIndex = (logicalPos === 1 || logicalPos === 2) ? 4 : 2;
          }
          s.el.style.zIndex = zIndex;

          if (hoveredIndex !== -1) {
            if (i === hoveredIndex) {
              // Hovered card lift & 3D tilt
              s.tscale = logicalPos === 0 ? 1.12 : 1.05;
              s.tz = logicalPos === 0 ? 80 : 50;
              s.tx = 0;
              s.ty = -18;
              s.trotX = localRotX;
              s.trotY = localRotY;
              s.trotZ = targetConfig.rot;
              s.tsheenX = localSheenX;
              s.tsheenY = localSheenY;
            } else {
              // Neighbor card shifts
              const isLeft = i < hoveredIndex;
              s.tscale = logicalPos === 0 ? 1.02 : 0.88;
              s.tz = logicalPos === 0 ? 15 : -35;
              s.tx = isLeft ? -28 : 28;
              s.ty = 6;
              s.trotX = 0;
              s.trotY = 0;
              s.trotZ = targetConfig.rot + (isLeft ? -5 : 5);
              s.tsheenX = 0;
              s.tsheenY = 0;
            }
          } else {
            // Idle floating waves
            s.tscale = logicalPos === 0 ? 1.08 : 0.92;
            s.tz = logicalPos === 0 ? 30 : -20;
            s.tx = gmx * (5 - i) * 3 + Math.sin(t + i * 1.5) * 2;
            s.ty = gmy * (5 - i) * 2 + Math.cos(t + i * 1.5) * 4;
            s.trotX = -gmy * 5;
            s.trotY = gmx * 7;
            s.trotZ = targetConfig.rot + Math.sin(t + i * 1.2) * 1.2;
            s.tsheenX = 0;
            s.tsheenY = 0;
          }
          s.topacity = 1;
          s.tblur = 0;

        } else {
          // --- CINEMATIC 4-STAGE SCROLL-DRIVEN STATE ---
          // Smoothly center the base translation offsets during scroll so they don't offset the 3D scroll calculations!
          targetXPercent = -50;
          targetTop = 0;

          s.el.classList.remove('active-center', 'hovered');
          s.el.style.zIndex = 5 - i; // Natural rendering layers

          let cardX = 0;
          let cardY = 0;
          let cardZ = 0;
          let cardRotX = 0;
          let cardRotY = 0;
          let cardRotZ = targetConfig.rot;
          let cardScale = 1.0;
          let cardSheenX = 0;
          let cardSheenY = 0;
          let cardBlur = 0;
          let cardOpacity = 1.0;

          const baseRotXTarget = [45, -60, 50, -45, 55];
          const baseRotYTarget = [-30, 45, -50, 40, -40];
          const baseRotZTarget = [20, -35, 30, -25, 35];

          // 1. STAGE 1: Fan Expansion (0.0 to 0.2 scroll progress)
          if (scrollProgress <= 0.2) {
            const p = scrollProgress / 0.2;
            // Radial spread
            const spreadX = (logicalPos - 2) * 55 * p;
            const spreadY = Math.abs(logicalPos - 2) * -12 * p;

            cardX = spreadX;
            cardY = spreadY;
            cardZ = targetConfig.z + (logicalPos - 2) * 20 * p;
            cardRotZ = targetConfig.rot * (1.0 + 0.65 * p);
            cardScale = gsap.utils.interpolate(logicalPos === 0 ? 1.08 : 0.92, 1.0, p);
            cardSheenX = -60 + p * 120; // Automatically sweep sheen across cards during spread
            cardSheenY = -20 + p * 40;

          }
          // 2. STAGE 2: Independent 3D Floating (0.2 to 0.5 scroll progress)
          else if (scrollProgress <= 0.5) {
            const p = (scrollProgress - 0.2) / 0.3;
            // Retain fully expanded coordinates as base
            const spreadX = (logicalPos - 2) * 55;
            const spreadY = Math.abs(logicalPos - 2) * -12;

            // Add independent 3D rotations, zoom, and idle wave offsets
            cardX = spreadX + Math.sin(t + i * 2.0) * 15 * (1.0 - p);
            cardY = spreadY + Math.cos(t + i * 1.5) * 12 * (1.0 - p);
            cardZ = 60 + p * 150; // Camera zoom effect
            cardRotX = p * baseRotXTarget[i];
            cardRotY = p * baseRotYTarget[i];
            cardRotZ = targetConfig.rot * 1.65 * (1.0 - p) + p * baseRotZTarget[i];
            cardSheenX = Math.sin(t + i) * 50;
            cardSheenY = Math.cos(t + i) * 50;

          }
          // 3. STAGE 3: Curved Circular Orbit & Perspective (0.5 to 0.8 scroll progress)
          else if (scrollProgress <= 0.8) {
            const p = (scrollProgress - 0.5) / 0.3;

            // Floating layout target config
            const floatX = (logicalPos - 2) * 55;
            const floatY = Math.abs(logicalPos - 2) * -12;
            const floatZ = 210;
            const floatRotX = baseRotXTarget[i];
            const floatRotY = baseRotYTarget[i];
            const floatRotZ = baseRotZTarget[i];

            // Orbit math
            const R = isMobile() ? 160 : 240;
            // Cards orbit beautifully in 3D around an inclined plane
            const theta = (i / 5) * 2 * Math.PI + p * 2.6 * Math.PI;

            const orbitX = Math.cos(theta) * R;
            const orbitY = Math.sin(theta) * (R * 0.5); // Inclined ellipse
            const orbitZ = Math.sin(theta) * 150;

            // Orbit rotations face the camera and align tangent to path
            const orbitRotX = 25 * Math.cos(theta);
            const orbitRotY = (theta * 180 / Math.PI) + 90;
            const orbitRotZ = theta * 180 / Math.PI * 0.12;

            // Interpolate smoothly from Floating layout to Circular Orbit
            cardX = gsap.utils.interpolate(floatX, orbitX, p);
            cardY = gsap.utils.interpolate(floatY, orbitY, p);
            cardZ = gsap.utils.interpolate(floatZ, orbitZ, p);
            cardRotX = gsap.utils.interpolate(floatRotX, orbitRotX, p);
            cardRotY = gsap.utils.interpolate(floatRotY, orbitRotY, p);
            cardRotZ = gsap.utils.interpolate(floatRotZ, orbitRotZ, p);
            cardScale = gsap.utils.interpolate(1.0, 0.92, p);

            // Sheen reflects dynamically based on orbit angles
            cardSheenX = Math.cos(theta) * 80;
            cardSheenY = Math.sin(theta) * 80;

            // Add motion blur based on transition progression
            cardBlur = p * 3.6;

          }
          // 4. STAGE 4: Smooth Explosion & Particles Acceleration (0.8 to 1.0 scroll progress)
          else {
            const p = (scrollProgress - 0.8) / 0.2;

            // Orbit terminal positions
            const R = isMobile() ? 160 : 240;
            const theta = (i / 5) * 2 * Math.PI + 2.6 * Math.PI;
            const orbitX = Math.cos(theta) * R;
            const orbitY = Math.sin(theta) * (R * 0.5);
            const orbitZ = Math.sin(theta) * 150;
            const orbitRotX = 25 * Math.cos(theta);
            const orbitRotY = (theta * 180 / Math.PI) + 90;
            const orbitRotZ = theta * 180 / Math.PI * 0.12;

            // Explosion outwards along radial vectors
            const explAngle = (i / 5) * 2 * Math.PI + 1.2;
            const explX = orbitX + Math.cos(explAngle) * 800 * p;
            const explY = orbitY + Math.sin(explAngle) * 800 * p;
            const explZ = orbitZ + 600 * p;

            cardX = explX;
            cardY = explY;
            cardZ = explZ;
            cardRotX = orbitRotX + p * 120;
            cardRotY = orbitRotY + p * 90;
            cardRotZ = orbitRotZ + p * 60;
            cardScale = 0.92 - p * 0.4;
            cardOpacity = 1.0 - p;
            cardBlur = 3.6 - p * 3.6; // Blur fades as they expand out

            // Set particle acceleration multiplier in main Three.js loop
            particleSpeedMultiplier = 1.0 + p * 11.0;
          }

          s.tx = cardX;
          s.ty = cardY;
          s.tz = cardZ;
          s.trotX = cardRotX;
          s.trotY = cardRotY;
          s.trotZ = cardRotZ;
          s.tscale = cardScale;
          s.tsheenX = cardSheenX;
          s.tsheenY = cardSheenY;
          s.topacity = cardOpacity;
          s.tblur = cardBlur;
        }

        // --- SECOND-ORDER LUXURY SPRING SIMULATION ---
        const stiffness = scrollProgress > 0 ? 0.14 : 0.08; // Snappier spring during scroll scrub
        const damping = scrollProgress > 0 ? 0.72 : 0.65;

        // Spread layout spring
        let fxPercent = (targetXPercent - s.currXPercent) * stiffness - s.vxPercent * damping;
        s.vxPercent += fxPercent;
        s.currXPercent += s.vxPercent;

        let fTop = (targetTop - s.currTop) * stiffness - s.vTop * damping;
        s.vTop += fTop;
        s.currTop += s.vTop;

        // Custom spring variables for Interactive translating coordinates
        let fx = (s.tx - s.cx) * stiffness - s.vx * damping;
        s.vx += fx;
        s.cx += s.vx;

        let fy = (s.ty - s.cy) * stiffness - s.vy * damping;
        s.vy += fy;
        s.cy += s.vy;

        let fz = (s.tz - s.cz) * stiffness - s.vz * damping;
        s.vz += fz;
        s.cz += s.vz;

        // Custom spring variables for Interactive rotating coordinates
        let frotX = (s.trotX - s.crotX) * stiffness - s.vrotX * damping;
        s.vrotX += frotX;
        s.crotX += s.vrotX;

        let frotY = (s.trotY - s.crotY) * stiffness - s.vrotY * damping;
        s.vrotY += frotY;
        s.crotY += s.vrotY;

        let frotZ = (s.trotZ - s.crotZ) * stiffness - s.vrotZ * damping;
        s.vrotZ += frotZ;
        s.crotZ += s.vrotZ;

        // Scale spring
        let fscale = (s.tscale - s.cscale) * stiffness - s.vscale * damping;
        s.vscale += fscale;
        s.cscale += s.vscale;

        // Metallic Sheen spring
        let fsheenX = (s.tsheenX - s.csheenX) * 0.18 - s.vsheenX * 0.68;
        s.vsheenX += fsheenX;
        s.csheenX += s.vsheenX;

        let fsheenY = (s.tsheenY - s.csheenY) * 0.18 - s.vsheenY * 0.68;
        s.vsheenY += fsheenY;
        s.csheenY += s.vsheenY;

        // Opacity spring
        let fopacity = (s.topacity - s.copacity) * 0.15 - s.vopacity * 0.7;
        s.vopacity += fopacity;
        s.copacity += s.vopacity;

        // Blur spring
        let fblur = (s.tblur - s.cblur) * 0.15 - s.vblur * 0.7;
        s.vblur += fblur;
        s.cblur += s.vblur;

        // Render card style transforms
        const baseTranslate = `translateX(${s.currXPercent}%) translateY(${s.currTop}px)`;
        const interactiveTranslate = `translate3d(${s.cx}px, ${s.cy}px, ${s.cz}px) rotateX(${s.crotX}deg) rotateY(${s.crotY}deg) rotateZ(${s.crotZ}deg) scale(${s.cscale})`;

        s.el.style.transform = `${baseTranslate} ${interactiveTranslate}`;
        s.el.style.opacity = s.copacity;

        if (s.cblur > 0.05) {
          s.el.style.filter = `blur(${s.cblur}px)`;
        } else {
          s.el.style.filter = 'none';
        }

        if (s.sheen) {
          s.sheen.style.transform = `translate3d(${s.csheenX}%, ${s.csheenY}%, 0)`;
        }
      });
    })();
  }

  /* Hero fan spread, as a % of one card's width per card.
     The deck spans (max - min) + 100% of a card, so the full-width -85/-15
     spread is 1.7 cards wide — more than a phone can show. Tightening the
     outer cards keeps the whole fan inside the viewport instead of letting
     #hero's overflow:hidden slice the end decks off.
     Kept in step with the .fc-N transforms in style.css, which are the
     pre-animation (and no-JS) positions. */
  function heroFanOffsets() {
    // matchMedia, not innerWidth: these must land on the same breakpoints as
    // the .fc-N overrides in style.css (innerWidth counts the scrollbar, media
    // queries don't, so the two disagree by ~15px near a boundary).
    if (matchMedia('(max-width: 400px)').matches) return [-50, -34, -66, -24, -76];
    if (matchMedia('(max-width: 600px)').matches) return [-50, -30, -70, -18, -82];
    return [-50, -25, -75, -15, -85];
  }

  function initHeroEntrance() {
    // Enable 3D perspective contexts for text elements
    gsap.set('#hero-title', { perspective: 1200, transformStyle: 'preserve-3d' });

    // Set initial card states for cinematic 3D fly-in
    const cards = qsa('.fan-card');
    cards.forEach((card, idx) => {
      gsap.set(card, {
        opacity: 0,
        scale: 0.15,
        z: -1200,
        xPercent: -50,
        /* x:0 is load-bearing. GSAP reads the start transform as a matrix, so
           the .fc-N `translateX(-85%)` in CSS comes back as px and lands in
           `x`; animating xPercent on top of it then applied BOTH, doubling
           every offset and throwing the outer cards off-screen. */
        x: 0,
        y: 250,
        rotationX: gsap.utils.random(-90, 90),
        rotationY: gsap.utils.random(-90, 90),
        rotationZ: gsap.utils.random(-45, 45),
        transformPerspective: 2000,
        transformOrigin: 'center 120%'
      });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        console.log("[GSAP] Entrance timeline complete. Custom interactions active.");
        interactionsActive = true;
      }
    });

    tl
      .from('#hero-eyebrow', { opacity: 0, x: -40, duration: 1.0, ease: 'power4.out' })
      .to('.hw', {
        y: 0,
        z: 0,
        rotationX: 0,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.1,
        clearProps: 'filter'
      }, '-=0.6')
      .from('#hero-body', { opacity: 0, y: 35, duration: 1.0, ease: 'power3.out' }, '-=0.8')
      .to('.fan-card', {
        opacity: 1,
        scale: 1,
        z: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: (i) => {
          const rotZMap = [0, 8, -7, 14, -12]; // base angles
          return rotZMap[i];
        },
        xPercent: (i) => {
          return heroFanOffsets()[i];
        },
        duration: 2.2,
        ease: 'elastic.out(0.85, 0.72)',
        stagger: 0.1
      }, '-=1.0')
      .from('.hero-fan-label', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=1.2')
      .from('.hs-item, .hs-divider', { opacity: 0, y: 25, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=1.2')
      .from('#scroll-cue', { opacity: 0, duration: 0.8 }, '-=0.8');

    // Bulletproof fallback: ensure interactions are active within 2.5 seconds no matter what!
    setTimeout(() => {
      if (!interactionsActive) {
        console.log("[Fallback] Timeout expired. Activating custom interactions manually.");
        interactionsActive = true;
      }
    }, 2500);
  }

  /* ══════════════════════════════════════════
     7. SCROLL CARD FAN ANIMATION
     Inspired by the Pallet Rose video:
     - Cards stacked → scroll → fan out
     - Words reveal word-by-word as you scroll
     - Sub-text + CTAs fade in at the end
  ══════════════════════════════════════════ */
  function initFanScrollAnimation() {
    const section = qs('#fan-section');
    const cards = qsa('.sf-card');
    const words = qsa('.fbt-word');
    const subText = qs('.fan-sub-text');
    const ctaRow = qs('.fan-cta-row');

    if (!section || !cards.length) return;

    /* Premium 3D fanning configuration with realistic circular rotation and depth */
    const fanConfig = [
      { x: 0, y: 0, rotate: 0, rotY: 0, rotX: 0, z: 0, scale: 1 },    // Center card (front)
      { x: -110, y: -15, rotate: -15, rotY: 12, rotX: -2, z: -15, scale: 0.96 }, // Left inner
      { x: 110, y: -15, rotate: 15, rotY: -12, rotX: -2, z: -15, scale: 0.96 }, // Right inner
      { x: -210, y: -40, rotate: -30, rotY: 22, rotX: -4, z: -30, scale: 0.92 }, // Left outer
      { x: 210, y: -40, rotate: 30, rotY: -22, rotX: -4, z: -30, scale: 0.92 }, // Right outer
    ];

    /* Stacked layouts centre the deck in the viewport, so the spread is bounded
       by half the screen. The flat -140/140 above overflowed anything under
       ~600px and .fan-sticky's overflow:hidden sliced the outer decks in half;
       derive it from the actual card size instead. */
    if (isMobile()) {
      const card = cards[0].getBoundingClientRect();
      const scale = 0.92;                                  // fanConfig outer scale
      const cw = (card.width || 245) * scale;
      const ch = (card.height || 235) * scale;
      const vw = document.documentElement.clientWidth;

      /* Narrow screens can't take the full 30deg tilt — the rotated bounding
         box alone would outgrow the viewport, so ease the angle down too. */
      const outerRot = vw <= 480 ? 20 : 30;
      const innerRot = vw <= 480 ? 10 : 15;
      const rad = outerRot * Math.PI / 180;

      const halfBound = (cw * Math.cos(rad) + ch * Math.sin(rad)) / 2;
      /* transformOrigin is 'center 120%', i.e. 0.7 x height below the card's
         centre, so rotating also swings the card sideways about that pivot. */
      const pivotSwing = 0.7 * ch * Math.sin(rad);
      /* The gutter also absorbs the extra width rotationY's perspective adds. */
      const outer = Math.round(Math.max(0, Math.min(140, vw / 2 - 14 - halfBound - pivotSwing)));
      const inner = Math.round(outer * 0.52);

      fanConfig[1].x = -inner; fanConfig[2].x = inner;
      fanConfig[3].x = -outer; fanConfig[4].x = outer;
      fanConfig[1].rotate = -innerRot; fanConfig[2].rotate = innerRot;
      fanConfig[3].rotate = -outerRot; fanConfig[4].rotate = outerRot;
      fanConfig[1].rotY = 8; fanConfig[2].rotY = -8;
      fanConfig[3].rotY = 14; fanConfig[4].rotY = -14;
    }

    /* Initial state: perfectly stacked with realistic 3D perspective and origin at pivot point */
    gsap.set(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      z: 0,
      scale: 0.82,
      opacity: 1,
      transformPerspective: 1200,
      transformOrigin: 'center 120%'
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: '.fan-sticky',
        pinSpacing: false, // Use stable HTML/CSS spacer instead of dynamic padding to avoid bleed-through overlap bugs!
        start: 'top top',
        end: () => "+=" + (window.innerHeight * (isMobile() ? 2.5 : 3.5)),
        scrub: 1.4,
        invalidateOnRefresh: true,
      }
    });

    /* Phase 1 (0 → 0.25): cards fan out with realistic 3D transitions & sheen reflections */
    cards.forEach((card, i) => {
      const cfg = fanConfig[i];
      const sheen = qs('.sfc-sheen', card);

      tl.to(card, {
        x: cfg.x,
        y: cfg.y,
        rotation: cfg.rotate,
        rotationY: cfg.rotY,
        rotationX: cfg.rotX,
        z: cfg.z,
        scale: cfg.scale,
        duration: 1,
        ease: 'power2.out',
      }, i * 0.06);

      if (sheen) {
        tl.fromTo(sheen,
          { x: '-100%', opacity: 0 },
          { x: '100%', opacity: 0.6, duration: 1, ease: 'power1.inOut' },
          i * 0.06
        );
      }
    });

    /* Phase 2 (0.25 → 0.7): words appear one by one */
    words.forEach((word, i) => {
      tl.to(word, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      }, 0.35 + i * 0.18);
    });

    /* Phase 3 (0.7 → 0.85): sub-text fades in */
    tl.to(subText, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.5);

    /* Phase 4 (0.85 → 1): CTA fades in */
    tl.to(ctaRow, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.8);
  }

  /* ══════════════════════════════════════════
     8. GENERAL SCROLL ANIMATIONS
  ══════════════════════════════════════════ */
  function initScrollAnimations() {
    /* s-up reveals */
    qsa('.s-up').forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'expo', delay,
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }
      });
    });

    /* Story sticky pinning (Handled natively by CSS position: sticky) */

    /* Pillar items */
    qsa('.pillar-item').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.8, ease: 'expo', delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    /* Why tiles */
    qsa('.why-tile').forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 50, duration: 0.9, ease: 'expo', delay: parseFloat(el.dataset.delay || i * 0.1),
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      });
    });

    /* CTA suits parallax */
    qsa('.ctab-suits span').forEach((el, i) => {
      gsap.to(el, {
        y: -80, ease: 'none',
        scrollTrigger: { trigger: '#cta-band', start: 'top bottom', end: 'bottom top', scrub: 1 + i * 0.3 }
      });
    });

    /* Footer big name */
    gsap.to('.fbn-inner', {
      x: '-15%', ease: 'none',
      scrollTrigger: { trigger: '#site-footer', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    /* The product cards' reveal lives in initProductDrag() for every width —
       a second `from` tween on the same cards here fought the first one. */
  }

  /* ══════════════════════════════════════════
     9. COUNTERS
  ══════════════════════════════════════════ */
  function initCounters() {
    qsa('.hs-num').forEach(el => {
      const target = parseInt(el.dataset.count);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2.5, ease: 'power2.out', delay: 0.5,
        onUpdate: () => { el.textContent = Math.round(obj.val); }
      });
    });
  }

  /* ══════════════════════════════════════════
     10. PRODUCT HORIZONTAL SCROLL
     One behaviour at every width: pin #products and scrub the track sideways
     with page scroll. It used to branch on isMobile() at load time, so under
     900px there was no pin at all — cards 03+ were only reachable by dragging
     a stage with a hidden scrollbar (and the wheel is owned by Lenis), and
     resizing across 900px left the wrong mode wired up. The CSS keeps the
     section exactly one viewport tall so nothing is stranded under the pin.
  ══════════════════════════════════════════ */
  function initProductDrag() {
    const stage = qs('#prod-stage');
    const track = qs('#prod-track');
    const section = qs('#products');
    if (!stage || !track || !section) return;

    const cards = qsa('.prod-card', track);

    // Graceful staggered reveal as the section scrolls into the viewport
    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    /* Recomputed on every refresh (resize / font + image load) rather than
       captured once, so the pin length always matches the real track width. */
    const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section, pin: true, scrub: 1.2,
        start: 'top top', end: () => "+=" + (distance() + 200),
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
    tl.to(track, { x: () => -distance(), ease: 'none' });
  }

  /* ══════════════════════════════════════════
     11. SWIPERS
  ══════════════════════════════════════════ */
  function initSwipers() {
    const trend = new Swiper('.trend-swiper', {
      slidesPerView: 1.39, spaceBetween: 24, grabCursor: true, loop: true,
      pagination: { el: '.trend-pager', clickable: true },
      navigation: { prevEl: '.tc-prev', nextEl: '.tc-next' },
      breakpoints: { 640: { slidesPerView: 2.08 }, 900: { slidesPerView: 3.06 }, 1200: { slidesPerView: 4.17 } },
      // continuous marquee-style autoplay (linear, no pause between slides)
      autoplay: { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true },
      speed: 3500,
    });
    const testi = new Swiper('.testi-swiper', {
      slidesPerView: 1, spaceBetween: 24, grabCursor: true, loop: true,
      breakpoints: { 768: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } },
    });
    disposers.push(() => {
      [trend, testi].forEach(sw => { try { sw.destroy(true, true); } catch (e) { /* already gone */ } });
    });
  }

  /* ══════════════════════════════════════════
     12. CONTACT FORM
  ══════════════════════════════════════════ */
  function initContactForm() {
    const form = qs('#contact-form');
    if (!form) return;

    const fields = qsa('input, textarea', form);

    fields.forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();

      let isValid = true;

      fields.forEach(field => {
        const value = field.value.trim();
        const group = field.closest('.form-group');
        let fieldValid = true;

        if (!value) {
          fieldValid = false;
        } else if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            fieldValid = false;
          }
        }

        if (!fieldValid) {
          isValid = false;
          if (group) {
            group.classList.add('has-error');
            gsap.timeline()
              .to(group, { x: -8, duration: 0.06 })
              .to(group, { x: 8, duration: 0.06 })
              .to(group, { x: -5, duration: 0.06 })
              .to(group, { x: 5, duration: 0.06 })
              .to(group, { x: 0, duration: 0.06 });
          }
        }
      });

      if (!isValid) {
        const submitBtn = form.querySelector('.form-submit');
        if (submitBtn) {
          gsap.timeline()
            .to(submitBtn, { x: -8, duration: 0.06 })
            .to(submitBtn, { x: 8, duration: 0.06 })
            .to(submitBtn, { x: -5, duration: 0.06 })
            .to(submitBtn, { x: 5, duration: 0.06 })
            .to(submitBtn, { x: 0, duration: 0.06, clearProps: 'x' });
        }
        return;
      }

      const btn = form.querySelector('.form-submit span');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = 'Sending...';
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        gsap.from(btn, { scale: 0.9, duration: 0.4, ease: 'back.out(2)' });
        setTimeout(() => { btn.textContent = orig; form.reset(); }, 3000);
      }, 1200);
    });
  }

  /* ══════════════════════════════════════════
     13. MARQUEE DUPLICATE
  ══════════════════════════════════════════ */
  function initMarquee() {
    const inner = qs('.mq-inner');
    if (!inner) return;
    inner.parentNode.appendChild(inner.cloneNode(true));
  }

  /* ══════════════════════════════════════════
     14. CARD 3D TILT
  ══════════════════════════════════════════ */
  function initCardTilt() {
    if (isMobile()) return;
    qsa('.prod-card, .testi-card, .why-tile').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -8;
        const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 8;
        gsap.to(card, { rotationX: rx, rotationY: ry, z: 20, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, z: 0, duration: 0.6, ease: 'elastic.out(1,.5)' });
      });
    });
  }

  /* ══════════════════════════════════════════
     14.5 HERO PINNED SCROLL ANIMATION
  ══════════════════════════════════════════ */
  function initHeroScrollAnimation() {
    if (isMobile()) return;
    const heroSec = qs('#hero');
    if (!heroSec) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSec,
        start: 'top top',
        end: () => '+=' + (window.innerHeight * 2.5),
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress = self.progress;
        }
      }
    });

    // Stage 2: Fade out & translate the hero text, CTAs, stats, and scroll cue
    tl.to('#hero-eyebrow, #hero-body, .hero-ctas, #scroll-cue', {
      opacity: 0,
      y: -60,
      ease: 'power2.inOut',
      stagger: 0.05
    }, 0.2);

    tl.to('#hero-title', {
      opacity: 0,
      y: -80,
      scale: 0.92,
      filter: 'blur(10px)',
      ease: 'power2.inOut'
    }, 0.25);

    tl.to('#hero-stats', {
      opacity: 0,
      y: 60,
      ease: 'power2.inOut'
    }, 0.2);
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    // 1. Initialize other features inside try-catch so one failing does not block the others
    const initializers = [
      { name: 'Lenis', fn: initLenis },
      { name: 'Cursor', fn: initCursor },
      { name: 'Navbar', fn: initNavbar },
      { name: 'Swipers', fn: initSwipers },
      { name: 'ProductDrag', fn: initProductDrag },
      { name: 'ContactForm', fn: initContactForm },
      { name: 'Marquee', fn: initMarquee },
      { name: 'CardTilt', fn: initCardTilt }
    ];

    initializers.forEach(item => {
      try {
        item.fn();
      } catch (e) {
        console.error(`Error in ${item.name} initialization:`, e);
      }
    });

    // 2. Trigger all entrance animations and layout builds instantly
    try { initHeroEntrance(); } catch (e) { console.error("initHeroEntrance failed:", e); }
    try { initCounters(); } catch (e) { console.error("initCounters failed:", e); }
    try { initFanScrollAnimation(); } catch (e) { console.error("initFanScrollAnimation failed:", e); }
    try { initScrollAnimations(); } catch (e) { console.error("initScrollAnimations failed:", e); }
    try { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); } catch (e) { console.error("ScrollTrigger refresh failed:", e); }
  }

  /* The React tree calls us after mount, so the document is always ready and
     the old readyState branch is gone. Images may still be decoding though, so
     keep the deferred refresh that used to hang off window 'load'. */
  init();

  const refreshTimer = setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }, 150);
  disposers.push(() => clearTimeout(refreshTimer));

  return function teardown() {
    disposers.forEach(fn => {
      try { fn(); } catch (e) { console.error('legacy-script teardown step failed:', e); }
    });
    disposers.length = 0;
    /* Only one page is ever mounted, so every live trigger belongs to it. */
    try {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.getAll().forEach(t => t.kill());
    } catch (e) { /* GSAP never loaded */ }
  };
}