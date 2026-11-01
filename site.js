(function () {
  var d = document, de = d.documentElement;
  de.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, hover = matchMedia('(hover:hover)').matches;
  var hd = d.querySelector('header.top');
  function sc() { hd && hd.classList.toggle('scrolled', scrollY > 20); }
  addEventListener('scroll', sc, { passive: true }); sc();

  // меню на телефоне
  var bg = d.querySelector('.burger');
  if (bg) {
    bg.addEventListener('click', function () { var o = hd.classList.toggle('open'); bg.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    d.querySelectorAll('nav.main a').forEach(function (a) { a.addEventListener('click', function () { hd.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') hd.classList.remove('open'); });
  }

  // появление блоков
  var rv = [].slice.call(d.querySelectorAll('.rv'));
  try {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } catch (e) { rv.forEach(function (n) { n.classList.add('in'); }); }

  d.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  // всплывающая подсказка
  var tt;
  function toast(t) {
    var el = d.querySelector('.toast');
    if (!el) { el = d.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); d.body.appendChild(el); }
    el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('on'); }, 2200);
  }
  function copy(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).then(function () { toast('Скопировано'); }, function () { toast(t); });
    var a = d.createElement('textarea'); a.value = t; d.body.appendChild(a); a.select();
    try { d.execCommand('copy'); toast('Скопировано'); } catch (e) { toast(t); }
    a.remove();
  }
  d.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () { var s = b.getAttribute('data-copy'); var el = s.charAt(0) === '#' ? d.querySelector(s) : null; copy(el ? el.textContent.trim() : s); }); });
  d.querySelectorAll('[data-share]').forEach(function (b) {
    if (!navigator.share) { b.hidden = true; return; }
    b.addEventListener('click', function () { navigator.share({ title: d.title, text: b.getAttribute('data-share'), url: location.origin + '/' }).catch(function () {}); });
  });

  // галерея: кнопки вперёд/назад
  d.querySelectorAll('[data-gal]').forEach(function (nv) {
    var g = d.getElementById(nv.getAttribute('data-gal'));
    if (!g) return;
    nv.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { g.scrollBy({ left: (b.value === 'next' ? 1 : -1) * Math.min(600, g.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' }); }); });
  });

  // вкладки «на компьютере»
  d.querySelectorAll('[data-tabs]').forEach(function (tb) {
    var img = d.getElementById(tb.getAttribute('data-tabs')), url = d.getElementById(tb.getAttribute('data-tabs') + '-url');
    tb.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        tb.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        img.src = b.getAttribute('data-src'); img.alt = b.getAttribute('data-alt') || img.alt;
        if (url) url.textContent = b.getAttribute('data-url') || 'mkwmusic.ru';
      });
    });
  });

  if (reduce) return;
  var w = d.getElementById('win');
  if (w && hover) {
    w.addEventListener('pointermove', function (e) { var r = w.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; w.style.transform = 'perspective(1400px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg)'; });
    w.addEventListener('pointerleave', function () { w.style.transform = ''; });
  }

  // звёзды
  var cv = d.getElementById('stars');
  if (!cv || !cv.getContext) return;
  var cx = cv.getContext('2d'), S = [], W = 0, H = 0, run = true, weak = (navigator.hardwareConcurrency || 4) <= 2;
  function size() {
    W = cv.width = innerWidth; H = cv.height = innerHeight; S = [];
    var n = Math.round(W * H / (weak ? 30000 : 14000));
    for (var i = 0; i < n; i++) S.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.3, a: Math.random() * 6, s: Math.random() * 0.012 + 0.003 });
  }
  size(); addEventListener('resize', size);
  d.addEventListener('visibilitychange', function () { run = !d.hidden; if (run) requestAnimationFrame(t); });
  function t() {
    if (!run) return;
    cx.clearRect(0, 0, W, H); cx.fillStyle = '#fff';
    for (var i = 0; i < S.length; i++) { var s = S[i]; s.a += s.s; cx.globalAlpha = 0.25 + Math.abs(Math.sin(s.a)) * 0.6; cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 6.283); cx.fill(); }
    requestAnimationFrame(t);
  }
  requestAnimationFrame(t);
})();
