/* RDM Radom — site scripts */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);

  /* ---------- Data ---------- */
  // `photoColor` is the paint the studio photo shows
  const MODELS = {
    y1989: {
      name: '1989', type: 'City hatchback', mean: '4 June 1989 — the elections that opened the door to a free Poland.', base: 79900,
      desc: 'A compact hatch for the city. Tight turning circle, huge boot for its size, and the cheapest way into an RDM.',
      seats: '5 seats', length: '4.05 m', img: 'img/rdm-1989.webp', photoColor: 'red',
    },
    y1683: {
      name: '1683', type: 'Fastback coupé', mean: '12 September 1683 — Sobieski’s winged hussars charge to relieve Vienna.', base: 94900,
      desc: 'Low, long and quick — built for the charge. The same modules in a sleeker shell, with sport corners as standard on the E3.',
      seats: '4 seats', length: '4.38 m', img: 'img/rdm-1683.webp', photoColor: 'blue',
    },
    y966: {
      name: '966', type: 'Compact crossover', mean: '966 — the baptism of Mieszko I and the birth of the Polish state.', base: 109900,
      desc: 'Raised, roomy and ready for gravel roads to the lake house. Fits a roof rack, a dog and a family of five.',
      seats: '5 seats', length: '4.42 m', img: 'img/rdm-966.webp', photoColor: 'moss',
    },
  };

  const COLORS = [
    { id: 'red', name: 'Czerwień Radom', hex: '#9e1424', price: 0 },
    { id: 'white', name: 'Biel Mazowsza', hex: '#e8e6e1', price: 0 },
    { id: 'graphite', name: 'Grafit', hex: '#3a3d42', price: 1900 },
    { id: 'blue', name: 'Wisła Blue', hex: '#1e2a4a', price: 1900 },
    { id: 'moss', name: 'Mech', hex: '#4b5a3a', price: 1900 },
    { id: 'amber', name: 'Bursztyn', hex: '#d18b2f', price: 2900 },
  ];

  const POWER = [
    { id: 'r1', name: 'R1 Turbo', sub: '1.2 petrol · manual or auto', price: 0, kw: '110 KM', accel: 10.4, rangeLabel: 'Fuel use', range: '5.1 l/100' },
    { id: 'h2', name: 'H2 Hybrid', sub: '1.5 full hybrid · auto', price: 12000, kw: '150 KM', accel: 8.6, rangeLabel: 'Fuel use', range: '3.9 l/100' },
    { id: 'e3', name: 'E3 Electric', sub: '58 kWh energy floor · 130 kW DC', price: 29000, kw: '204 KM', accel: 6.9, rangeLabel: 'Range', range: '420 km' },
  ];

  const WHEELS = [
    { id: 'aero', name: 'Aero', sub: '16" · turbine discs', price: 0 },
    { id: 'sport', name: 'Sport', sub: '18" · lowered', price: 3500, accel: -0.2 },
    { id: 'terrain', name: 'Terrain', sub: '17" AT · +30 mm', price: 2800 },
  ];

  const ROOFS = [
    { id: 'steel', name: 'Matte grey', sub: 'Steel', price: 0 },
    { id: 'pano', name: 'Panoramic', sub: 'Tinted glass', price: 4200 },
    { id: 'rails', name: 'Roof rails', sub: 'With cross bars', price: 1900 },
    { id: 'solar', name: 'Solar', sub: 'Up to 15 km/day', price: 6500 },
  ];

  const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';
  const find = (arr, id) => arr.find(x => x.id === id);

  /* ---------- Exploded view: link list items and markers ---------- */
  const explode = document.querySelector('.explode');
  if (explode) {
    const setActive = n => explode.querySelectorAll('[data-mod]').forEach(el => el.classList.toggle('is-active', el.dataset.mod === n));
    explode.addEventListener('mouseover', e => { const t = e.target.closest('[data-mod]'); if (t) setActive(t.dataset.mod); });
    explode.addEventListener('mouseleave', () => setActive(null));
    explode.addEventListener('focusin', e => { const t = e.target.closest('[data-mod]'); if (t) setActive(t.dataset.mod); });
  }

  /* ---------- Configurator ---------- */
  const state = { model: 'y1989', color: 'red', power: 'r1', wheel: 'aero', roof: 'steel' };

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
      <label for="model-${id}"><span><b>RDM ${m.name}</b><small>${m.type}</small></span><span class="price">${fmt(m.base)}</span></label>
    </div>`).join('');
  $('optColor').innerHTML = COLORS.map(c =>
    `<div class="swatch">
      <input type="radio" name="color" id="color-${c.id}" value="${c.id}" ${state.color === c.id ? 'checked' : ''} aria-label="${c.name}${c.price ? ', plus ' + fmt(c.price) : ''}">
      <label for="color-${c.id}" style="--c:${c.hex}" title="${c.name}"></label>
    </div>`).join('');
  $('optPower').innerHTML = POWER.map(p => optionHTML('power', p, 'opt--row')).join('');
  $('optWheel').innerHTML = WHEELS.map(w => optionHTML('wheel', w)).join('');
  $('optRoof').innerHTML = ROOFS.map(r => optionHTML('roof', r)).join('');

  const photo = $('configImg');
  function showPhoto(src, alt) {
    if (photo.getAttribute('src') === src) return;
    photo.classList.add('is-fading');
    setTimeout(() => {
      photo.onload = () => photo.classList.remove('is-fading');
      photo.src = src; photo.alt = alt;
    }, reduceMotion ? 0 : 200);
  }

  function render() {
    const m = MODELS[state.model];
    const c = find(COLORS, state.color);
    const p = find(POWER, state.power);
    const w = find(WHEELS, state.wheel);
    const r = find(ROOFS, state.roof);

    showPhoto(m.img, `RDM ${m.name} ${m.type.toLowerCase()}, side view`);
    const shown = find(COLORS, m.photoColor);
    $('configNote').innerHTML = c.id === shown.id
      ? `Shown in <i style="--c:${c.hex}"></i>${c.name}`
      : `Shown in ${shown.name}. Yours: <i style="--c:${c.hex}"></i>${c.name}`;

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
  cards.innerHTML = Object.entries(MODELS).map(([id, m], i) => `
    <article class="model reveal" style="transition-delay:${i * 90}ms">
      <div class="model__img"><img src="${m.img}" alt="RDM ${m.name} ${m.type.toLowerCase()}, side view" loading="lazy" width="1200" height="750"></div>
      <div class="model__body">
        <div class="model__meta"><span>0${i + 1}</span><span>${m.type}</span></div>
        <h3>RDM ${m.name}</h3>
        <p class="model__mean">${m.mean}</p>
        <p class="model__desc">${m.desc}</p>
        <div class="model__foot">
          <div class="model__price"><small>from</small><b>${fmt(m.base)}</b></div>
          <a href="#configure" class="btn btn--small btn--ghost" data-model="${id}">Configure</a>
        </div>
      </div>
    </article>`).join('');
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
  document.querySelectorAll('.section__head, .timeline li, .tile, .explode__list li, .radom__stats div, .quote, .compare, .photo, .gallery figure, .explode__stage')
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
