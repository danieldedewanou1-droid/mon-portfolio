/* Portfolio de Daniel DEDE-WANOU — comportements de la page */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var root = document.documentElement;

    /* ===== Thème clair / sombre ===== */
    var themeBtn = document.getElementById('themeToggle');
    function setThemeIcon() {
        var isDark = root.getAttribute('data-theme') === 'dark';
        if (themeBtn) themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
    try {
        var saved = localStorage.getItem('portfolio-theme');
        if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (err) { /* stockage indisponible : on garde le thème par défaut */ }
    setThemeIcon();
    if (themeBtn) themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('portfolio-theme', next); } catch (err) { /* ignoré */ }
        setThemeIcon();
    });

    /* ===== Effet machine à écrire ===== */
    var typedEl = document.getElementById('typed');
    var phrases = [
        'Étudiant BTS SIO — option SISR',
        'Administration Windows Server et Active Directory',
        'Réseaux, VLAN et virtualisation',
        'Cybersécurité et support informatique'
    ];
    var ti = 0, ci = 0, deleting = false;
    function typeTick() {
        var word = phrases[ti % phrases.length];
        if (!deleting) {
            ci++;
            typedEl.textContent = word.slice(0, ci);
            if (ci === word.length) { deleting = true; setTimeout(typeTick, 1700); return; }
            setTimeout(typeTick, 55);
        } else {
            ci--;
            typedEl.textContent = word.slice(0, ci);
            if (ci === 0) { deleting = false; ti++; setTimeout(typeTick, 350); return; }
            setTimeout(typeTick, 28);
        }
    }
    if (typedEl && !reduceMotion) { typedEl.textContent = ''; typeTick(); }

    /* ===== Apparition au scroll ===== */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('in'); revObs.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { revObs.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ===== Compteurs animés ===== */
    function runCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (reduceMotion || isNaN(target)) { return; }
        var start = null, dur = 1400;
        function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step); else el.textContent = target;
        }
        requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window) {
        var cntObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { runCounter(en.target); cntObs.unobserve(en.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { cntObs.observe(c); });
    }

    /* ===== Effet 3D et halo lumineux sur les cartes ===== */
    var canHover = window.matchMedia('(hover: hover)').matches && !reduceMotion;
    document.querySelectorAll('.tilt').forEach(function (el) {
        var max = el.id === 'terminal' ? 6 : (el.id === 'contactCard' ? 2 : 6);
        el.addEventListener('mousemove', function (e) {
            var r = el.getBoundingClientRect();
            var x = e.clientX - r.left, y = e.clientY - r.top;
            el.style.setProperty('--mx', x + 'px');
            el.style.setProperty('--my', y + 'px');
            if (!canHover) return;
            var rx = ((y / r.height) - 0.5) * -max;
            var ry = ((x / r.width) - 0.5) * max;
            el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });

    /* ===== Halo qui suit la souris ===== */
    var glow = document.getElementById('cursorGlow');
    window.addEventListener('mousemove', function (e) {
        if (!glow) return;
        glow.style.opacity = 1;
        glow.style.transform = 'translate(' + (e.clientX - 220) + 'px,' + (e.clientY - 220) + 'px)';
    });
    document.addEventListener('mouseleave', function () { if (glow) glow.style.opacity = 0; });

    /* ===== Scroll : progression, en-tête, bouton retour, lien actif ===== */
    var bar = document.getElementById('progressBar');
    var header = document.getElementById('header');
    var toTop = document.getElementById('toTop');
    var navAnchors = document.querySelectorAll('.nav-links a');
    var sectionIds = [];
    navAnchors.forEach(function (a) { sectionIds.push(a.getAttribute('href').slice(1)); });
    var ticking = false;

    function onScroll() {
        var y = window.scrollY || document.documentElement.scrollTop;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
        if (header) header.classList.toggle('scrolled', y > 20);
        if (toTop) toTop.classList.toggle('show', y > 600);
        var current = '';
        sectionIds.forEach(function (id) {
            var s = document.getElementById(id);
            if (s && s.getBoundingClientRect().top <= 160) current = id;
        });
        navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

    /* ===== Menu mobile ===== */
    var navLinks = document.getElementById('navLinks');
    var menuBtn = document.getElementById('menuBtn');
    if (menuBtn && navLinks) menuBtn.addEventListener('click', function () {
        var open = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navAnchors.forEach(function (a) {
        a.addEventListener('click', function () {
            if (navLinks) navLinks.classList.remove('open');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    /* ===== Filtre et recherche des projets ===== */
    var grid = document.getElementById('projectsGrid');
    if (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.project-card'));
        var sel = document.getElementById('catFilter');
        var input = document.getElementById('projSearch');
        var count = document.getElementById('projCount');
        var empty = document.getElementById('projEmpty');
        var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
        var applyFilter = function () {
            var cat = sel ? sel.value : 'all';
            var term = input ? norm(input.value.trim()) : '';
            var shown = 0;
            cards.forEach(function (c) {
                var okCat = cat === 'all' || (' ' + c.getAttribute('data-cats') + ' ').indexOf(' ' + cat + ' ') > -1;
                var okTxt = !term || norm(c.getAttribute('data-search') || '').indexOf(term) > -1;
                var show = okCat && okTxt;
                c.hidden = !show;
                if (show) { shown++; c.classList.add('in'); }
            });
            if (count) count.textContent = shown + (shown > 1 ? ' projets' : ' projet');
            if (empty) empty.hidden = shown !== 0;
        };
        if (sel) sel.addEventListener('change', applyFilter);
        if (input) input.addEventListener('input', applyFilter);
    }

    /* ===== Réseau de particules (canvas) ===== */
    (function () {
        var c = document.getElementById('net');
        if (!c || reduceMotion) return;
        var ctx = c.getContext('2d');
        if (!ctx) return;
        var w, h, dpr, pts = [];
        var mouse = { x: null, y: null };

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = c.width = Math.floor(window.innerWidth * dpr);
            h = c.height = Math.floor(window.innerHeight * dpr);
            c.style.width = window.innerWidth + 'px';
            c.style.height = window.innerHeight + 'px';
            var n = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
            pts = [];
            for (var i = 0; i < n; i++) {
                pts.push({
                    x: Math.random() * w, y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.4 * dpr, vy: (Math.random() - 0.5) * 0.4 * dpr,
                    r: (Math.random() * 1.6 + 0.7) * dpr
                });
            }
        }
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', function (e) { mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr; });
        window.addEventListener('mouseout', function () { mouse.x = null; mouse.y = null; });
        resize();

        function draw() {
            ctx.clearRect(0, 0, w, h);
            var light = root.getAttribute('data-theme') === 'light';
            var col = light ? '79,70,229' : '120,170,255';
            var link = 130 * dpr, mlink = 180 * dpr;

            for (var i = 0; i < pts.length; i++) {
                var p = pts[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + col + ',0.75)';
                ctx.fill();

                for (var j = i + 1; j < pts.length; j++) {
                    var q = pts[j];
                    var dx = p.x - q.x, dy = p.y - q.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    if (d < link) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(' + col + ',' + (0.22 * (1 - d / link)) + ')';
                        ctx.lineWidth = dpr * 0.8;
                        ctx.stroke();
                    }
                }
                if (mouse.x !== null) {
                    var mx = p.x - mouse.x, my = p.y - mouse.y;
                    var md = Math.sqrt(mx * mx + my * my);
                    if (md < mlink) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = 'rgba(' + (light ? '236,72,153' : '6,182,212') + ',' + (0.5 * (1 - md / mlink)) + ')';
                        ctx.lineWidth = dpr;
                        ctx.stroke();
                        p.x += mx * 0.004; p.y += my * 0.004;
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    })();
})();
