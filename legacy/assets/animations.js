/* ============================================================
   A India Print House — shared animation logic
   Used by premium-playing-cards.html and
   promotional-playing-cards.html so both run identical effects.

   Libraries: GSAP + ScrollTrigger, Lenis, Three.js, Anime.js,
   Locomotive Scroll, tsParticles (+confetti), Lottie,
   SplitType, Typed.js, Rough Notation, Atropos, Granim.

   Every module guards for a missing library and for
   prefers-reduced-motion, so the page never breaks.
   ============================================================ */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     Navbar: scrolled state + fullscreen menu
  ----------------------------------------------------------- */
  function initNav() {
    var header = document.getElementById('site-header');
    var burger = document.getElementById('hdr-burger');
    var overlay = document.getElementById('nav-overlay');
    var closeBtn = document.getElementById('no-close');

    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 80) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      });
    }
    if (!burger || !overlay) return;

    var collGroup = overlay.querySelector('.no-collection-group');
    var collHead = overlay.querySelector('.no-collection-head');

    /* The menu is its own scroll container (ten collection links outgrow a phone
       screen). Without this Lenis owns the wheel/touch and scrolls the page
       behind the overlay instead of the menu. */
    overlay.setAttribute('data-lenis-prevent', '');

    function openNav() {
      overlay.classList.add('open');
      burger.classList.add('open');
      /* Hides the z-index:999 social rail that otherwise sits on top of the menu. */
      document.body.classList.add('nav-open');
      if (window.__lenis) window.__lenis.stop();
    }

    function closeNav() {
      overlay.classList.remove('open');
      burger.classList.remove('open');
      document.body.classList.remove('nav-open');
      overlay.scrollTop = 0;
      /* Reopen collapsed, matching the closed state of the caret. */
      if (collGroup) {
        collGroup.classList.remove('open');
        if (collHead) collHead.setAttribute('aria-expanded', 'false');
      }
      if (window.__lenis) window.__lenis.start();
    }

    burger.addEventListener('click', function () {
      overlay.classList.contains('open') ? closeNav() : openNav();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeNav);

    /* Collection is an accordion, so it's the one .no-link that must NOT close
       the menu — tapping it used to dismiss the whole overlay. */
    overlay.querySelectorAll('.no-link').forEach(function (l) {
      if (l === collGroup) return;
      l.addEventListener('click', closeNav);
    });

    if (collGroup && collHead) {
      collHead.setAttribute('role', 'button');
      collHead.setAttribute('tabindex', '0');
      collHead.setAttribute('aria-expanded', 'false');

      var toggleCollection = function () {
        var open = collGroup.classList.toggle('open');
        collHead.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      collHead.addEventListener('click', toggleCollection);
      collHead.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCollection(); }
      });

      /* The product links themselves navigate away, so they still dismiss. */
      overlay.querySelectorAll('.no-col-link').forEach(function (l) {
        l.addEventListener('click', closeNav);
      });
    }
  }

  /* -----------------------------------------------------------
     1. GSAP + ScrollTrigger — reveals, timelines, parallax
  ----------------------------------------------------------- */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger || REDUCED) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    var EASE = 'power3.out';

    var progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    gsap.timeline({ defaults: { ease: EASE } })
      .from('.hero__eyebrow', { y: 24, opacity: 0, duration: 0.8, delay: 0.1 })
      .from('.hero__title', { y: 44, opacity: 0, duration: 1.0 }, '-=0.4')
      .from('.hero__text', { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero__content button', { y: 20, opacity: 0, scale: 0.96, duration: 0.7 }, '-=0.5')
      .from('.hero__scroll', { opacity: 0, duration: 0.8 }, '-=0.3');

    function reveal(sel, vars) {
      gsap.utils.toArray(sel).forEach(function (el) {
        gsap.from(el, Object.assign({
          scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          y: 40, opacity: 0, duration: 0.9, ease: EASE, clearProps: 'transform,opacity'
        }, vars || {}));
      });
    }
    function batchReveal(sel, vars) {
      ScrollTrigger.batch(sel, {
        start: 'top 88%', once: true,
        onEnter: function (els) {
          gsap.from(els, Object.assign({
            y: 44, opacity: 0, duration: 0.8, ease: EASE,
            stagger: 0.12, overwrite: true, clearProps: 'transform,opacity'
          }, vars || {}));
        }
      });
    }

    reveal('.heritage__text');
    reveal('.media-frame', { scale: 0.9, y: 30 });
    reveal('.section-head');
    batchReveal('.deck-card', { scale: 0.96, stagger: 0.16 });
    reveal('.specs__head');
    batchReveal('.bento__cell', { scale: 0.97, stagger: 0.1 });
    reveal('.apps__title');
    batchReveal('.apps__item', { x: -40, y: 0, stagger: 0.09 });
    reveal('.apps__media', { scale: 0.94 });
    reveal('.custom', { scale: 0.97 });
    reveal('.why__quote', { x: -30, y: 0 });
    batchReveal('.why__benefits-grid > div', { stagger: 0.1 });
    reveal('.cta__title', { scale: 0.96 });
    reveal('.cta__contacts');
    reveal('.cta button', { scale: 0.95 });
    reveal('.footer-top');
    reveal('.card-showcase__content', { scale: 0.97 });

    var mm = gsap.matchMedia();
    mm.add('(min-width: 769px)', function () {
      gsap.to('.hero__content', {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      gsap.utils.toArray('.media-frame img, .apps__media img, .deck-card img').forEach(function (img) {
        if (img.classList.contains('no-parallax')) return;
        gsap.fromTo(img, { scale: 1.18 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      if (document.querySelector('.badge')) {
        gsap.to('.badge', {
          yPercent: -18, ease: 'none',
          scrollTrigger: { trigger: '.heritage__media', start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* -----------------------------------------------------------
     2. LENIS — global smooth scroll, synced to ScrollTrigger
  ----------------------------------------------------------- */
  function initLenis() {
    if (REDUCED || typeof Lenis === 'undefined') return;
    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
    }
    window.__lenis = lenis;
  }

  /* -----------------------------------------------------------
     3. THREE.JS — depth corridor in the #card-showcase section
  ----------------------------------------------------------- */
  function initThree() {
    if (REDUCED || typeof THREE === 'undefined') return;
    var host = document.getElementById('card-showcase');
    if (!host) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'card-showcase__canvas';
    host.appendChild(canvas);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 9;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var key = new THREE.DirectionalLight(0xffffff, 0.38);
    key.position.set(2, 3, 5);
    scene.add(key);

    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    function makeCardTexture(rank, glyph, color) {
      var c = document.createElement('canvas');
      c.width = 256; c.height = 358;
      var x = c.getContext('2d');
      x.fillStyle = '#fbf7ef';
      roundRect(x, 0, 0, c.width, c.height, 22); x.fill();
      x.lineWidth = 6; x.strokeStyle = 'rgba(192,33,37,0.55)';
      roundRect(x, 10, 10, c.width - 20, c.height - 20, 16); x.stroke();
      x.fillStyle = color;
      if (rank) {
        // Face card: large rank letter in center, suit glyph in corners
        x.font = 'bold 130px Georgia, serif';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(rank, c.width / 2, c.height / 2 - 10);
        x.font = '54px Georgia, serif';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(glyph, c.width / 2, c.height / 2 + 80);
        // Corners: rank + glyph stacked
        x.font = 'bold 34px Georgia, serif'; x.textAlign = 'left'; x.textBaseline = 'top';
        x.fillText(rank, 14, 12);
        x.font = '28px Georgia, serif';
        x.fillText(glyph, 16, 46);
        x.save(); x.translate(c.width - 14, c.height - 12); x.rotate(Math.PI);
        x.font = 'bold 34px Georgia, serif'; x.textAlign = 'left'; x.textBaseline = 'top';
        x.fillText(rank, 0, 0);
        x.font = '28px Georgia, serif';
        x.fillText(glyph, 2, 34); x.restore();
      } else {
        // Suit-only card (Ace style)
        x.font = '160px Georgia, serif';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText(glyph, c.width / 2, c.height / 2);
        x.font = '40px Georgia, serif'; x.textAlign = 'left'; x.textBaseline = 'top';
        x.fillText(glyph, 20, 18);
        x.save(); x.translate(c.width - 20, c.height - 18); x.rotate(Math.PI);
        x.fillText(glyph, 0, 0); x.restore();
      }
      var tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      return tex;
    }

    // [rank, glyph, color] — null rank = suit-only (Ace style)
    var suits = [
      [null,  '♠', '#111111'],
      [null,  '♥', '#C02125'],
      [null,  '♣', '#111111'],
      [null,  '♦', '#C02125'],
      ['K',   '♠', '#111111'],
      ['K',   '♥', '#C02125'],
      ['Q',   '♦', '#C02125'],
      ['Q',   '♣', '#111111'],
      ['J',   '♥', '#C02125'],
      ['J',   '♠', '#111111'],
    ];
    // Custom card face images composited onto a white card body.
    var CARD_IMAGES = [
      'New/1.avif',  'New/2.avif',  'New/3.avif',  'New/4.avif',  'New/5.avif',
      'New/6.avif',  'New/7.avif',  'New/8.avif',  'New/9.avif',  'New/10.avif',
      'New/11.avif', 'New/12.avif', 'New/13.avif', 'New/14.avif', 'New/15.avif',
      'New/16.avif', 'New/17.avif', 'New/18.avif', 'New/19.avif', 'New/20.avif',
      'New/21.avif', 'New/22.avif', 'New/23.avif', 'New/24.avif', 'New/25.avif',
      'New/26.avif', 'New/27.avif', 'New/28.avif', 'New/29.avif', 'New/30.avif'
    ];
    function makeImageCardTexture(src) {
      var c = document.createElement('canvas');
      // Match the card mesh proportions (1.3 x 1.9) so the art isn't letterboxed
      c.width = 256; c.height = 374;
      var x = c.getContext('2d');
      // Warm off-white card body (drawn immediately so the card is never see-through)
      x.fillStyle = '#efe9dd';
      roundRect(x, 0, 0, c.width, c.height, 22); x.fill();
      var tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 4;
      var img = new Image();
      img.onload = function () {
        // Trim the transparent margin baked into each PNG so the art reaches the card edge.
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var sx = 0, sy = 0, sw = iw, sh = ih;
        try {
          var scan = document.createElement('canvas');
          scan.width = iw; scan.height = ih;
          var sc = scan.getContext('2d');
          sc.drawImage(img, 0, 0);
          var data = sc.getImageData(0, 0, iw, ih).data;
          var minX = iw, minY = ih, maxX = 0, maxY = 0, found = false;
          for (var py = 0; py < ih; py++) {
            for (var px = 0; px < iw; px++) {
              if (data[(py * iw + px) * 4 + 3] > 12) {
                found = true;
                if (px < minX) minX = px;
                if (px > maxX) maxX = px;
                if (py < minY) minY = py;
                if (py > maxY) maxY = py;
              }
            }
          }
          if (found) { sx = minX; sy = minY; sw = maxX - minX + 1; sh = maxY - minY + 1; }
        } catch (e) { /* tainted canvas fallback: use the full image */ }
        // Cover-fit the trimmed art to fill the whole card face edge-to-edge.
        var scale = Math.max(c.width / sw, c.height / sh);
        var dw = sw * scale, dh = sh * scale;
        var dx = (c.width - dw) / 2, dy = (c.height - dh) / 2;
        x.save();
        roundRect(x, 0, 0, c.width, c.height, 22); x.clip();
        x.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        x.restore();
        tex.needsUpdate = true;
      };
      img.src = src;
      return tex;
    }

    var backMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.1 });
    var geo = new THREE.BoxGeometry(1.3, 1.9, 0.02);

    scene.fog = new THREE.Fog(0x0a0a0c, 12, 46);

    var FAR = -40;
    var SPAN = (camera.position.z + 1) - FAR;
    var spread = 1;
    var cards = [];
    var COUNT = CARD_IMAGES.length;   // one card per face image, so every image appears

    function placeCard(m, atFar) {
      var ang = Math.random() * Math.PI * 2;
      var r = 2.3 + Math.random() * 1.4;
      m.userData.ang = ang;
      m.userData.r = r;
      m.position.x = Math.cos(ang) * r * spread;
      m.position.y = Math.sin(ang) * r * spread;
      m.position.z = atFar ? (FAR + Math.random() * 2) : (FAR + Math.random() * SPAN);
      m.rotation.z = (Math.random() - 0.5) * 0.5;
      m.userData.spin = (Math.random() - 0.5) * 0.004;
      m.userData.speed = 0.045 + Math.random() * 0.03;
    }

    for (var i = 0; i < COUNT; i++) {
      var faceMat = new THREE.MeshStandardMaterial({ map: makeImageCardTexture(CARD_IMAGES[i % CARD_IMAGES.length]), color: 0xcfcfcf, roughness: 0.62 });
      var mats = [backMat, backMat, backMat, backMat, faceMat, backMat];
      var mesh = new THREE.Mesh(geo, mats);
      mesh.userData = {};
      placeCard(mesh, false);
      scene.add(mesh);
      cards.push(mesh);
    }

    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('mousemove', function (e) {
      mouse.tx = (e.clientX / window.innerWidth - 0.5);
      mouse.ty = (e.clientY / window.innerHeight - 0.5);
    });

    function resize() {
      var w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      var halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      var halfW = halfH * camera.aspect;
      spread = Math.max(0.55, Math.min(1.15, Math.min(halfH, halfW) / 3.2));
      for (var i = 0; i < cards.length; i++) {
        cards[i].position.x = Math.cos(cards[i].userData.ang) * cards[i].userData.r * spread;
        cards[i].position.y = Math.sin(cards[i].userData.ang) * cards[i].userData.r * spread;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    var hostVisible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { hostVisible = en[0].isIntersecting; }).observe(host);
    }

    (function loop() {
      requestAnimationFrame(loop);
      if (!hostVisible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      camera.position.x = mouse.x * 1.4;
      camera.position.y = -mouse.y * 1.0;
      camera.lookAt(0, 0, 0);
      for (var i = 0; i < cards.length; i++) {
        var m = cards[i], d = m.userData;
        m.position.z += d.speed;
        m.rotation.z += d.spin;
        if (m.position.z > camera.position.z + 1) placeCard(m, true);
      }
      renderer.render(scene, camera);
    })();
  }

  /* -----------------------------------------------------------
     4. ANIME.JS — micro-interactions
  ----------------------------------------------------------- */
  function initAnime() {
    if (typeof anime === 'undefined') return;

    var social = document.querySelectorAll('.floating-social-group .fsi-btn');
    if (social.length) {
      anime.set(social, { opacity: 0, scale: 0.4, translateY: 16 });
      anime({
        targets: social,
        opacity: 1, scale: 1, translateY: 0,
        delay: anime.stagger(90, { start: 900 }),
        duration: 700, easing: 'easeOutElastic(1, .7)'
      });
    }

    if (!REDUCED) {
      var core = document.querySelector('.badge__core');
      if (core) {
        anime({
          targets: core,
          boxShadow: ['0 0 0 0 rgba(192,33,37,0)', '0 0 22px 4px rgba(192,33,37,0.45)'],
          scale: [1, 1.08],
          direction: 'alternate', loop: true,
          duration: 1600, easing: 'easeInOutSine'
        });
      }
      var sline = document.querySelector('.hero__scroll-line');
      if (sline) {
        sline.style.transformOrigin = '50% 0%';
        anime({
          targets: sline,
          scaleY: [0.3, 1], opacity: [0.4, 1],
          direction: 'alternate', loop: true,
          duration: 1400, easing: 'easeInOutQuad'
        });
      }
      document.querySelectorAll('.magnetic').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          anime({
            targets: el,
            translateX: (e.clientX - (r.left + r.width / 2)) * 0.3,
            translateY: (e.clientY - (r.top + r.height / 2)) * 0.4,
            duration: 400, easing: 'easeOutQuad'
          });
        });
        el.addEventListener('mouseleave', function () {
          anime({ targets: el, translateX: 0, translateY: 0, duration: 600, easing: 'easeOutElastic(1, .6)' });
        });
      });
    }

    var burger = document.getElementById('hdr-burger');
    var overlay = document.getElementById('nav-overlay');
    if (burger && overlay) {
      burger.addEventListener('click', function () {
        if (!overlay.classList.contains('open')) return;
        var suits = overlay.querySelectorAll('.no-suits-grid span');
        anime.set(suits, { opacity: 0, scale: 0.4 });
        anime({
          targets: suits, opacity: [0, 0.15], scale: [0.4, 1],
          delay: anime.stagger(80, { start: 350 }),
          duration: 600, easing: 'easeOutBack'
        });
      });
    }
  }

  /* -----------------------------------------------------------
     5. LOCOMOTIVE SCROLL — non-smooth in-view reveals
        (Lenis stays the smooth-scroll engine; Locomotive only
        detects elements entering view, with an IO backstop)
  ----------------------------------------------------------- */
  function initLocomotive() {
    function ioReveal() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('[data-scroll][data-scroll-class]').forEach(function (el) {
          el.classList.add('is-inview');
        });
        return;
      }
      var io = new IntersectionObserver(function (ens) {
        ens.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-inview'); io.unobserve(en.target); }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('[data-scroll][data-scroll-class]').forEach(function (el) { io.observe(el); });
    }

    if (typeof LocomotiveScroll !== 'undefined') {
      document.body.setAttribute('data-scroll-container', '');
      try {
        window.__loco = new LocomotiveScroll({
          el: document.body,
          smooth: false,
          smartphone: { smooth: false },
          tablet: { smooth: false }
        });
      } catch (e) { /* fall through to IO */ }
    }
    ioReveal();
  }

  /* -----------------------------------------------------------
     6. tsPARTICLES — hero particle field + CTA confetti
  ----------------------------------------------------------- */
  function initParticles() {
    if (window.tsParticles && !REDUCED && document.getElementById('hero-particles')) {
      var small = window.matchMedia('(max-width: 768px)').matches;
      tsParticles.load({
        id: 'hero-particles',
        options: {
          fullScreen: { enable: false },
          fpsLimit: 60,
          detectRetina: true,
          pauseOnOutsideViewport: true,
          interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
          particles: {
            number: { value: small ? 22 : 46, density: { enable: true, area: 900 } },
            color: { value: ['#C02125', '#ffffff'] },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
            links: { enable: true, color: '#C02125', distance: 130, opacity: 0.22, width: 1 },
            move: { enable: true, speed: 0.8, outModes: { default: 'out' } }
          }
        }
      }).catch(function () { /* never let a particle error break the page */ });
    }

    var cta = document.querySelector('.btn-gold');
    if (cta) {
      cta.addEventListener('click', function () {
        if (REDUCED || typeof window.confetti !== 'function') return;
        window.confetti({
          particleCount: 130, spread: 75, startVelocity: 45,
          origin: { y: 0.85 },
          colors: ['#C02125', '#ffffff', '#111111', '#e03e3f']
        });
      });
    }
  }

  /* -----------------------------------------------------------
     7. SplitType + Typed.js + Rough Notation
  ----------------------------------------------------------- */
  function initText() {
    if (!REDUCED && window.SplitType && window.gsap) {
      if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      document.querySelectorAll('[data-split]').forEach(function (el) {
        var split;
        try { split = new SplitType(el, { types: 'words, chars' }); }
        catch (e) { return; }
        if (!split.chars || !split.chars.length) return;
        gsap.from(split.chars, {
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          yPercent: 80, opacity: 0, duration: 0.6, ease: 'power3.out',
          stagger: 0.02, clearProps: 'transform,opacity'
        });
      });
    }

    if (!REDUCED && window.Typed) {
      var eb = document.querySelector('.hero__eyebrow');
      if (eb) {
        var original = eb.textContent.trim();
        try {
          eb.textContent = '';
          new Typed(eb, { strings: [original], typeSpeed: 55, startDelay: 500, showCursor: false, loop: false });
        } catch (e) { eb.textContent = original; }
      }
    }

    /* window.__usePageRN = true lets a page skip this block and
       manage Rough Notation annotations entirely on its own.          */
    if (!REDUCED && window.RoughNotation && !window.__usePageRN) {
      var rnTargets = [];
      document.querySelectorAll('.eyebrow').forEach(function (el) {
        rnTargets.push({ el: el, type: 'underline' });
      });
      var sig = document.querySelector('.custom__sig-label');
      if (sig) rnTargets.push({ el: sig, type: 'box' });

      /* Create the annotation only AFTER the element has settled into its final
         position — i.e. once its GSAP entrance (~0.9s + clearProps) has finished.
         Annotating earlier makes Rough Notation measure a transformed/animating
         box, so the stroke flashes in and then "disappears". We also annotate at
         show-time (not up front) and fire show() exactly once, so it stays. */
      function rnReveal(t) {
        if (t.done) return;
        t.done = true;
        try {
          var opts = (t.type === 'box')
            ? { type: 'box', color: '#C02125', strokeWidth: 1.5, padding: 6 }
            : { type: 'underline', color: '#C02125', strokeWidth: 2, padding: 3 };
          RoughNotation.annotate(t.el, opts).show();
        } catch (err) { /* leave the text un-annotated if RN fails */ }
      }

      rnTargets.forEach(function (t) {
        if (window.gsap && window.ScrollTrigger) {
          ScrollTrigger.create({
            trigger: t.el, start: 'top 80%', once: true,
            onEnter: function () { setTimeout(function () { rnReveal(t); }, 1000); }
          });
        } else if ('IntersectionObserver' in window) {
          var io = new IntersectionObserver(function (ens, obs) {
            ens.forEach(function (en) {
              if (!en.isIntersecting) return;
              obs.unobserve(en.target);
              setTimeout(function () { rnReveal(t); }, 1000);
            });
          }, { threshold: 0.4 });
          io.observe(t.el);
        } else {
          rnReveal(t);
        }
      });
    }
  }

  /* -----------------------------------------------------------
     8. Atropos (3D card tilt) + Granim (animated gradient)
  ----------------------------------------------------------- */
  function initAtroposGranim() {
    if (!REDUCED && typeof window.Atropos === 'function') {
      document.querySelectorAll('.deck-atropos').forEach(function (el) {
        try {
          Atropos({ el: el, activeOffset: 30, shadow: false, rotateXMax: 8, rotateYMax: 8, duration: 300 });
        } catch (e) { /* card stays static if it fails */ }
      });
    }

    if (!REDUCED && typeof window.Granim === 'function' && document.getElementById('cta-granim')) {
      try {
        new Granim({
          element: '#cta-granim',
          direction: 'diagonal',
          isPausedWhenNotInView: true,
          states: {
            'default-state': {
              gradients: [
                ['#1a0606', '#0d0d0d'],
                ['#2a0a0a', '#080808'],
                ['#230808', '#141414']
              ],
              transitionSpeed: 4500
            }
          }
        });
      } catch (e) { /* CTA keeps its solid dark background */ }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initGSAP();
    initLenis();
    initThree();
    initAnime();
    initLocomotive();
    initParticles();
    initText();
    initAtroposGranim();
  });
})();
