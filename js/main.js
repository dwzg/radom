/* RDM Radom — site scripts */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);

  /* ---------- Data ---------- */
  const MODELS = {
    y1989: {
      name: '1989', type: 'City hatchback', mean: '4 June 1989 — the elections that opened the door to a free Poland.',
      desc: 'A compact hatch for the city. Tight turning circle, huge boot for its size, and the simplest way into an RDM.',
      seats: '5 seats', length: '4.05 m', img: 'img/rdm-1989.webp',
    },
    y1683: {
      name: '1683', type: 'Fastback coupé', mean: '12 September 1683 — Sobieski’s winged hussars charge to relieve Vienna.',
      desc: 'Low, long and quick — built for the charge. The same modules in a sleeker shell, with sport corners and the E3 electric module in mind.',
      seats: '4 seats', length: '4.38 m', img: 'img/rdm-1683.webp',
    },
    y966: {
      name: '966', type: 'Compact crossover', mean: '966 — the baptism of Mieszko I and the birth of the Polish state.',
      desc: 'Raised, roomy and ready for gravel roads to the lake house. Fits a roof rack, a dog and a family of five.',
      seats: '5 seats', length: '4.42 m', img: 'img/rdm-966.webp',
    },
  };

  /* ---------- Exploded view: link list items and markers ---------- */
  const explode = document.querySelector('.explode');
  if (explode) {
    const setActive = n => explode.querySelectorAll('[data-mod]').forEach(el => el.classList.toggle('is-active', el.dataset.mod === n));
    explode.addEventListener('mouseover', e => { const t = e.target.closest('[data-mod]'); if (t) setActive(t.dataset.mod); });
    explode.addEventListener('mouseleave', () => setActive(null));
    explode.addEventListener('focusin', e => { const t = e.target.closest('[data-mod]'); if (t) setActive(t.dataset.mod); });
  }

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
          <span class="model__tag">${m.seats} · ${m.length} · Coming soon</span>
          <a href="#notify" class="btn btn--small btn--ghost" data-model="${id}">Get notified</a>
        </div>
      </div>
    </article>`).join('');
  cards.addEventListener('click', e => {
    const a = e.target.closest('[data-model]');
    if (a) $('driveModel').value = a.dataset.model;
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
    msg.textContent = `Dziękujemy, ${name.value.trim().split(' ')[0]}! You'll be among the first to hear about the ${model}.`;
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
