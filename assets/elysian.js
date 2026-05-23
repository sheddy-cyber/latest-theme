/* ─── PROMO BAR ─────────────────────────── */
(function () {
  var msgs = document.querySelectorAll('.promo-msg');
  if (msgs.length < 2) return;
  var idx = 0;
  setInterval(function () {
    msgs[idx].classList.remove('active');
    idx = (idx + 1) % msgs.length;
    msgs[idx].classList.add('active');
  }, 3800);
})();

/* ─── NAV MEGA/DROPDOWN TOGGLE ──────────── */
(function () {
  var active = null;
  var menus  = { shop: 'menu-shop', tex: 'menu-tex', care: 'menu-care' };
  var items  = { shop: 'ni-shop',   tex: 'ni-tex',   care: 'ni-care' };

  window.tog = function (k) {
    Object.keys(menus).forEach(function (id) {
      var el  = document.getElementById(menus[id]);
      var btn = document.getElementById(items[id]);
      if (el) el.classList.remove('open');
      if (btn) btn.classList.remove('open');
    });
    if (k && k !== active) {
      var el  = document.getElementById(menus[k]);
      var btn = document.getElementById(items[k]);
      if (el) el.classList.add('open');
      if (btn) btn.classList.add('open');
      active = k;
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
  var track = document.getElementById('st');
  if (!track) return;
  var slides = track.querySelectorAll('.slide');
  var dots   = document.querySelectorAll('.h-dot');
  var cur    = 0;
  var total  = slides.length;
  var timer;

  window.gt = function (n) {
    slides[cur].classList.remove('active');
    dots[cur] && dots[cur].classList.remove('active');
    cur = ((n % total) + total) % total;
    window._heroCur = cur;
    slides[cur].classList.add('active');
    dots[cur] && dots[cur].classList.add('active');
    track.style.transform = 'translateX(-' + (cur * 100) + '%)';
    clearInterval(timer);
    timer = setInterval(function () { window.gt(cur + 1); }, 5500);
  };

  window._heroCur = 0;
  timer = setInterval(function () { window.gt(cur + 1); }, 5500);

  var prevBtn = document.getElementById('hero-prev');
  var nextBtn = document.getElementById('hero-next');
  if (prevBtn) prevBtn.addEventListener('click', function () { window.gt(cur - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { window.gt(cur + 1); });

  document.querySelectorAll('.h-dot[data-slide]').forEach(function (dot) {
    dot.addEventListener('click', function () { window.gt(parseInt(dot.getAttribute('data-slide'), 10)); });
  });
})();

/* ─── FILTER TABS ───────────────────────── */
(function () {
  var tabs  = document.querySelectorAll('.ftab');
  var cards = document.querySelectorAll('.product-card');
  if (!tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-texture') === filter;
        card.style.display = show ? '' : 'none';
      });
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
