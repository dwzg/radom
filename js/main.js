/* RDM Radom — site scripts */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data ---------- */
  const MODELS = {
    y1989: {
      name: '1989', type: 'City hatchback', mean: '4 June 1989 — the elections that opened the door to a free Poland.', base: 79900, lift: 0,
      desc: 'A compact hatch for the city. Tight turning circle, huge boot for its size, and the cheapest way into an RDM.',
      seats: '5 seats', length: '4.05 m',
      shell: 'M 95 228 L 138 228 A 62 62 0 0 1 262 228 L 538 228 A 62 62 0 0 1 662 228 L 705 228 Q 728 226 728 205 L 726 182 Q 722 160 690 152 L 545 128 Q 485 86 420 80 L 205 82 Q 140 86 112 118 Q 88 145 86 180 L 88 212 Q 90 228 95 228 Z',
      glass: 'M 207 96 L 415 93 Q 462 99 510 130 L 345 132 L 160 128 Q 176 102 207 96 Z',
      head: 'M 686 157 Q 712 160 724 172 L 724 180 Q 704 176 684 168 Z',
      tail: 'M 88 150 L 100 146 L 100 172 L 87 176 Z',
      roof: [215, 81, 412, 79],
    },
    y1683: {
      name: '1683', type: 'Fastback coupé', mean: '12 September 1683 — Sobieski’s winged hussars charge to relieve Vienna.', base: 94900, lift: 0,
      desc: 'Low, long and quick — built for the charge. The same modules in a sleeker shell, with sport corners as standard on the E3.',
      seats: '4 seats', length: '4.38 m',
      shell: 'M 92 226 L 138 226 A 62 62 0 0 1 262 226 L 538 226 A 62 62 0 0 1 662 226 L 712 226 Q 734 224 734 204 L 732 184 Q 728 164 694 158 L 540 134 Q 478 92 410 88 L 260 90 Q 175 96 120 138 Q 90 160 88 186 L 88 210 Q 90 226 92 226 Z',
      glass: 'M 265 103 L 405 101 Q 455 106 505 135 L 340 137 L 165 135 Q 200 110 265 103 Z',
      head: 'M 690 162 Q 716 166 730 176 L 730 184 Q 708 180 688 172 Z',
      tail: 'M 90 168 L 108 158 L 108 176 L 89 184 Z',
      roof: [272, 89, 402, 88],
    },
    y966: {
      name: '966', type: 'Compact crossover', mean: '966 — the baptism of Mieszko I and the birth of the Polish state.', base: 109900, lift: 14,
      desc: 'Raised, roomy and ready for gravel roads to the lake house. Fits a roof rack, a dog and a family of five.',
      seats: '5 seats', length: '4.42 m',
      shell: 'M 92 228 L 134 228 A 66 66 0 0 1 266 228 L 534 228 A 66 66 0 0 1 666 228 L 708 228 Q 730 226 730 204 L 728 176 Q 724 152 690 146 L 548 124 Q 492 76 425 70 L 190 70 Q 128 72 104 104 Q 86 132 86 170 L 88 212 Q 90 228 92 228 Z',
      glass: 'M 195 84 L 420 82 Q 470 88 515 125 L 345 128 L 148 124 Q 160 90 195 84 Z',
      head: 'M 686 150 Q 712 154 726 166 L 726 176 Q 704 172 684 162 Z',
      tail: 'M 87 135 L 100 130 L 100 160 L 87 164 Z',
      roof: [198, 69, 422, 69],
      cladding: true,
    },
  };

  const COLORS = [
    { id: 'red', name: 'Czerwień Radom', hex: '#c8102e', price: 0 },
    { id: 'white', name: 'Biel Mazowsza', hex: '#e8e6e1', price: 0 },
    { id: 'graphite', name: 'Grafit', hex: '#3a3d42', price: 1900 },
    { id: 'blue', name: 'Wisła Blue', hex: '#2c4f80', price: 1900 },
    { id: 'moss', name: 'Mech', hex: '#5e6b4b', price: 1900 },
    { id: 'amber', name: 'Bursztyn', hex: '#d18b2f', price: 2900 },
  ];

  const POWER = [
    { id: 'r1', name: 'R1 Turbo', sub: '1.2 petrol · manual or auto', price: 0, kw: '110 KM', accel: 10.4, rangeLabel: 'Fuel use', range: '5.1 l/100' },
    { id: 'h2', name: 'H2 Hybrid', sub: '1.5 full hybrid · auto', price: 12000, kw: '150 KM', accel: 8.6, rangeLabel: 'Fuel use', range: '3.9 l/100' },
    { id: 'e3', name: 'E3 Electric', sub: '58 kWh energy floor · 130 kW DC', price: 29000, kw: '204 KM', accel: 6.9, rangeLabel: 'Range', range: '420 km' },
  ];

  const WHEELS = [
    { id: 'aero', name: 'Aero', sub: '16" · efficient', price: 0 },
    { id: 'sport', name: 'Sport', sub: '18" · lowered', price: 3500, accel: -0.2 },
    { id: 'terrain', name: 'Terrain', sub: '17" AT · +30 mm', price: 2800 },
  ];

  const ROOFS = [
    { id: 'steel', name: 'Body colour', sub: 'Steel', price: 0 },
    { id: 'pano', name: 'Panoramic', sub: 'Tinted glass', price: 4200 },
    { id: 'rails', name: 'Roof rails', sub: 'With cross bars', price: 1900 },
    { id: 'solar', name: 'Solar', sub: 'Up to 15 km/day', price: 6500 },
  ];

  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';

  /* ---------- Car SVG ---------- */
  let uid = 0;

  function wheelSVG(style, cx, cy) {
    let s = '';
    const tireR = style === 'terrain' ? 50 : 48;
    s += `<circle cx="${cx}" cy="${cy}" r="${tireR}" fill="#151618"/>`;
    if (style === 'terrain') {
      s += `<circle cx="${cx}" cy="${cy}" r="${tireR - 3}" fill="none" stroke="#2a2c30" stroke-width="6" stroke-dasharray="7 5"/>`;
    }
    s += `<g class="spin">`;
    if (style === 'aero') {
      s += `<circle cx="${cx}" cy="${cy}" r="31" fill="#c3c7cd"/><circle cx="${cx}" cy="${cy}" r="25" fill="#e1e4e8"/>`;
      for (let i = 0; i < 5; i++) {
        const a = (i * 72) * Math.PI / 180;
        s += `<circle cx="${(cx + Math.cos(a) * 16).toFixed(1)}" cy="${(cy + Math.sin(a) * 16).toFixed(1)}" r="4.5" fill="#8b9097"/>`;
      }
    } else if (style === 'sport') {
      s += `<circle cx="${cx}" cy="${cy}" r="34" fill="#26282c"/>`;
      for (let i = 0; i < 5; i++) {
        s += `<rect x="${cx - 4}" y="${cy - 33}" width="8" height="30" rx="3" fill="#d9dce0" transform="rotate(${i * 72} ${cx} ${cy})"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="#d9dce0" stroke-width="2"/>`;
    } else {
      s += `<circle cx="${cx}" cy="${cy}" r="28" fill="#8e9197"/>`;
      for (let i = 0; i < 6; i++) {
        s += `<rect x="${cx - 4}" y="${cy - 24}" width="8" height="12" rx="3" fill="#55585e" transform="rotate(${i * 60} ${cx} ${cy})"/>`;
      }
    }
    s += `<circle cx="${cx}" cy="${cy}" r="7" fill="#3a3c40"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#d4002a"/></g>`;
    return s;
  }

  function roofSVG(model, roof) {
    const [x1, y1, x2, y2] = model.roof;
    const g = (id, inner) => `<g class="roof-opt" data-roof="${id}" style="opacity:${roof === id ? 1 : 0}">${inner}</g>`;
    let s = '';
    s += g('pano', `<path d="M ${x1 + 10} ${y1 + 1} L ${x2 - 10} ${y2 + 1}" stroke="#1b2129" stroke-width="7" stroke-linecap="round"/>`);
    s += g('rails',
      `<path d="M ${x1 + 6} ${y1 - 9} L ${x2 - 6} ${y2 - 9}" stroke="#1d1e21" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M ${x1 + 22} ${y1 - 7} L ${x1 + 22} ${y1 + 1} M ${x2 - 22} ${y2 - 7} L ${x2 - 22} ${y2 + 1} M ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 7} L ${(x1 + x2) / 2} ${(y1 + y2) / 2 + 1}" stroke="#1d1e21" stroke-width="5"/>`);
    let cells = '';
    const n = 7;
    for (let i = 0; i < n; i++) {
      const ax = x1 + 10 + (x2 - x1 - 20) * i / n, bx = x1 + 10 + (x2 - x1 - 20) * (i + 1) / n - 3;
      const ay = y1 + (y2 - y1) * i / n;
      cells += `<rect x="${ax.toFixed(1)}" y="${(ay - 3).toFixed(1)}" width="${(bx - ax).toFixed(1)}" height="6" rx="1" fill="#1f3550" stroke="#5f86b3" stroke-width=".8"/>`;
    }
    s += g('solar', cells);
    return s;
  }

  function carSVG(opts) {
    const o = Object.assign({ model: 'y1989', color: '#c8102e', wheel: 'aero', roof: 'steel', markers: false }, opts);
    const m = MODELS[o.model];
    const id = 'car' + (++uid);
    const lift = m.lift;
    const bodyLift = `translate(0 ${-lift})`;

    const details = `
      <path d="M 340 ${m.cladding ? 128 : 134} L 340 222 M 512 ${m.cladding ? 126 : 132} L 520 222" stroke="rgba(0,0,0,.22)" stroke-width="1.5" fill="none"/>
      <rect x="290" y="150" width="26" height="5" rx="2.5" fill="rgba(0,0,0,.28)"/>
      <rect x="462" y="150" width="26" height="5" rx="2.5" fill="rgba(0,0,0,.28)"/>
      <path d="M 120 176 L 690 182" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/>`;

    const cladding = m.cladding ? `
      <path d="M 128 228 A 72 72 0 0 1 272 228" fill="none" stroke="#1c1d20" stroke-width="10"/>
      <path d="M 528 228 A 72 72 0 0 1 672 228" fill="none" stroke="#1c1d20" stroke-width="10"/>
      <path d="M 272 224 L 528 224" stroke="#1c1d20" stroke-width="8"/>` : '';

    const marker = (n, x, y) => o.markers ? `<g class="marker"><circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y}">${n}</text></g>` : '';

    return `
<svg class="car" viewBox="0 -60 820 350" xmlns="${NS}" role="img" aria-label="RDM ${m.name}" style="--paint:${o.color}">
  <defs>
    <path id="${id}-shell" d="${m.shell}"/>
    <clipPath id="${id}-cm"><rect x="104" y="-100" width="584" height="400"/></clipPath>
    <clipPath id="${id}-cf"><rect x="688" y="-100" width="200" height="400"/></clipPath>
    <clipPath id="${id}-cr"><rect x="0" y="-100" width="104" height="400"/></clipPath>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b4450"/><stop offset="1" stop-color="#14171b"/>
    </linearGradient>
    <linearGradient id="${id}-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
      <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".25"/>
    </linearGradient>
  </defs>

  <ellipse class="shadow part" cx="410" cy="272" rx="340" ry="12" fill="rgba(0,0,0,.18)"/>

  <!-- Inner modules (hidden until exploded) -->
  <g class="part p-floor"><g transform="${bodyLift}">
    <rect x="262" y="206" width="276" height="20" rx="4" fill="#2a2d32"/>
    <path d="M 276 216 h 248" stroke="#d4002a" stroke-width="2" stroke-dasharray="14 8"/>
    ${marker(2, 400, 216)}
  </g></g>
  <g class="part p-interior"><g transform="${bodyLift}">
    <path d="M 230 200 L 236 140 Q 238 130 248 132 L 256 134 Q 262 136 262 146 L 260 186 L 316 186 Q 326 186 326 196 L 326 204 Z" fill="#43464c"/>
    <path d="M 380 200 L 388 136 Q 390 126 400 128 L 408 130 Q 414 132 414 142 L 410 184 L 462 184 Q 472 184 472 194 L 472 204 Z" fill="#43464c"/>
    <path d="M 500 150 L 540 140 L 548 160 L 506 168 Z" fill="#2b2d31"/>
    ${marker(3, 290, 194)}
  </g></g>
  <g class="part p-power"><g transform="${bodyLift}">
    <rect x="566" y="150" width="112" height="60" rx="8" fill="#2a2d32"/>
    <rect x="578" y="162" width="40" height="14" rx="3" fill="#43464c"/>
    <rect x="626" y="162" width="40" height="14" rx="3" fill="#43464c"/>
    <path d="M 578 192 h 88" stroke="#d4002a" stroke-width="3"/>
    ${marker(1, 622, 120)}
  </g></g>

  <!-- Body shell -->
  <g class="part p-body"><g transform="${bodyLift}">
    <use href="#${id}-shell" class="paint" clip-path="url(#${id}-cm)"/>
    <use href="#${id}-shell" fill="url(#${id}-shade)" clip-path="url(#${id}-cm)"/>
    <path d="${m.glass}" fill="url(#${id}-glass)"/>
    <rect x="334" y="${m.roof[1] + 3}" width="12" height="52" class="paint"/>
    ${details}
    ${cladding}
  </g></g>

  <g class="part p-roof"><g transform="${bodyLift}">${roofSVG(m, o.roof)}${marker(6, m.roof[2] + 34, m.roof[1] - 4)}</g></g>

  <g class="part p-front"><g transform="${bodyLift}">
    <use href="#${id}-shell" class="paint" clip-path="url(#${id}-cf)"/>
    <use href="#${id}-shell" fill="url(#${id}-shade)" clip-path="url(#${id}-cf)"/>
    <path d="${m.head}" fill="#f3f1ea" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
    <rect x="700" y="204" width="26" height="6" rx="3" fill="#1c1d20"/>
    ${marker(5, 716, 232)}
  </g></g>
  <g class="part p-rear"><g transform="${bodyLift}">
    <use href="#${id}-shell" class="paint" clip-path="url(#${id}-cr)"/>
    <use href="#${id}-shell" fill="url(#${id}-shade)" clip-path="url(#${id}-cr)"/>
    <path d="${m.tail}" fill="#d4002a"/>
    <rect x="86" y="204" width="18" height="6" rx="3" fill="#1c1d20"/>
  </g></g>

  <g class="part p-wr">${wheelSVG(o.wheel, 200, 222)}</g>
  <g class="part p-wf">${wheelSVG(o.wheel, 600, 222)}${marker(4, 600, 222)}</g>
</svg>`;
  }

  /* ---------- Hero ---------- */
  const hero = document.getElementById('heroCar');
  if (hero) hero.innerHTML = carSVG({ model: 'y1989', color: '#c8102e', wheel: 'sport', roof: 'pano' });

  /* ---------- Exploded view ---------- */
  const exStage = document.getElementById('explodeCar');
  const exBtn = document.getElementById('explodeBtn');
  if (exStage) {
    exStage.innerHTML = carSVG({ model: 'y1989', color: '#e8e6e1', wheel: 'aero', roof: 'solar', markers: true });
    const setExploded = on => {
      exStage.classList.toggle('is-exploded', on);
      exBtn.setAttribute('aria-pressed', String(on));
      exBtn.textContent = on ? 'Put it back together' : 'Take it apart';
    };
    exBtn.addEventListener('click', () => setExploded(!exStage.classList.contains('is-exploded')));
    // Explode once automatically the first time it scrolls into view
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { setTimeout(() => setExploded(true), 500); io.disconnect(); }
      });
    }, { threshold: 0.6 });
    io.observe(exStage);
  }

  /* ---------- Configurator ---------- */
  const state = { model: 'y1989', color: 'red', power: 'r1', wheel: 'aero', roof: 'steel' };
  const $ = id => document.getElementById(id);

  function optionHTML(group, item, extraClass = '') {
    const price = item.price ? '+ ' + fmt(item.price) : 'Included';
    return `<div class="opt ${extraClass}">
      <input type="radio" name="${group}" id="${group}-${item.id}" value="${item.id}" ${state[group] === item.id ? 'checked' : ''}>
      <label for="${group}-${item.id}"><span><b>${item.name}</b><small>${item.sub}</small></span><span class="price">${price}</span></label>
    </div>`;
  }

  $('optModel').innerHTML = Object.entries(MODELS).map(([id, m]) =>
    `<div class="opt">
      <input type="radio" name="model" id="model-${id}" value="${id}" ${state.model === id ? 'checked' : ''}>
      <label for="model-${id}"><span><b>${m.name}</b><small>${m.type}</small></span><span class="price">${fmt(m.base)}</span></label>
    </div>`).join('');
  $('optColor').innerHTML = COLORS.map(c =>
    `<div class="swatch">
      <input type="radio" name="color" id="color-${c.id}" value="${c.id}" ${state.color === c.id ? 'checked' : ''} aria-label="${c.name}${c.price ? ', plus ' + fmt(c.price) : ''}">
      <label for="color-${c.id}" style="--c:${c.hex}" title="${c.name}"></label>
    </div>`).join('');
  $('optPower').innerHTML = POWER.map(p => optionHTML('power', p, 'opt--row')).join('');
  $('optWheel').innerHTML = WHEELS.map(w => optionHTML('wheel', w)).join('');
  $('optRoof').innerHTML = ROOFS.map(r => optionHTML('roof', r)).join('');

  const find = (arr, id) => arr.find(x => x.id === id);
  let lastShape = '';

  function render() {
    const m = MODELS[state.model];
    const c = find(COLORS, state.color);
    const p = find(POWER, state.power);
    const w = find(WHEELS, state.wheel);
    const r = find(ROOFS, state.roof);

    const shape = state.model + state.wheel;
    const stage = $('configCar');
    if (shape !== lastShape) {
      stage.innerHTML = carSVG({ model: state.model, color: c.hex, wheel: state.wheel, roof: state.roof });
      lastShape = shape;
    } else {
      // Smooth updates without re-rendering: paint colour and roof module
      stage.querySelector('svg').style.setProperty('--paint', c.hex);
      stage.querySelectorAll('.roof-opt').forEach(g => { g.style.opacity = g.dataset.roof === state.roof ? 1 : 0; });
    }

    $('colorName').textContent = c.name + (c.price ? ' · + ' + fmt(c.price) : '');
    $('cfgModelName').textContent = 'RDM ' + m.name;
    $('cfgModelType').textContent = `${m.type} · ${m.seats} · ${m.length}`;
    $('specPower').textContent = p.kw;
    const accel = Math.max(5.9, p.accel + (w.accel || 0) + (state.model === 'y966' ? 0.6 : state.model === 'y1683' ? -0.3 : 0));
    $('specAccel').textContent = accel.toFixed(1).replace('.', ',') + ' s';
    $('specRangeLabel').textContent = p.rangeLabel;
    $('specRange').textContent = p.range;

    const total = m.base + c.price + p.price + w.price + r.price;
    const priceEl = $('totalPrice');
    priceEl.textContent = fmt(total);
    priceEl.classList.remove('bump'); void priceEl.offsetWidth; priceEl.classList.add('bump');
    // RDM Flex: 20% down, 48 months, illustrative
    $('monthly').textContent = fmt(Math.round(total * 0.8 / 48 * 1.06 / 10) * 10);
  }

  $('configForm').addEventListener('change', e => {
    if (e.target.name in state) { state[e.target.name] = e.target.value; render(); }
  });
  $('reserveBtn').addEventListener('click', () => { $('driveModel').value = state.model; });

  function selectModel(id) {
    state.model = id;
    const input = document.getElementById('model-' + id);
    if (input) input.checked = true;
    render();
  }

  render();

  /* ---------- Model cards ---------- */
  const cards = $('modelCards');
  const cardLooks = { y1989: ['#c8102e', 'aero', 'steel'], y1683: ['#2c4f80', 'sport', 'pano'], y966: ['#5e6b4b', 'terrain', 'rails'] };
  cards.innerHTML = Object.entries(MODELS).map(([id, m], i) => {
    const [color, wheel, roof] = cardLooks[id];
    return `<article class="model reveal" style="transition-delay:${i * 90}ms">
      <div class="model__meta"><span>0${i + 1}</span><span>${m.type}</span></div>
      <h3>RDM ${m.name}</h3>
      <p class="model__mean">${m.mean}</p>
      <div class="model__car">${carSVG({ model: id, color, wheel, roof })}</div>
      <p class="model__desc">${m.desc}</p>
      <div class="model__foot">
        <div class="model__price"><small>from</small><b>${fmt(m.base)}</b></div>
        <a href="#configure" class="btn btn--small btn--ghost" data-model="${id}">Configure</a>
      </div>
    </article>`;
  }).join('');
  cards.addEventListener('click', e => {
    const a = e.target.closest('[data-model]');
    if (a) selectModel(a.dataset.model);
  });

  /* ---------- Test drive form ---------- */
  const form = $('driveForm');
  const msg = $('driveMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email;
    const okName = name.value.trim().length > 1;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    name.classList.toggle('invalid', !okName);
    email.classList.toggle('invalid', !okEmail);
    if (!okName || !okEmail) {
      msg.className = 'drive__msg err';
      msg.textContent = 'Please add your name and a valid email.';
      return;
    }
    const model = 'RDM ' + MODELS[form.elements.model.value].name;
    msg.className = 'drive__msg ok';
    msg.textContent = `Dziękujemy, ${name.value.trim().split(' ')[0]}! We'll be in touch about your ${model} test drive in ${form.elements.city.value}.`;
    form.reset();
  });

  /* ---------- Nav ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
  }));
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  document.querySelectorAll('.section__head, .timeline li, .tile, .explode__list li, .radom__stats div, .quote, .compare')
    .forEach(el => el.classList.add('reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  } else {
    const rio = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); rio.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => rio.observe(el));
  }
})();
