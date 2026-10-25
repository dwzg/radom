/* RDM Radom — site scripts */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data ---------- */
  /* Body shapes are drawn facing right. Ground is y=270, wheel centres at x=200/600, y=222.
     Shapes use body coordinates: the crossover is lifted by `lift` px on screen. */
  const MODELS = {
    y1989: {
      name: '1989', type: 'City hatchback', mean: '4 June 1989 — the elections that opened the door to a free Poland.', base: 79900,
      desc: 'A compact hatch for the city. Tight turning circle, huge boot for its size, and the cheapest way into an RDM.',
      seats: '5 seats', length: '4.05 m',
      lift: 0, archR: 58, frontX: 736, doors: 4, pillarX: 332, quarterX: 214, frontSeam: 562, rearSeam: 252,
      shell: A => `M 92 244 ${A(200)} ${A(600)} L 712 244 C 728 244 736 236 736 222 L 736 196 C 736 182 730 172 716 168 C 680 158 620 150 560 140 C 530 120 490 84 452 66 C 440 60 420 56 400 56 L 210 58 C 170 60 140 70 124 92 C 108 118 96 140 90 160 C 86 180 84 200 86 222 C 87 236 90 244 92 244 Z`,
      glass: 'M 548 142 C 522 120 486 90 450 76 C 436 71 418 69 400 69 L 214 71 C 186 73 164 84 150 102 L 134 126 C 131 132 134 135 142 135 L 548 144 Z',
      belt: [142, 135, 548, 144],
      mirror: 'M 528 144 C 524 131 537 125 556 129 L 560 144 Z',
      head: 'M 702 166 C 716 168 728 174 734 182 L 734 189 C 720 185 706 180 698 175 Z',
      tail: 'M 89 152 C 96 147 110 146 122 149 L 121 160 C 110 160 98 163 88 168 Z',
      roof: [214, 57, 398, 56],
    },
    y1683: {
      name: '1683', type: 'Fastback coupé', mean: '12 September 1683 — Sobieski’s winged hussars charge to relieve Vienna.', base: 94900,
      desc: 'Low, long and quick — built for the charge. The same modules in a sleeker shell, with sport corners as standard on the E3.',
      seats: '4 seats', length: '4.38 m',
      lift: 0, archR: 58, frontX: 742, doors: 2, pillarX: 396, quarterX: 246, frontSeam: 566, rearSeam: 300,
      shell: A => `M 88 244 ${A(200)} ${A(600)} L 716 244 C 732 244 742 236 742 222 L 742 200 C 742 188 736 180 722 176 C 690 168 630 158 566 150 C 532 126 494 96 456 82 C 440 76 418 72 396 72 L 300 74 C 250 76 206 88 172 106 C 140 122 112 138 96 152 C 88 160 86 176 86 200 L 86 228 C 86 238 87 244 88 244 Z`,
      glass: 'M 554 152 C 528 130 492 104 456 92 C 442 87 420 84 398 84 L 302 86 C 262 88 230 96 202 110 C 186 118 174 126 168 134 C 165 139 168 141 176 141 L 554 154 Z',
      belt: [176, 141, 554, 154],
      mirror: 'M 534 156 C 530 143 543 137 562 141 L 566 156 Z',
      head: 'M 708 174 C 722 176 736 182 741 190 L 741 196 C 728 192 714 188 704 183 Z',
      tail: 'M 90 154 C 100 149 120 145 140 143 L 139 151 C 120 153 104 157 91 162 Z',
      roof: [302, 73, 398, 72],
    },
    y966: {
      name: '966', type: 'Compact crossover', mean: '966 — the baptism of Mieszko I and the birth of the Polish state.', base: 109900,
      desc: 'Raised, roomy and ready for gravel roads to the lake house. Fits a roof rack, a dog and a family of five.',
      seats: '5 seats', length: '4.42 m',
      lift: 14, archR: 62, frontX: 738, doors: 4, pillarX: 334, quarterX: 192, frontSeam: 574, rearSeam: 254, cladding: true,
      shell: A => `M 90 244 ${A(200)} ${A(600)} L 714 244 C 730 244 738 236 738 222 L 738 190 C 738 172 730 160 712 156 C 680 150 630 144 574 138 C 548 116 512 76 476 56 C 464 50 446 46 426 46 L 196 46 C 160 46 132 52 116 64 C 100 80 92 104 88 134 C 86 170 86 210 88 230 C 88 240 89 244 90 244 Z`,
      glass: 'M 562 138 C 538 116 506 82 474 64 C 462 58 446 56 428 56 L 200 56 C 170 56 148 60 134 72 C 124 84 118 104 116 124 C 116 130 118 132 124 132 L 562 140 Z',
      belt: [124, 132, 562, 140],
      mirror: 'M 542 141 C 538 127 552 121 570 125 L 574 141 Z',
      head: 'M 700 158 C 716 160 730 166 736 172 L 736 180 C 722 176 708 172 698 168 Z',
      tail: 'M 88 118 L 103 116 L 103 150 L 88 152 Z',
      roof: [200, 45, 426, 45],
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
  const SILL = 244;
  const pt = (cx, cy, r, deg) => {
    const a = deg * Math.PI / 180;
    return [(cx + Math.cos(a) * r).toFixed(1), (cy + Math.sin(a) * r).toFixed(1)];
  };

  // Tapered spoke from hub to rim, as a polygon
  function spoke(cx, cy, deg, r1, r2, w1, w2) {
    const a = deg * Math.PI / 180, nx = -Math.sin(a), ny = Math.cos(a);
    const p = (r, w, s) => `${(cx + Math.cos(a) * r + nx * w * s).toFixed(1)},${(cy + Math.sin(a) * r + ny * w * s).toFixed(1)}`;
    return `${p(r1, w1 / 2, 1)} ${p(r2, w2 / 2, 1)} ${p(r2, w2 / 2, -1)} ${p(r1, w1 / 2, -1)}`;
  }

  function wheelSVG(style, cx, cy, id) {
    const R = style === 'terrain' ? 50 : 48;
    const Rr = style === 'sport' ? 35 : style === 'terrain' ? 29 : 32;
    let s = `<ellipse cx="${cx}" cy="${cy + R - 1}" rx="${R * 0.85}" ry="4" fill="rgba(0,0,0,.45)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id}-tire)"/>`;
    if (style === 'terrain') {
      for (let i = 0; i < 28; i++) {
        s += `<rect x="${cx - 3}" y="${cy - R - 1}" width="6" height="7" rx="1" fill="#0c0c0d" transform="rotate(${i * (360 / 28)} ${cx} ${cy})"/>`;
      }
    } else {
      s += `<circle cx="${cx}" cy="${cy}" r="${R - 9}" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/>`;
    }
    // Barrel, brake disc and caliper (caliper does not rotate)
    s += `<circle cx="${cx}" cy="${cy}" r="${Rr}" fill="#141517"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${Rr - 5}" fill="url(#${id}-disc)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${Rr - 12}" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1"/>`;
    const [c1x, c1y] = pt(cx, cy, Rr - 9, -75), [c2x, c2y] = pt(cx, cy, Rr - 9, -20);
    const caliper = style === 'sport' ? '#d4002a' : '#2c2e33';
    s += `<path d="M ${c1x} ${c1y} A ${Rr - 9} ${Rr - 9} 0 0 1 ${c2x} ${c2y}" stroke="${caliper}" stroke-width="10" stroke-linecap="round" fill="none"/>`;

    s += `<g class="spin"><circle cx="${cx}" cy="${cy}" r="${Rr}" fill="none"/>`;
    if (style === 'aero') {
      s += `<circle cx="${cx}" cy="${cy}" r="${Rr}" fill="url(#${id}-rim)"/>`;
      for (let i = 0; i < 5; i++) {
        const [x, y] = pt(cx, cy, 20, i * 72 - 90);
        s += `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="9" fill="#17181b" transform="rotate(${i * 72} ${x} ${y})"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="${Rr - 6}" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`;
    } else if (style === 'sport') {
      for (let i = 0; i < 5; i++) {
        s += `<polygon points="${spoke(cx, cy, i * 72 - 99, 8, Rr - 2, 7, 4)}" fill="url(#${id}-rim)"/>`;
        s += `<polygon points="${spoke(cx, cy, i * 72 - 81, 8, Rr - 2, 7, 4)}" fill="url(#${id}-rim)"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="${Rr - 1}" fill="none" stroke="url(#${id}-rim)" stroke-width="3"/>`;
    } else {
      for (let i = 0; i < 6; i++) {
        s += `<polygon points="${spoke(cx, cy, i * 60 - 90, 6, Rr - 2, 13, 10)}" fill="#3c3f45" stroke="#6b6e74" stroke-width=".8"/>`;
      }
      s += `<circle cx="${cx}" cy="${cy}" r="${Rr - 1}" fill="none" stroke="#2e3035" stroke-width="5"/>`;
      for (let i = 0; i < 12; i++) {
        const [x, y] = pt(cx, cy, Rr - 1, i * 30);
        s += `<circle cx="${x}" cy="${y}" r="1.3" fill="#8b8e94"/>`;
      }
    }
    s += `<circle cx="${cx}" cy="${cy}" r="8" fill="#232428" stroke="#8d9096" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="#d4002a"/></g>`;
    // Tyre sidewall highlight
    s += `<circle cx="${cx}" cy="${cy}" r="${R - 1}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="2"/>`;
    return s;
  }

  function roofSVG(model, roof) {
    const [x1, y1, x2, y2] = model.roof;
    const g = (id, inner) => `<g class="roof-opt" data-roof="${id}" style="opacity:${roof === id ? 1 : 0}">${inner}</g>`;
    let s = '';
    s += g('pano', `<path d="M ${x1 + 10} ${y1 + 1.5} L ${x2 - 10} ${y2 + 1.5}" stroke="#151a20" stroke-width="5" stroke-linecap="round"/><path d="M ${x1 + 30} ${y1 - .5} L ${x2 - 40} ${y2 - .5}" stroke="rgba(255,255,255,.35)" stroke-width="1"/>`);
    s += g('rails',
      `<path d="M ${x1 + 4} ${y1 - 1} L ${x1 + 10} ${y1 - 8} L ${x2 - 10} ${y2 - 8} L ${x2 - 4} ${y2 - 1}" stroke="#1b1c1f" stroke-width="4" fill="none" stroke-linejoin="round"/>` +
      `<path d="M ${x1 + 10} ${y1 - 7} L ${x2 - 10} ${y2 - 7}" stroke="rgba(255,255,255,.25)" stroke-width="1"/>` +
      [0.3, 0.7].map(f => { const x = x1 + (x2 - x1) * f; return `<rect x="${x - 4}" y="${y1 - 13}" width="8" height="5" rx="1.5" fill="#26282c"/>`; }).join(''));
    let cells = '';
    const n = 8;
    for (let i = 0; i < n; i++) {
      const ax = x1 + 12 + (x2 - x1 - 24) * i / n, bx = x1 + 12 + (x2 - x1 - 24) * (i + 1) / n - 2;
      cells += `<rect x="${ax.toFixed(1)}" y="${(y1 - 2.5).toFixed(1)}" width="${(bx - ax).toFixed(1)}" height="4" rx=".8" fill="#1d3150" stroke="#6f95c4" stroke-width=".6"/>`;
    }
    s += g('solar', cells);
    return s;
  }

  function carSVG(opts) {
    const o = Object.assign({ model: 'y1989', color: '#c8102e', wheel: 'aero', roof: 'steel', markers: false }, opts);
    const m = MODELS[o.model];
    const id = 'car' + (++uid);
    const lift = m.lift, r = m.archR, acy = 222 + lift;
    const dx = Math.sqrt(r * r - (SILL - acy) ** 2);
    const A = cx => `L ${(cx - dx).toFixed(1)} ${SILL} A ${r} ${r} 0 1 1 ${(cx + dx).toFixed(1)} ${SILL}`;
    const well = cx => `M ${(cx - dx).toFixed(1)} ${SILL} A ${r} ${r} 0 1 1 ${(cx + dx).toFixed(1)} ${SILL} Z`;
    const archY = (cx, x) => Math.abs(x - cx) >= r ? SILL - 8 : acy - Math.sqrt(r * r - (x - cx) ** 2);
    const [bx1, by1, bx2, by2] = m.belt;
    const beltY = x => by1 + (by2 - by1) * (x - bx1) / (bx2 - bx1);
    const top = m.roof[1] - 2;
    const crease = (by1 + by2) / 2 + 22;
    const co = ((crease - top) / (SILL - top)).toFixed(3);
    const bodyLift = `translate(0 ${-lift})`;
    const viewBox = o.markers ? '0 -100 830 390' : '56 14 714 272';

    // One painted piece of the shell, with lighting overlays
    const piece = clip => `<g clip-path="url(#${id}-${clip})">
      <use href="#${id}-shell" class="paint"/>
      <use href="#${id}-shell" fill="url(#${id}-shadeV)"/>
      <use href="#${id}-shell" fill="url(#${id}-shadeH)"/>
      ${m.cladding ? `<use href="#${id}-shell" fill="#1c1d20" clip-path="url(#${id}-band)"/>` : ''}
    </g>`;

    const fs = m.frontSeam, rs = m.rearSeam, ms = m.pillarX + 6;
    let seams = `M ${fs} ${beltY(fs) + 2} C ${fs + 2} ${beltY(fs) + 20} ${fs - 2} ${archY(600, fs - 4) - 10} ${fs - 4} ${archY(600, fs - 4)}`;
    seams += ` M ${rs} ${beltY(rs) + 2} L ${rs + 2} ${archY(200, rs + 2)}`;
    if (m.doors === 4) seams += ` M ${ms} ${beltY(ms) + 2} L ${ms + 1} ${SILL - 8}`;
    const handles = (m.doors === 4 ? [ms - 58, fs - 78] : [fs - 92]).map(x => {
      const y = beltY(x) + 15;
      return `<rect x="${x}" y="${y}" width="26" height="5" rx="2.5" fill="rgba(0,0,0,.32)"/><path d="M ${x + 3} ${y - 1} h 20" stroke="rgba(255,255,255,.35)" stroke-width="1"/>`;
    }).join('');

    const sill = m.cladding ? '' : `<rect x="${200 + dx}" y="${SILL - 7}" width="${400 - 2 * dx}" height="8" rx="2" fill="#17181b"/>`;
    const flareR = r + 5, fdx = Math.sqrt(flareR * flareR - (SILL - acy) ** 2);
    const flares = m.cladding ? [200, 600].map(cx =>
      `<path d="M ${(cx - fdx).toFixed(1)} ${SILL} A ${flareR} ${flareR} 0 1 1 ${(cx + fdx).toFixed(1)} ${SILL}" fill="none" stroke="#1c1d20" stroke-width="10"/>`).join('') : '';

    const marker = (n, x, y, part) => o.markers ? `<g class="part ${part}"><g transform="${bodyLift}"><g class="marker"><circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y}">${n}</text></g></g></g>` : '';

    return `
<svg class="car" viewBox="${viewBox}" xmlns="${NS}" role="img" aria-label="RDM ${m.name}" style="--paint:${o.color}">
  <defs>
    <path id="${id}-shell" d="${m.shell(A)}"/>
    <path id="${id}-glassp" d="${m.glass}"/>
    <clipPath id="${id}-cm"><rect x="104" y="-100" width="584" height="400"/></clipPath>
    <clipPath id="${id}-cf"><rect x="688" y="-100" width="200" height="400"/></clipPath>
    <clipPath id="${id}-cr"><rect x="0" y="-100" width="104" height="400"/></clipPath>
    <clipPath id="${id}-band"><rect x="0" y="224" width="900" height="40"/></clipPath>
    <clipPath id="${id}-sc"><use href="#${id}-shell"/></clipPath>
    <clipPath id="${id}-gc"><use href="#${id}-glassp"/></clipPath>
    <linearGradient id="${id}-shadeV" gradientUnits="userSpaceOnUse" x1="0" y1="${top}" x2="0" y2="${SILL}">
      <stop offset="0" stop-color="#fff" stop-opacity=".42"/>
      <stop offset="${(co * 0.45).toFixed(3)}" stop-color="#fff" stop-opacity=".1"/>
      <stop offset="${(co - 0.01).toFixed(3)}" stop-color="#fff" stop-opacity=".16"/>
      <stop offset="${co}" stop-color="#000" stop-opacity=".07"/>
      <stop offset="${(+co + 0.14).toFixed(3)}" stop-color="#fff" stop-opacity=".05"/>
      <stop offset=".86" stop-color="#000" stop-opacity=".18"/>
      <stop offset="1" stop-color="#000" stop-opacity=".45"/>
    </linearGradient>
    <linearGradient id="${id}-shadeH" gradientUnits="userSpaceOnUse" x1="84" y1="0" x2="744" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity=".22"/>
      <stop offset=".07" stop-color="#000" stop-opacity="0"/>
      <stop offset=".93" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".22"/>
    </linearGradient>
    <linearGradient id="${id}-glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#56606c"/><stop offset=".5" stop-color="#232930"/><stop offset="1" stop-color="#0e1114"/>
    </linearGradient>
    <linearGradient id="${id}-lamp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#b9c0c8"/>
    </linearGradient>
    <linearGradient id="${id}-tail" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff4a4a"/><stop offset="1" stop-color="#8d0014"/>
    </linearGradient>
    <linearGradient id="${id}-rim" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f5f6f8"/><stop offset=".55" stop-color="#b9bdc3"/><stop offset="1" stop-color="#6f737a"/>
    </linearGradient>
    <radialGradient id="${id}-disc"><stop offset=".3" stop-color="#55585e"/><stop offset=".35" stop-color="#9a9da3"/><stop offset="1" stop-color="#6a6d73"/></radialGradient>
    <radialGradient id="${id}-tire"><stop offset=".6" stop-color="#2d2e32"/><stop offset=".8" stop-color="#1b1c1f"/><stop offset="1" stop-color="#0b0b0c"/></radialGradient>
    <radialGradient id="${id}-shadow"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".7" stop-color="#000" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  </defs>

  <ellipse class="shadow part" cx="412" cy="268" rx="370" ry="18" fill="url(#${id}-shadow)"/>

  <!-- Inner modules (hidden until exploded) -->
  <g class="part p-floor"><g transform="${bodyLift}">
    <rect x="262" y="214" width="276" height="22" rx="4" fill="#2a2d32"/>
    <path d="M 276 225 h 248" stroke="#d4002a" stroke-width="2" stroke-dasharray="14 8"/>
  </g></g>
  <g class="part p-interior"><g transform="${bodyLift}">
    <path d="M 236 210 L 242 146 Q 244 136 254 138 L 262 140 Q 268 142 268 152 L 266 192 L 322 192 Q 332 192 332 202 L 332 210 Z" fill="#43464c"/>
    <path d="M 386 210 L 394 142 Q 396 132 406 134 L 414 136 Q 420 138 420 148 L 416 190 L 468 190 Q 478 190 478 200 L 478 210 Z" fill="#43464c"/>
    <path d="M 504 156 L 544 146 L 552 166 L 510 174 Z" fill="#2b2d31"/>
  </g></g>
  <g class="part p-power"><g transform="${bodyLift}">
    <rect x="576" y="160" width="112" height="60" rx="8" fill="#2a2d32"/>
    <rect x="588" y="172" width="40" height="14" rx="3" fill="#43464c"/>
    <rect x="636" y="172" width="40" height="14" rx="3" fill="#43464c"/>
    <path d="M 588 202 h 88" stroke="#d4002a" stroke-width="3"/>
  </g></g>

  <!-- Body shell -->
  <g class="part p-body"><g transform="${bodyLift}">
    <path d="${well(200)}" fill="#0b0c0d"/><path d="${well(600)}" fill="#0b0c0d"/>
    ${piece('cm')}
    <use href="#${id}-glassp" fill="url(#${id}-glass)" stroke="#0a0b0c" stroke-width="3.5" stroke-linejoin="round"/>
    <g clip-path="url(#${id}-gc)">
      <rect x="${m.pillarX}" y="0" width="13" height="200" fill="#0a0b0c"/>
      <path d="M ${m.quarterX} 30 L ${m.quarterX + 14} 160" stroke="#0a0b0c" stroke-width="5"/>
      <path d="M 430 0 L 470 0 L 400 200 L 360 200 Z M 486 0 L 498 0 L 428 200 L 416 200 Z" fill="#fff" opacity=".08"/>
    </g>
    <g clip-path="url(#${id}-sc)" fill="none">
      <path d="${seams}" stroke="rgba(0,0,0,.35)" stroke-width="1.4"/>
      <path d="M 106 ${crease} L 686 ${crease + 6}" stroke="rgba(255,255,255,.28)" stroke-width="1.5"/>
      <path d="M 106 ${crease + 2} L 686 ${crease + 8}" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>
      <path d="M 270 214 C 380 204 470 204 ${fs - 40} 210" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>
      ${handles}
      <rect x="146" y="${beltY(146) + 14}" width="20" height="15" rx="4" stroke="rgba(0,0,0,.28)" stroke-width="1.2"/>
    </g>
    ${sill}
    ${flares}
    <path d="${m.mirror}" fill="#0f1012"/>
    <path d="${m.mirror}" class="paint" transform="translate(2 -3)"/>
    <path d="${m.mirror}" fill="url(#${id}-shadeV)" transform="translate(2 -3)"/>
  </g></g>

  <g class="part p-roof"><g transform="${bodyLift}">${roofSVG(m, o.roof)}</g></g>

  <g class="part p-front"><g transform="${bodyLift}">
    ${piece('cf')}
    <path d="${m.head}" fill="url(#${id}-lamp)" stroke="#1a1b1d" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M ${m.frontX - 40} 236 L ${m.frontX - 2} 232" stroke="#141517" stroke-width="5" stroke-linecap="round"/>
    <rect x="${m.frontX - 28}" y="210" width="14" height="4" rx="2" fill="#f0a020" opacity=".85"/>
    ${m.cladding ? `<path d="M 702 242 L ${m.frontX - 2} 238 L ${m.frontX} 245 L 706 247 Z" fill="#b9bcc1"/>` : ''}
  </g></g>
  <g class="part p-rear"><g transform="${bodyLift}">
    ${piece('cr')}
    <path d="${m.tail}" fill="url(#${id}-tail)" stroke="#3d0008" stroke-width="1"/>
    <rect x="88" y="212" width="12" height="4" rx="2" fill="#a00018"/>
  </g></g>

  <g class="part p-wr">${wheelSVG(o.wheel, 200, 222, id)}</g>
  <g class="part p-wf">${wheelSVG(o.wheel, 600, 222, id)}</g>

  ${marker(1, 632, 130, 'p-power')}
  ${marker(2, 400, 226, 'p-floor')}
  ${marker(3, 300, 196, 'p-interior')}
  ${marker(4, 600, 222, 'p-wf')}
  ${marker(5, m.frontX - 18, 230, 'p-front')}
  ${marker(6, m.roof[2] + 34, m.roof[1] - 4, 'p-roof')}
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
