/* Builds the page from content.js and runs all of the movement. */
(function () {
  'use strict';

  const S = window.SITE;
  if (!S) { return; }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const root = document.documentElement;

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) { continue; }
        if (k === 'class') { el.className = v; }
        else if (k === 'html') { el.innerHTML = v; }
        else if (k.startsWith('on')) { el.addEventListener(k.slice(2), v); }
        else { el.setAttribute(k, v === true ? '' : v); }
      }
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) { continue; }
      el.append(kid.nodeType ? kid : document.createTextNode(kid));
    }
    return el;
  }

  /* Icons ---------------------------------------------------------------- */

  const svg = (inner, size) => `<svg viewBox="0 0 24 24" width="${size || 20}" height="${size || 20}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const ICON = {
    arrow: svg('<path d="M5 12h14M13 6l6 6-6 6"/>', 18),
    ext: svg('<path d="M7 17L17 7M8 7h9v9"/>', 18),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: svg('<path d="M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z"/>'),
    copy: svg('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 017.5 4H15"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
    up: svg('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    back: svg('<path d="M15 5l-7 7 7 7"/>'),
    star: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z"/></svg>'
  };

  /* Theme---------------------------------------------------- */

  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage can be blocked */ } }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  function effectiveTheme() {
    const a = root.getAttribute('data-theme');
    if (a === 'dark' || a === 'light') { return a; }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeButton() {
    const btn = $('#theme-toggle');
    const dark = effectiveTheme() === 'dark';
    btn.innerHTML = dark ? ICON.sun : ICON.moon;
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }

  function setTheme(t, opts) {
    const animate = !opts || opts.animate !== false;
    if (animate) { root.classList.add('theme-anim'); }
    root.setAttribute('data-theme', t);
    if (!opts || opts.save !== false) { store('md-theme', t); }
    updateThemeButton();
    if (animate) { setTimeout(() => root.classList.remove('theme-anim'), 520); }
  }

  /* Toast ---------------------------------------------------------------- */

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(S.email);
      toast('Email copied');
    } catch (e) {
      toast('Copy is blocked here. Select the address instead.');
    }
  }

  /* Project art ---------------------------------------------------------- */

  function artSearch() {
    let tiles = '';
    let k = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const x = 148 + c * 54;
        const y = 78 + r * 52;
        const cls = (k % 3 === 1) ? 'sv-tint2' : 'sv-tint';
        tiles += `<rect class="${cls} sv-ink sv-thin" x="${x}" y="${y}" width="50" height="44" rx="8"/>` +
          `<polygon class="sv-accent sv-ink sv-thin" points="${x + 20},${y + 13} ${x + 20},${y + 31} ${x + 35},${y + 22}"/>`;
        k++;
      }
    }
    return `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of a phone showing video search results">
      <g class="sv-float">
        <rect class="sv-surface sv-ink" x="135" y="16" width="130" height="270" rx="24"/>
        <rect class="sv-tint sv-ink sv-thin" x="148" y="42" width="104" height="24" rx="12"/>
        <circle class="sv-ink sv-none sv-thin" cx="162" cy="54" r="5"/>
        ${tiles}
        <rect class="sv-hl" x="148" y="78" width="50" height="44" rx="8"/>
      </g>
      <g class="sv-bob">
        <circle class="sv-surface sv-ink" cx="72" cy="150" r="32"/>
        <line class="sv-ink" x1="96" y1="174" x2="120" y2="200" style="stroke-width:8"/>
        <path class="sv-ink sv-none sv-thin" d="M58 140a18 18 0 0 1 14-9"/>
      </g>
      <path class="sv-accent2 sv-ink sv-thin" d="M320 70l6 16 16 6-16 6-6 16-6-16-16-6 16-6z"/>
      <path class="sv-accent sv-ink sv-thin" d="M338 190l4 11 11 4-11 4-4 11-4-11-11-4 11-4z"/>
    </svg>`;
  }

  function artChat() {
    return `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of a phone showing a chat and a network of people">
      <g class="sv-ink sv-none sv-thin" style="stroke-dasharray:6 6">
        <line x1="76" y1="92" x2="138" y2="120"/><line x1="86" y1="206" x2="138" y2="180"/>
        <line x1="326" y1="112" x2="262" y2="140"/><line x1="336" y1="220" x2="262" y2="190"/>
      </g>
      <circle class="sv-accent sv-ink sv-pulse" cx="60" cy="86" r="16" style="stroke-width:0;opacity:.5"/>
      <circle class="sv-accent sv-ink" cx="60" cy="86" r="16"/>
      <circle class="sv-accent2 sv-ink" cx="76" cy="212" r="12"/>
      <circle class="sv-accent2 sv-ink" cx="332" cy="106" r="14"/>
      <circle class="sv-accent sv-ink" cx="344" cy="226" r="18"/>
      <g class="sv-float">
        <rect class="sv-surface sv-ink" x="135" y="16" width="130" height="270" rx="24"/>
        <rect class="sv-tint sv-ink sv-thin" x="148" y="48" width="80" height="24" rx="12"/>
        <rect class="sv-accent sv-ink sv-thin" x="172" y="82" width="82" height="24" rx="12"/>
        <rect class="sv-tint sv-ink sv-thin" x="148" y="116" width="96" height="24" rx="12"/>
        <rect class="sv-accent sv-ink sv-thin" x="196" y="150" width="58" height="24" rx="12"/>
        <rect class="sv-tint2 sv-ink sv-thin" x="148" y="184" width="50" height="24" rx="12"/>
        <g><circle class="sv-dot sv-ink" cx="162" cy="196" r="3.4" style="stroke-width:0;fill:var(--ink)"/><circle class="sv-dot" cx="173" cy="196" r="3.4" style="fill:var(--ink)"/><circle class="sv-dot" cx="184" cy="196" r="3.4" style="fill:var(--ink)"/></g>
        <rect class="sv-surface sv-ink sv-thin" x="148" y="250" width="104" height="24" rx="12"/>
      </g>
    </svg>`;
  }

  function artBrowser() {
    return `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of a browser window showing a 3D box with a comment pin">
      <rect class="sv-surface sv-ink" x="34" y="30" width="332" height="240" rx="14"/>
      <line class="sv-ink sv-thin" x1="34" y1="62" x2="366" y2="62"/>
      <circle class="sv-accent" cx="54" cy="46" r="5"/><circle class="sv-accent2" cx="72" cy="46" r="5"/><circle class="sv-tint" cx="90" cy="46" r="5"/>
      <rect class="sv-tint2 sv-ink sv-thin" x="46" y="74" width="74" height="184" rx="8"/>
      <rect class="sv-surface sv-ink sv-thin" x="54" y="86" width="58" height="12" rx="6"/>
      <rect class="sv-surface sv-ink sv-thin" x="54" y="108" width="58" height="12" rx="6"/>
      <rect class="sv-accent sv-ink sv-thin" x="54" y="130" width="58" height="12" rx="6"/>
      <g class="sv-float">
        <polygon class="sv-tint sv-ink" points="240,104 292,130 240,156 188,130"/>
        <polygon class="sv-tint2 sv-ink" points="188,130 240,156 240,222 188,196"/>
        <polygon class="sv-accent sv-ink" points="292,130 240,156 240,222 292,196"/>
        <circle class="sv-accent2 sv-ink sv-pulse" cx="262" cy="150" r="8" style="stroke-width:0;opacity:.6"/>
        <circle class="sv-accent2 sv-ink" cx="262" cy="150" r="8"/>
      </g>
      <rect class="sv-surface sv-ink sv-thin" x="286" y="82" width="68" height="34" rx="9"/>
      <line class="sv-ink sv-thin" x1="296" y1="94" x2="344" y2="94"/><line class="sv-ink sv-thin" x1="296" y1="105" x2="326" y2="105"/>
    </svg>`;
  }

  function artCards() {
    const person = '<circle class="sv-ink sv-thin" cx="0" cy="-16" r="13" style="fill:var(--ink)"/><path class="sv-ink sv-thin" d="M-24 40C-24 12 24 12 24 40Z" style="fill:var(--ink)"/>';
    return `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of three playing cards, one marked with a question mark">
      <g transform="translate(200 150)">
        <g transform="translate(-86 8) rotate(-16)"><g class="sv-sway">
          <rect class="sv-tint sv-ink" x="-44" y="-62" width="88" height="124" rx="12"/>${person}
        </g></g>
        <g transform="translate(86 8) rotate(16)"><g class="sv-sway" style="animation-delay:-1.5s">
          <rect class="sv-tint2 sv-ink" x="-44" y="-62" width="88" height="124" rx="12"/>${person}
        </g></g>
        <g transform="translate(0 -6)"><g class="sv-sway" style="animation-delay:-3s">
          <rect class="sv-surface sv-ink" x="-46" y="-68" width="92" height="132" rx="12"/>
          <text x="0" y="22" text-anchor="middle" font-size="84" style="fill:var(--accent-2);font-family:var(--display);font-weight:800">?</text>
        </g></g>
      </g>
    </svg>`;
  }

  const ART = { search: artSearch, chat: artChat, browser: artBrowser, cards: artCards };

  /* Sections ------------------------------------------------------------- */

  function reveal(el, delay) {
    el.setAttribute('data-reveal', '');
    if (delay) { el.style.setProperty('--d', delay + 'ms'); }
    return el;
  }

  function sectionHead(id, kicker, title) {
    return h('div', { class: 'sec-head' },
      reveal(h('p', { class: 'kicker' }, kicker)),
      reveal(h('h2', { class: 'title', id: id + '-title' }, title), 60));
  }

  function renderHero() {
    const name = h('h1', { class: 'name', 'aria-label': S.name.first + ' ' + S.name.last });
    let idx = 0;
    [S.name.first, S.name.last].forEach((word) => {
      const line = h('span', { class: 'line', 'aria-hidden': 'true' });
      Array.from(word.toUpperCase()).forEach((c) => {
        line.append(h('span', { class: 'ch', style: '--i:' + idx++ }, c));
      });
      name.append(line);
    });

    const seeWork = h('a', { class: 'btn', href: '#work' }, 'See the work', h('span', { class: 'dot', html: ICON.arrow }));
    const door = h('button', { class: 'door', type: 'button', onclick: openPlayground },
      h('span', { class: 'ping', 'aria-hidden': 'true' }),
      'The other half of this site is a phone',
      h('span', { class: 'chip-tag' }, 'open it'));

    const stats = h('div', { class: 'stats enter', style: '--e:900ms' },
      S.stats.map((s) => h('div', { class: 'stat' },
        h('b', { 'data-count': s.value }, String(s.value)),
        h('span', null, s.label))));

    return h('section', { class: 'hero', id: 'hero' },
      h('div', { class: 'wrap' },
        h('p', { class: 'loc enter' }, S.location),
        name,
        h('p', { class: 'lead enter', style: '--e:650ms' }, S.tagline),
        h('p', { class: 'hero-sub enter', style: '--e:720ms' }, S.subline),
        h('div', { class: 'cta-row enter', style: '--e:800ms' }, seeWork, door),
        stats));
  }

  function renderMarquee() {
    const set = () => h('div', { class: 'm-set' },
      S.ticker.map((t) => h('span', { class: 'm-item' }, t, h('span', { class: 'm-star', html: ICON.star }))));
    const second = set();
    second.setAttribute('aria-hidden', 'true');
    return h('div', { class: 'marquee-wrap', 'aria-hidden': 'true' },
      h('div', { class: 'marquee' }, h('div', { class: 'marquee-track' }, set(), second)));
  }

  function portrait() {
    return h('img', { src: S.photo, alt: 'Portrait of ' + S.name.first + ' ' + S.name.last });
  }

  function renderAbout() {
    const a = S.about;
    return h('section', { class: 'section', id: 'about', 'aria-labelledby': 'about-title' },
      h('div', { class: 'wrap' },
        sectionHead('about', 'About', a.heading),
        h('div', { class: S.photo ? 'about' : 'about about--solo' },
          S.photo ? reveal(h('div', { class: 'portrait' }, portrait())) : null,
          h('div', null,
            reveal(h('p', { class: 'about-lead' }, a.lead), 80),
            a.paragraphs.map((p, i) => reveal(h('p', null, p), 140 + i * 80))))));
  }

  function renderSkills() {
    const colors = ['var(--accent)', 'var(--accent-2)', 'var(--accent)', 'var(--accent-2)'];
    const rows = S.skills.map((g, gi) => reveal(h('div', { class: 'skill-row' },
      h('h3', { class: 'skill-name' }, g.group),
      h('div', { class: 'chips', style: '--c:' + colors[gi % colors.length] },
        g.items.map((it) => h('span', { class: 'chip' }, h('i', null, it[1]), it[0])))), gi * 70));
    return h('section', { class: 'section', id: 'skills', 'aria-labelledby': 'skills-title' },
      h('div', { class: 'wrap' },
        sectionHead('skills', 'Skills', 'What I build with'),
        rows));
  }

  function renderWork() {
    return h('section', { class: 'section', id: 'work', 'aria-labelledby': 'work-title' },
      h('div', { class: 'wrap' },
        sectionHead('work', 'Work', 'Things worth opening'),
        S.projects.map((p) => {
          const art = h('div', { class: 'art', html: (ART[p.art] || artSearch)() });
          return h('article', { class: 'project' },
            reveal(h('div', { class: 'art-wrap' }, art)),
            reveal(h('div', { class: 'p-text' },
              h('p', { class: 'p-kind' }, p.kind),
              h('h3', { class: 'p-title' }, p.title),
              h('p', { class: 'p-summary' }, p.summary),
              h('ul', { class: 'tags' }, p.tags.map((t) => h('li', null, t))),
              h('p', { class: 'p-role' }, 'Role: ' + p.role),
              h('div', { class: 'actions' },
                h('button', { class: 'btn', type: 'button', onclick: () => openWriteup(p) }, 'Read the write-up', h('span', { class: 'dot', html: ICON.arrow })),
                p.link ? h('a', { class: 'btn btn--plain', href: p.link.href, target: '_blank', rel: 'noopener' }, p.link.label) : null)), 120));
        })));
  }

  function renderSchool() {
    const e = S.education;
    return h('section', { class: 'section', id: 'school', 'aria-labelledby': 'school-title' },
      h('div', { class: 'wrap' },
        sectionHead('school', 'School and languages', 'The rest of it'),
        h('div', { class: 'cards' },
          reveal(h('div', { class: 'card' },
            h('p', { class: 'label' }, 'Education'),
            h('h3', null, e.school),
            h('p', null, e.degree),
            h('p', null, e.detail))),
          reveal(h('div', { class: 'card' },
            h('p', { class: 'label' }, 'Languages'),
            h('ul', { class: 'lang-list' }, S.languages.map((l) => h('li', null, l.name, h('span', null, l.level))))), 100))));
  }

  function renderContact() {
    const links = [];
    if (S.links.github) { links.push(h('a', { class: 'btn btn--plain', href: S.links.github, target: '_blank', rel: 'noopener' }, 'GitHub')); }
    if (S.links.linkedin) { links.push(h('a', { class: 'btn btn--plain', href: S.links.linkedin, target: '_blank', rel: 'noopener' }, 'LinkedIn')); }
    if (S.links.resume) { links.push(h('a', { class: 'btn btn--plain', href: S.links.resume, target: '_blank', rel: 'noopener' }, 'Resume')); }

    return h('section', { class: 'section contact', id: 'contact', 'aria-labelledby': 'contact-title' },
      h('div', { class: 'wrap' },
        h('div', { class: 'sec-head' },
          reveal(h('p', { class: 'kicker' }, 'Contact')),
          reveal(h('h2', { class: 'title', id: 'contact-title' }, S.contact.heading), 60)),
        reveal(h('p', { class: 'contact-note' }, S.contact.note)),
        reveal(h('div', { class: 'email-row' },
          h('a', { class: 'email', href: 'mailto:' + S.email }, S.email),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Copy email address', html: ICON.copy, onclick: copyEmail })), 80),
        links.length ? reveal(h('div', { class: 'links' }, links), 120) : null,
        reveal(h('div', { class: 'door-box' },
          h('div', null,
            h('h3', null, 'This page is the polished half.'),
            h('p', null, 'The other half is a phone. It has my apps on the home screen, a 3D box to spin, and a small game.')),
          h('button', { class: 'btn btn--accent btn--plain', type: 'button', onclick: openPlayground }, 'Open the playground')), 140)));
  }

  function renderFooter() {
    return h('div', { class: 'wrap' },
      h('span', null, '© ' + new Date().getFullYear() + ' ' + S.name.first + ' ' + S.name.last),
      h('span', null, 'Built by hand in the ' + S.location.split(',')[0] + '.'));
  }

  /* Overlays ------------------------------------------------------------- */

  let lastFocus = null;
  let openOverlayEl = null;

  function focusables(el) {
    return $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', el)
      .filter((n) => !n.closest('[hidden]') && !n.closest('[inert]') && n.offsetParent !== null);
  }

  function showOverlay(el, focusSel) {
    lastFocus = document.activeElement;
    el.hidden = false;
    openOverlayEl = el;
    document.body.style.overflow = 'hidden';
    const target = focusSel ? $(focusSel, el) : focusables(el)[0];
    if (target) { target.focus(); }
  }

  function hideOverlay(el) {
    el.hidden = true;
    openOverlayEl = null;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }

  function openWriteup(p) {
    const body = $('#writeup-body');
    body.replaceChildren(
      h('p', { class: 'p-kind' }, p.kind),
      h('h3', { id: 'writeup-title' }, p.title),
      h('p', { class: 'p-role' }, 'Role: ' + p.role),
      h('p', { class: 'p-summary' }, p.summary),
      h('ul', { class: 'points' }, p.points.map((x) => h('li', null, x))),
      h('ul', { class: 'tags' }, p.tags.map((t) => h('li', null, t))),
      p.link ? h('div', { class: 'actions' }, h('a', { class: 'btn', href: p.link.href, target: '_blank', rel: 'noopener' }, p.link.label, h('span', { class: 'dot', html: ICON.ext }))) : null);
    showOverlay($('#writeup'), '.close-btn');
  }

  document.addEventListener('keydown', (e) => {
    if (!openOverlayEl) { return; }
    if (e.key === 'Escape') {
      if (openOverlayEl.id === 'playground' && pg.appOpen) { pg.closeApp(); }
      else if (openOverlayEl.id === 'playground') { closePlayground(); }
      else { hideOverlay(openOverlayEl); }
      return;
    }
    if (e.key === 'Tab') {
      const items = focusables(openOverlayEl);
      if (!items.length) { return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Playground ----------------------------------------------------------- */

  const pg = { built: false, appOpen: false, closeApp: function () {}, tick: null };

  const GLYPH = {
    clipscout: '<rect x="4" y="6" width="16" height="12" rx="3"/><path d="M10.5 9.5v5l4.2-2.5z" fill="currentColor"/>',
    mutuals: '<circle cx="9" cy="9.5" r="3.2"/><circle cx="16.5" cy="10.5" r="2.5"/><path d="M3.5 19c.6-3 3-4.6 5.5-4.6s4.9 1.6 5.5 4.6M15 15.4c2.3-.3 4.8.9 5.5 3.6"/>',
    forge: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    impostor: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.6a2.6 2.6 0 115 .8c0 1.7-2.5 1.8-2.5 3.6M12 17h.01"/>',
    now: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M4 8l8 5.5L20 8"/>',
    about: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-4 3.7-6 7-6s6.2 2 7 6"/>',
    site: '<path d="M15 5l-7 7 7 7"/>'
  };

  function projectById(id) { return S.projects.find((p) => p.id === id); }

  function chatDemo(box, cleanup) {
    const chat = h('div', { class: 'chat', role: 'img', 'aria-label': 'Example conversation' });
    const script = [['them', 'Hey, what are you building?'], ['me', 'A networking app. Want in?'], ['them', 'Yes. How do I join?'], ['me', 'Sent you an invite.']];
    const timers = [];
    let i = 0;
    function next() {
      if (i >= script.length) {
        timers.push(setTimeout(() => { chat.replaceChildren(); i = 0; next(); }, 2600));
        return;
      }
      const who = script[i][0];
      const text = script[i][1];
      i++;
      const t = h('div', { class: 'bubble ' + who + ' typing' }, h('span'), h('span'), h('span'));
      chat.append(t);
      timers.push(setTimeout(() => {
        t.className = 'bubble ' + who;
        t.textContent = text;
        timers.push(setTimeout(next, 900));
      }, 700));
    }
    box.append(chat);
    next();
    cleanup.push(() => timers.forEach(clearTimeout));
  }

  function cubeDemo(box, cleanup) {
    const scene = h('div', { class: 'scene', role: 'img', 'aria-label': 'A 3D box you can drag to turn' });
    const cube = h('div', { class: 'cube' });
    ['Rev A', 'Rev B', 'Rev C', 'Notes', 'Client', 'Team'].forEach((t, i) => cube.append(h('div', { class: 'face f' + i }, t)));
    scene.append(cube);
    box.append(scene, h('p', { class: 'hint' }, 'Drag the box to turn it.'));
    const base = reduce.matches ? 0 : 0.3;
    let rx = -22, ry = 32, vx = base, vy = 0, drag = false, lx = 0, ly = 0, raf = 0;
    function frame() {
      if (!drag) { ry += vx; rx += vy; vx += (base - vx) * 0.03; vy *= 0.94; }
      cube.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      raf = requestAnimationFrame(frame);
    }
    scene.addEventListener('pointerdown', (e) => {
      drag = true; lx = e.clientX; ly = e.clientY;
      try { scene.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      scene.classList.add('grab');
    });
    scene.addEventListener('pointermove', (e) => {
      if (!drag) { return; }
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX; ly = e.clientY;
      ry += dx * 0.6; rx -= dy * 0.6; vx = dx * 0.2; vy = -dy * 0.2;
    });
    const end = () => { drag = false; scene.classList.remove('grab'); };
    scene.addEventListener('pointerup', end);
    scene.addEventListener('pointercancel', end);
    frame();
    cleanup.push(() => cancelAnimationFrame(raf));
  }

  function projectApp(body, p, cleanup) {
    if (p.id === 'mutuals') { chatDemo(body, cleanup); }
    else if (p.id === 'forge') { cubeDemo(body, cleanup); }
    else { body.append(h('div', { class: 'mini-art', html: (ART[p.art] || artSearch)() })); }
    body.append(
      h('h4', null, p.title),
      h('p', { class: 'app-kind' }, p.kind),
      h('p', null, p.summary),
      h('ul', null, p.points.map((x) => h('li', null, x))));
    if (p.link) {
      body.append(h('a', { class: 'btn', href: p.link.href, target: '_blank', rel: 'noopener' }, p.link.label, h('span', { class: 'dot', html: ICON.ext })));
    }
  }

  function impostorGame(body) {
    let streak = 0;
    let best = 0;
    let locked = false;
    const status = h('p', { class: 'game-status' });
    const grid = h('div', { class: 'tiles' });
    body.append(
      h('p', null, 'One tile is a slightly different shade. Tap it. Each right answer makes it harder.'),
      status, grid,
      h('p', { class: 'hint' }, 'Secret Impostor is a bluffing game too. This one tests your eyes.'));
    function round() {
      locked = false;
      const n = streak >= 10 ? 5 : streak >= 5 ? 4 : 3;
      const count = n * n;
      const hue = Math.floor(Math.random() * 360);
      const delta = Math.max(3, 16 - streak * 1.1);
      const odd = Math.floor(Math.random() * count);
      const baseColor = 'hsl(' + hue + ' 48% 52%)';
      const oddColor = 'hsl(' + hue + ' 48% ' + (52 + (Math.random() < 0.5 ? -delta : delta)).toFixed(1) + '%)';
      grid.style.setProperty('--n', n);
      grid.classList.remove('shake');
      grid.replaceChildren();
      for (let i = 0; i < count; i++) {
        grid.append(h('button', {
          class: 'tile', type: 'button', 'aria-label': 'Tile ' + (i + 1) + ' of ' + count,
          style: 'background:' + (i === odd ? oddColor : baseColor),
          onclick: () => pick(i, odd)
        }));
      }
      status.textContent = 'Streak ' + streak + '. Best ' + best + '.';
    }
    function pick(i, odd) {
      if (locked) { return; }
      locked = true;
      if (i === odd) {
        streak++;
        best = Math.max(best, streak);
        setTimeout(round, 200);
      } else {
        streak = 0;
        grid.children[odd].classList.add('reveal');
        grid.classList.add('shake');
        status.textContent = 'Missed. The odd tile is outlined.';
        setTimeout(round, 1100);
      }
    }
    round();
  }

  function nowApp(body) {
    body.append(
      h('p', null, 'What I am working on. Updated ' + S.now.updated + '.'),
      h('ul', { class: 'now-list' }, S.now.items.map((x) => h('li', null, x))));
  }

  function aboutApp(body) {
    body.append(
      h('p', { class: 'about-lead' }, S.about.lead),
      ...S.about.paragraphs.map((x) => h('p', null, x)));
  }

  function buildPlayground() {
    const rootEl = $('#playground');
    const cleanup = [];

    const apps = [
      { id: 'clipscout', label: 'ClipScout', bg: ['#1E90FF', '#0A3FBF'], open: (b) => projectApp(b, projectById('clipscout'), cleanup) },
      { id: 'mutuals', label: 'Mutuals', bg: ['#6C63FF', '#2E1FC4'], open: (b) => projectApp(b, projectById('mutuals'), cleanup) },
      { id: 'forge', label: 'Forge', bg: ['#14B8C8', '#066A86'], open: (b) => projectApp(b, projectById('forge'), cleanup) },
      { id: 'impostor', label: 'Impostor', bg: ['#FF4F7B', '#C2123F'], open: (b) => impostorGame(b) },
      { id: 'about', label: 'About', bg: ['#FF9A3D', '#E0560B'], open: (b) => aboutApp(b) },
      { id: 'now', label: 'Now', bg: ['#B14CFF', '#6A12C4'], open: (b) => nowApp(b) },
      { id: 'mail', label: 'Email me', bg: ['#FFC21A', '#E08A00'], action: copyEmail },
      { id: 'site', label: 'Back to site', bg: ['#4B5D78', '#1B2638'], action: () => closePlayground() }
    ];

    const timeEl = h('span');
    const bigTime = h('div', { class: 'w-time' });
    const dateEl = h('div', { class: 'w-date' });
    function tickClock() {
      const now = new Date();
      const t = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      timeEl.textContent = t;
      bigTime.textContent = t;
      dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    }
    tickClock();
    pg.tick = setInterval(tickClock, 20000);

    const grid = h('div', { class: 'app-grid' });
    const home = h('div', { class: 'home' },
      h('div', { class: 'pg-widget' }, bigTime, dateEl, h('p', { class: 'w-hello' }, 'Tap an app to find out more.'), h('p', { class: 'w-sub' }, 'Projects, a game, and my email.')),
      grid,
      h('div', { class: 'home-bar', 'aria-hidden': 'true' }));

    const bodyEl = h('div', { class: 'appbody' });
    const titleEl = h('h4');
    const backBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Back to home screen', html: ICON.back });
    const view = h('div', { class: 'appview', hidden: true }, h('div', { class: 'appbar' }, backBtn, titleEl), bodyEl);

    const screen = h('div', { class: 'screen' },
      h('div', { class: 'island', 'aria-hidden': 'true' }),
      h('div', { class: 'statusbar', 'aria-hidden': 'true' }, timeEl, h('span', null, '5G')),
      home, view);

    let currentIcon = null;

    function iconTransform() {
      const sr = screen.getBoundingClientRect();
      const ir = currentIcon.getBoundingClientRect();
      const k = (sr.width / screen.offsetWidth) || 1;
      return 'translate(' + ((ir.left - sr.left) / k) + 'px,' + ((ir.top - sr.top) / k) + 'px) scale(' + (ir.width / sr.width) + ',' + (ir.height / sr.height) + ')';
    }

    function openApp(app, btn) {
      if (app.action) { app.action(); return; }
      currentIcon = btn.querySelector('.app-icon');
      bodyEl.replaceChildren();
      cleanup.splice(0).forEach((fn) => fn());
      titleEl.textContent = app.label;
      app.open(bodyEl);
      view.hidden = false;
      home.inert = true;
      pg.appOpen = true;
      if (!reduce.matches) {
        view.animate([
          { transform: iconTransform(), borderRadius: '60px', opacity: 0.3 },
          { transform: 'none', borderRadius: '40px', opacity: 1 }
        ], { duration: 460, easing: 'cubic-bezier(0.2,0.9,0.25,1)' });
      }
      backBtn.focus();
    }

    function closeApp() {
      if (!pg.appOpen) { return; }
      pg.appOpen = false;
      home.inert = false;
      const finish = () => {
        view.hidden = true;
        cleanup.splice(0).forEach((fn) => fn());
        bodyEl.replaceChildren();
        if (currentIcon && currentIcon.parentNode) { currentIcon.parentNode.focus(); }
      };
      if (!reduce.matches && currentIcon) {
        const anim = view.animate([
          { transform: 'none', borderRadius: '40px', opacity: 1 },
          { transform: iconTransform(), borderRadius: '60px', opacity: 0 }
        ], { duration: 320, easing: 'cubic-bezier(0.5,0,0.8,0.4)', fill: 'forwards' });
        anim.onfinish = () => { finish(); anim.cancel(); };
      } else {
        finish();
      }
    }
    pg.closeApp = closeApp;
    backBtn.addEventListener('click', closeApp);

    apps.forEach((app) => {
      const btn = h('button', { class: 'app', type: 'button' },
        h('span', { class: 'app-icon', style: '--c1:' + app.bg[0] + ';--c2:' + app.bg[1], html: svg(GLYPH[app.id] || '', 24).replace('stroke-width="2.2"', 'stroke-width="2"') }),
        h('span', { class: 'app-label' }, app.label));
      btn.addEventListener('click', () => openApp(app, btn));
      grid.append(btn);
    });

    rootEl.replaceChildren(
      h('div', { class: 'pg-bg', 'aria-hidden': 'true' }, h('span', { class: 'pg-orb o1' }), h('span', { class: 'pg-orb o2' })),
      h('button', { class: 'pg-close', type: 'button', onclick: () => closePlayground() }, 'Back to site'),
      h('div', { class: 'phone-fit' }, h('div', { class: 'phone' }, screen)),
      h('p', { class: 'pg-hint' }, 'Tap an app. Press Escape to leave.'));
    pg.built = true;
  }

  function fitPhone() {
    const s = Math.max(0.35, Math.min(1, (window.innerHeight - 96) / 700, (window.innerWidth - 24) / 340));
    $('#playground').style.setProperty('--s', s.toFixed(3));
  }
  window.addEventListener('resize', fitPhone);

  function openPlayground() {
    if (!pg.built) { buildPlayground(); }
    fitPhone();
    root.classList.add('pg-open');
    showOverlay($('#playground'), '.app');
  }

  function closePlayground() {
    if (pg.appOpen) { pg.closeApp(); }
    root.classList.remove('pg-open');
    hideOverlay($('#playground'));
  }

  /* Behaviors ------------------------------------------------------------ */

  function initReveal() {
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduce.matches) { return; }
    items.forEach((el) => el.classList.add('rv'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) { return; }
        const el = en.target;
        io.unobserve(el);
        el.classList.add('in');
        const delay = parseInt(el.style.getPropertyValue('--d'), 10) || 0;
        setTimeout(() => el.classList.remove('rv', 'in'), 1500 + delay);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  }

  function initCountUp() {
    const els = $$('[data-count]');
    if (reduce.matches) { return; }
    els.forEach((el) => {
      const end = Number(el.dataset.count);
      el.textContent = '0';
      const start = performance.now() + 900;
      const dur = 1100;
      function step(now) {
        const p = Math.max(0, Math.min(1, (now - start) / dur));
        el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) { requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    });
  }

  function initName() {
    if (reduce.matches) { return; }
    const chars = $$('.name .ch');
    if (!chars.length) { return; }
    const ts = chars.map(() => 0);
    let mx = -9999, my = -9999, lastMove = 0, visible = true;
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') { return; }
      mx = e.clientX; my = e.clientY; lastMove = performance.now();
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe($('.name'));
    }
    function frame(now) {
      if (visible) {
        const idle = !finePointer.matches || now - lastMove > 2400;
        chars.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const radius = Math.max(150, r.width * 2.4);
          const dist = Math.hypot(mx - cx, (my - cy) * 0.7);
          let near = Math.max(0, 1 - dist / radius);
          near = near * near * (3 - 2 * near);
          const wave = idle ? (Math.sin(now / 700 - i * 0.55) + 1) / 2 * 0.55 : 0;
          const target = Math.max(near, wave);
          ts[i] += (target - ts[i]) * 0.12;
          const t = ts[i];
          c.style.setProperty('--t', t.toFixed(3));
          c.style.setProperty('--w', (660 + 140 * t).toFixed(0));
          c.style.setProperty('--d', (78 + 22 * t).toFixed(1));
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function initTilt() {
    if (!finePointer.matches || reduce.matches) { return; }
    $$('.art').forEach((art) => {
      art.addEventListener('pointermove', (e) => {
        const r = art.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        art.style.transform = 'rotateX(' + (-y * 7).toFixed(2) + 'deg) rotateY(' + (x * 9).toFixed(2) + 'deg)';
      });
      art.addEventListener('pointerleave', () => { art.style.transform = ''; });
    });
  }

  function initCursor() {
    if (!finePointer.matches || reduce.matches) { return; }
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') { return; }
      x = e.clientX; y = e.clientY;
      root.classList.add('has-cursor');
      const t = e.target && e.target.closest ? e.target.closest('a, button, [data-hover], input') : null;
      ring.classList.toggle('grow', !!t);
    }, { passive: true });
    function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    }
    loop();
  }

  function initScroll() {
    const bar = $('.topbar');
    const top = $('#to-top');
    const C = 2 * Math.PI * 24;
    top.innerHTML = '<svg class="ring" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="24" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '"/></svg>' + ICON.up;
    const circle = top.querySelector('circle');
    function onScroll() {
      const y = window.scrollY;
      bar.classList.toggle('scrolled', y > 8);
      top.classList.toggle('show', y > 500);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      circle.setAttribute('stroke-dashoffset', (C * (1 - p)).toFixed(1));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' }));
  }

  /* Start ---------------------------------------------------------------- */

  const savedTheme = load('md-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') { setTheme(savedTheme, { animate: false, save: false }); }

  $$('[data-bind="initials"]').forEach((n) => { n.textContent = S.initials; });
  $('#theme-toggle').addEventListener('click', () => setTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));
  $('#open-playground-top').addEventListener('click', openPlayground);
  $$('.close-btn').forEach((b) => { b.innerHTML = ICON.close; });
  $$('[data-close]').forEach((n) => n.addEventListener('click', () => hideOverlay($('#writeup'))));
  updateThemeButton();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeButton);

  const main = $('#main');
  main.append(renderHero(), renderMarquee(), renderAbout(), renderSkills(), renderWork(), renderSchool(), renderContact());
  $('#footer').append(renderFooter());

  initReveal();
  initCountUp();
  initName();
  initTilt();
  initCursor();
  initScroll();
})();
