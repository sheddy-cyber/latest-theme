/* ─── PROMO BAR ─────────────────────────── */
/* ─── NAV MEGA/DROPDOWN TOGGLE ──────────── */
(function () {
  var active = null;
  var menus  = { shop: 'menu-shop', care: 'menu-care' };
  var items  = { shop: 'ni-shop',   care: 'ni-care' };

  window.tog = function (k) {
    var next = k && k === active ? null : k;

    Object.keys(menus).forEach(function (id) {
      var el  = document.getElementById(menus[id]);
      var btn = document.getElementById(items[id]);
      if (el) el.classList.remove('open');
      if (btn) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    if (next) {
      var el  = document.getElementById(menus[next]);
      var btn = document.getElementById(items[next]);
      if (el) el.classList.add('open');
      if (btn) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
      active = next;
    } else {
      active = null;
    }
  };

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-wrap')) window.tog(null);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.tog(null);
  });
})();

/* ─── HERO CAROUSEL ─────────────────────── */
(function () {
  function initHero(hero) {
    if (!hero || hero.dataset.heroReady === 'true') return;

    var track = hero.querySelector('[data-hero-track]');
    if (!track) return;

    var slides = Array.prototype.slice.call(track.querySelectorAll('.slide'));
    if (!slides.length) return;

    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prevBtn = hero.querySelector('[data-hero-prev]');
    var nextBtn = hero.querySelector('[data-hero-next]');
    var total = slides.length;
    var cur = 0;
    var timer = null;
    var autoplayMs = parseInt(hero.getAttribute('data-autoplay-ms'), 10);

    if (!autoplayMs || autoplayMs < 2500) autoplayMs = 8500;

    function stopAutoplay() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    function startAutoplay() {
      stopAutoplay();
      if (total < 2) return;

      timer = setInterval(function () {
        goTo(cur + 1);
      }, autoplayMs);
    }

    function goTo(index) {
      var next = ((index % total) + total) % total;

      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');

      cur = next;

      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');

      track.style.transform = 'translate3d(-' + (cur * 100) + '%, 0, 0)';
      startAutoplay();
    }

    hero.dataset.heroReady = 'true';
    track.style.transform = 'translate3d(0, 0, 0)';

    if (prevBtn) {
      prevBtn.addEventListener('click', function (event) {
        event.preventDefault();
        goTo(cur - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (event) {
        event.preventDefault();
        goTo(cur + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-slide'), 10) || 0);
      });
    });

    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    startAutoplay();
  }

  function initAllHeroes(scope) {
    (scope || document).querySelectorAll('[data-hero-carousel]').forEach(initHero);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAllHeroes(document);
    });
  } else {
    initAllHeroes(document);
  }

  document.addEventListener('shopify:section:load', function (event) {
    initAllHeroes(event.target);
  });
})();

/* ─── FILTER TABS (homepage featured products) ─ */
(function () {
  var tabs  = document.querySelectorAll('.ftab');
  var cards = document.querySelectorAll('.product-card, .elysian-card');
  if (!tabs.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach(function (card) {
      var texture = (card.getAttribute('data-texture') || '').toLowerCase();
      var show = filter === 'all' || texture === filter;
      card.style.display = show ? '' : 'none';
    });
  }

  function activateTab(tab) {
    tabs.forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    applyFilter(tab.getAttribute('data-filter') || 'all');
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateTab(tab);
      }
    });
  });
})();

/* ─── MOBILE NAV ────────────────────────── */
window.toggleMobNav = function () {
  var nav     = document.getElementById('mob-nav');
  var overlay = document.getElementById('mob-overlay');
  var ham     = document.getElementById('ham-btn');
  if (!nav) return;
  var isOpen = nav.classList.contains('open');
  nav.classList.toggle('open', !isOpen);
  overlay && overlay.classList.toggle('open', !isOpen);
  ham && ham.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
};

window.toggleMobSub = function (id) {
  var sub = document.getElementById(id);
  if (!sub) return;
  var btn    = sub.previousElementSibling;
  var isOpen = sub.classList.contains('open');
  document.querySelectorAll('.mob-nav-sub').forEach(function (s) { s.classList.remove('open'); });
  document.querySelectorAll('.mob-nav-toggle').forEach(function (b) { b.classList.remove('open'); });
  if (!isOpen) {
    sub.classList.add('open');
    btn && btn.classList.add('open');
  }
};

window.addEventListener('resize', function () {
  if (window.innerWidth > 768) {
    var nav     = document.getElementById('mob-nav');
    var overlay = document.getElementById('mob-overlay');
    var ham     = document.getElementById('ham-btn');
    if (nav) nav.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (ham) ham.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ─── CART COUNT SYNC ───────────────────── */
(function () {
  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        document.querySelectorAll('.cart-ct').forEach(function (el) {
          el.textContent = data.item_count;
        });
      })
      .catch(function () {});
  }

  document.addEventListener('cart:updated', updateCartCount);
  updateCartCount();
})();
