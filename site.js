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

// ===== интерактив главной =====
(function () {
  var d = document, root = d.documentElement;
  // вкладки возможностей: телефон меняет экран, сами переключаются, пока вы не нажали
  var tabs = [].slice.call(d.querySelectorAll('.ft')), A = d.getElementById('fimg'), B = d.getElementById('fimg2'), more = d.getElementById('fmore');
  if (tabs.length && A) {
    var cur = 0, auto = true, timer = 0, DUR = 5000, front = A, back = B;
    tabs.forEach(function (b) { b.style.setProperty('--dur', DUR + 'ms'); });
    var pre = tabs.map(function (b) { var i = new Image(); i.src = b.dataset.img; return i; });
    function go(i, user) {
      cur = i; tabs.forEach(function (b, k) { b.classList.toggle('on', k === i); b.classList.remove('run'); b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      var t = tabs[i]; void t.offsetWidth; if (auto) t.classList.add('run');
      back.src = t.dataset.img; back.style.transform = 'scale(1.04)';
      requestAnimationFrame(function () { back.style.opacity = 1; back.style.transform = 'scale(1)'; front.style.opacity = 0; var x = front; front = back; back = x; });
      more.href = t.dataset.more;
      if (user && window.matchMedia('(max-width:900px)').matches) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      clearTimeout(timer); if (auto) timer = setTimeout(function () { go((cur + 1) % tabs.length); }, DUR);
    }
    A.style.opacity = 1;
    tabs.forEach(function (b, i) { b.addEventListener('click', function () { auto = false; go(i, true); }); });
    try {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && auto) go(cur); else clearTimeout(timer); }); }, { threshold: .35 }).observe(d.querySelector('.fx'));
    } catch (e) { go(0); }
  }
  // свой цвет: перекрашивает и сайт, и экран телефона
  var sws = [].slice.call(d.querySelectorAll('.sw')), hue = d.querySelector('.hue'), cimg = d.querySelector('.cphone img');
  function paint(h) {
    h = +h; root.style.setProperty('--p', 'hsl(' + (331 + h) + ',100%,74%)'); root.style.setProperty('--p2', 'hsl(' + (254 + h) + ',100%,71%)');
    if (cimg) cimg.style.filter = 'hue-rotate(' + h + 'deg)';
    sws.forEach(function (s) { s.classList.toggle('on', +s.dataset.h === h); });
  }
  sws.forEach(function (s) { s.addEventListener('click', function () { if (hue) hue.value = s.dataset.h; paint(s.dataset.h); }); });
  if (hue) hue.addEventListener('input', function () { paint(hue.value); });
  // установка: Android / iPhone / ПК
  var ot = d.querySelector('[data-os-tabs]');
  if (ot) {
    var btns = [].slice.call(ot.querySelectorAll('button')), panes = [].slice.call(d.querySelectorAll('.os-steps'));
    function os(k) { btns.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.os === k ? 'true' : 'false'); }); panes.forEach(function (p) { p.hidden = p.dataset.os !== k; }); }
    btns.forEach(function (b) { b.addEventListener('click', function () { os(b.dataset.os); }); });
    var ua = navigator.userAgent; os(/iPhone|iPad|Macintosh.*Mobile/.test(ua) ? 'ios' : /Android/.test(ua) ? 'android' : 'pc');
  }
  // трейлер
  var m = d.getElementById('trailer');
  if (m) {
    var v = m.querySelector('video');
    function close() { m.hidden = true; v.pause(); }
    d.querySelectorAll('[data-trailer]').forEach(function (b) { b.addEventListener('click', function () { if (!v.src) v.src = v.dataset.src; m.hidden = false; v.play().catch(function () {}); }); });
    m.addEventListener('click', function (e) { if (e.target === m || e.target.classList.contains('mclose')) close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !m.hidden) close(); });
  }
})();

// ===== живые эффекты (v5) =====
(function () {
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  // полоса прогресса прокрутки
  var pr = d.createElement('div'); pr.className = 'prog'; d.body.appendChild(pr);
  function prog() { var h = d.documentElement.scrollHeight - innerHeight; pr.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')'; }
  addEventListener('scroll', prog, { passive: true }); prog();
  if (reduce || !fine) return;
  // мягкая подсветка за курсором
  var sp = d.createElement('div'); sp.className = 'spot'; d.body.appendChild(sp);
  var mx = innerWidth / 2, my = innerHeight / 2, sx = mx, sy = my;
  addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; sp.style.opacity = 1; }, { passive: true });
  d.addEventListener('pointerleave', function () { sp.style.opacity = 0; });
  // телефоны на первом экране следуют за мышью (разная глубина)
  var st = d.querySelector('.hero2 .stage'), phs = st ? [].slice.call(st.querySelectorAll('.ph')) : [], depth = [18, 30, 14];
  var big = d.querySelector('.ph.big');
  (function loop() {
    sx += (mx - sx) * .12; sy += (my - sy) * .12;
    sp.style.transform = 'translate(' + sx + 'px,' + sy + 'px)';
    var nx = sx / innerWidth - .5, ny = sy / innerHeight - .5;
    phs.forEach(function (p, i) { p.style.transform = 'translate(' + (-nx * depth[i]) + 'px,' + (-ny * depth[i]) + 'px)'; });
    requestAnimationFrame(loop);
  })();
  // наклон большого телефона за курсором
  if (big) {
    var box = big.parentElement;
    box.addEventListener('pointermove', function (e) { var r = big.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; big.style.transform = 'perspective(900px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 10) + 'deg)'; });
    box.addEventListener('pointerleave', function () { big.style.transform = ''; });
  }
  // «магнитные» кнопки
  d.querySelectorAll('.btn,.tgcard').forEach(function (b) {
    b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .18) + 'px,' + ((e.clientY - r.top - r.height / 2) * .25) + 'px)'; });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });
})();

/* 0.35: стикеры улетают в чат + кнопка «Открыть» внизу на телефоне */
(function () {
  var d = document, chat = d.querySelector('[data-cm]'), st = d.querySelector('[data-cm-st]');
  var all = [].slice.call(d.querySelectorAll('.sg'));
  var reply = ['s10', 's2', 'c10', 's5', 's33', 'c3', 's24', 'c14', 's12', 's29'];
  var busy = 0;
  function add(src, who) {
    if (!chat) return;
    var w = d.createElement('div'); w.className = 'cm-st new ' + who;
    var im = new Image(); im.src = '/img/st/' + src + '.webp'; im.alt = ''; im.width = 130; im.height = 130;
    w.appendChild(im); chat.appendChild(w);
    var fit = function () { var hgt = 28; for (var i = 0; i < chat.children.length; i++) hgt += chat.children[i].offsetHeight + 8; return hgt <= chat.clientHeight; };
    while (chat.children.length > 1 && (chat.children.length > 4 || !fit())) chat.removeChild(chat.firstChild);
  }
  function send(btn) {
    var s = btn.getAttribute('data-s');
    btn.classList.remove('sent'); void btn.offsetWidth; btn.classList.add('sent');
    add(s, 'me');
    clearTimeout(busy);
    if (st) { st.textContent = 'выбирает стикер…'; st.classList.add('typing'); }
    busy = setTimeout(function () {
      add(reply[Math.floor(Math.random() * reply.length)], 'them');
      if (st) { st.textContent = 'в сети'; st.classList.remove('typing'); }
    }, 1100);
    if (chat) { var r = chat.getBoundingClientRect(); if (r.bottom < 80 || r.top > innerHeight - 80) chat.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
  all.forEach(function (b) { b.addEventListener('click', function () { send(b); }); });
  var rnd = d.querySelector('[data-stk-rand]');
  if (rnd) rnd.addEventListener('click', function () { if (all.length) send(all[Math.floor(Math.random() * all.length)]); });
  var cta = d.querySelector('.sticky-cta'), hero = d.querySelector('.hero');
  if (cta && hero) {
    var fin = d.querySelector('.final');
    var upd = function () {
      var past = hero.getBoundingClientRect().bottom < 60;
      var atEnd = fin && fin.getBoundingClientRect().top < innerHeight;
      var cm = d.querySelector('.chatm'), inChat = false;
      if (cm) { var r = cm.getBoundingClientRect(); inChat = r.top < innerHeight && r.bottom > 0; }
      cta.classList.toggle('on', past && !atEnd && !inChat);
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }
})();
