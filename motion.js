/* ============================================
   Create & Connect LA — depth & motion
   ============================================
   Shared by every styled page. No dependencies, no build step.

   The one rule this file follows: it never writes a transform. It only sets
   CSS custom properties that styles.css reads with neutral fallbacks, so if
   this script fails to load, is blocked, or is still parsing, every page
   renders exactly as it would without it. All visual tuning lives in the
   DEPTH & 3D block of styles.css.
   ============================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  function num(prop, fallback) {
    var v = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(prop)
    );
    return isNaN(v) ? fallback : v;
  }

  /* ---------- Card tilt ----------------------------------------------
     Delegated from the document rather than bound per element: the gallery
     page has ~80 cards, and this way new markup needs no wiring. */
  var TILT_SELECTOR = '.gallery-cell, .photo, .col-card, .next-event-flyer, .flyer-card';
  var tilted = null;
  var tiltMax = 5;

  function clearTilt() {
    if (!tilted) return;
    tilted.classList.remove('is-tilting');
    tilted.style.removeProperty('--tilt-rx');
    tilted.style.removeProperty('--tilt-ry');
    tilted.style.removeProperty('--tilt-z');
    tilted = null;
  }

  function onTiltMove(e) {
    var el = e.target.closest && e.target.closest(TILT_SELECTOR);
    if (el !== tilted) {
      clearTilt();
      if (!el) return;
      tilted = el;
      tilted.classList.add('is-tilting');
    }
    if (!el) return;

    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;

    // -0.5 … 0.5 from the card's centre.
    var px = (e.clientX - r.left) / r.width - 0.5;
    var py = (e.clientY - r.top) / r.height - 0.5;

    // Pointer above centre should tip the card's top edge away, hence -py.
    el.style.setProperty('--tilt-rx', (-py * 2 * tiltMax).toFixed(2) + 'deg');
    el.style.setProperty('--tilt-ry', (px * 2 * tiltMax).toFixed(2) + 'deg');
    el.style.setProperty('--tilt-z', '10px');
  }

  function initTilt() {
    if (reduced.matches || !canHover.matches) return;
    tiltMax = num('--tilt-max', 5);
    if (tiltMax <= 0) return;
    document.addEventListener('pointermove', onTiltMove, { passive: true });
    document.addEventListener('pointerleave', clearTilt, { passive: true });
    // A card that scrolls out from under a stationary cursor would otherwise
    // keep its tilt frozen in place.
    window.addEventListener('scroll', clearTilt, { passive: true });
  }

  /* ---------- Parallax -------------------------------------------------
     Transform-only and rAF-coalesced. Elements are tracked only while an
     IntersectionObserver says they are on screen, so an off-screen hero
     costs nothing. */
  var PARALLAX = [
    { sel: '.hero-image', rate: 0.16 },
    { sel: '.featured-image', rate: 0.12 },
    { sel: '.hero-inner', rate: -0.06 },
    { sel: '.event-detail-hero > .container', rate: -0.06 }
  ];
  var layers = [];
  var visible = [];
  var queued = false;

  function paint() {
    queued = false;
    var vh = window.innerHeight;
    for (var i = 0; i < visible.length; i++) {
      var L = visible[i];
      var r = L.el.getBoundingClientRect();
      // How far the element's centre sits from the viewport centre, in px.
      var offset = (r.top + r.height / 2) - vh / 2;
      L.el.style.setProperty('--par', (offset * L.rate).toFixed(1) + 'px');
    }
  }

  function onScroll() {
    if (queued || !visible.length) return;
    queued = true;
    requestAnimationFrame(paint);
  }

  function initParallax() {
    if (reduced.matches) return;
    if (!window.matchMedia('(min-width: 901px)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (num('--par-strength', 1) <= 0) return;

    PARALLAX.forEach(function (cfg) {
      Array.prototype.forEach.call(
        document.querySelectorAll(cfg.sel),
        function (el) { layers.push({ el: el, rate: cfg.rate }); }
      );
    });
    if (!layers.length) return;

    // Tells styles.css it is safe to apply the 1.08 overscan. Without this
    // class the images keep their original framing.
    document.documentElement.classList.add('parallax-on');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var L = layers.filter(function (x) { return x.el === entry.target; })[0];
        if (!L) return;
        var at = visible.indexOf(L);
        if (entry.isIntersecting && at === -1) visible.push(L);
        else if (!entry.isIntersecting && at !== -1) visible.splice(at, 1);
      });
      onScroll();
    }, { rootMargin: '100px' });

    layers.forEach(function (L) { io.observe(L.el); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  }

  /* ---------- The flyer card ------------------------------------------
     The flip itself is CSS (.flipped), so it already works without this
     script. What we add here is drag-to-spin, and keeping the button's
     aria-pressed honest when a drag changes which face is showing. */
  function initFlyer() {
    var card = document.querySelector('.flyer-card');
    if (!card) return;
    var btn = document.querySelector('.flyer-flip');

    function setFlipped(on) {
      card.classList.toggle('flipped', on);
      if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    if (btn) {
      btn.addEventListener('click', function () {
        setFlipped(!card.classList.contains('flipped'));
      });
    }

    if (reduced.matches) return;

    var dragging = false, startX = 0, base = 0, angle = 0, moved = 0;

    card.addEventListener('pointerdown', function (e) {
      dragging = true;
      moved = 0;
      startX = e.clientX;
      base = card.classList.contains('flipped') ? 180 : 0;
      angle = base;
      card.classList.add('is-dragging');
      card.setPointerCapture(e.pointerId);
    });

    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      angle = base + dx * 0.4;
      card.style.setProperty('--flip', angle.toFixed(1) + 'deg');
    });

    function release(e) {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      if (e.pointerId != null && card.hasPointerCapture(e.pointerId)) {
        card.releasePointerCapture(e.pointerId);
      }
      card.style.removeProperty('--flip');

      // A tap (no meaningful travel) should read as a flip, not a 0deg snap.
      if (moved < 6) {
        setFlipped(!card.classList.contains('flipped'));
        return;
      }
      // Otherwise snap to whichever face is now closer.
      var norm = ((angle % 360) + 360) % 360;
      setFlipped(norm > 90 && norm < 270);
    }

    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
  }

  function init() {
    initTilt();
    initParallax();
    initFlyer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
