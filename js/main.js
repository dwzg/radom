/* RDM Radom — site scripts */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => document.getElementById(id);

  /* ---------- Data ---------- */
  const MODELS = {
    y1989: {
      name: '1989', type: 'City hatchback', mean: '4 June 1989 — the elections that opened the door to a free Poland.',
      desc: 'Imagined as a compact hatch for the city: easy to park, roomy for its size, and the simplest way into an RDM.',
      img: 'img/rdm-1989.webp',
    },
    y1683: {
      name: '1683', type: 'Fastback coupé', mean: '12 September 1683 — Sobieski’s winged hussars charge to relieve Vienna.',
      desc: 'Imagined as the sporty one: low, long and sleek, built for the charge. The same modules in a lower, two-door shell.',
      img: 'img/rdm-1683.webp',
    },
    y966: {
      name: '966', type: 'Compact crossover', mean: '966 — the baptism of Mieszko I and the birth of the Polish state.',
      desc: 'Imagined as the adventurous one: raised, rugged and ready for gravel roads to the lake house, with room for a family and a roof rack.',
      img: 'img/rdm-966.webp',
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
      <div class="model__img"><img src="${m.img}" alt="AI-generated concept image: RDM ${m.name} ${m.type.toLowerCase()}, side view" loading="lazy" width="1200" height="750"></div>
      <div class="model__body">
        <div class="model__meta"><span>0${i + 1}</span><span>${m.type}</span></div>
        <h3>RDM ${m.name}</h3>
        <p class="model__mean">${m.mean}</p>
        <p class="model__desc">${m.desc}</p>
        <div class="model__foot">
          <span class="model__tag">Concept · Not for sale</span>
        </div>
      </div>
    </article>`).join('');

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
  document.querySelectorAll('.section__head, .timeline li, .tile, .explode__list li, .radom__stats div, .quote, .compare, .photo, .gallery figure, .explode__stage, .concept__list li')
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
