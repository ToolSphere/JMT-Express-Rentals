'use strict';
const fleet = [
    { id: 'vios', name: 'Toyota Vios', type: 'Sedan', tag: 'City-focused sedan', seats: 5, gear: 'Automatic', fuel: 'Gasoline', rate: 1750, image: 'images/vios-cutout.png', desc: 'A sensible sedan for errands, city drives and shorter road trips.' },
    { id: 'city', name: 'Honda City', type: 'Sedan', tag: 'Comfortable sedan', seats: 5, gear: 'Automatic', fuel: 'Gasoline', rate: 1900, image: 'images/city-cutout.png', desc: 'An easy-to-handle sedan for everyday travel and weekend trips.' },
    { id: 'raize', name: 'Toyota Raize', type: 'SUV', tag: 'Compact crossover', seats: 5, gear: 'Automatic', fuel: 'Gasoline', rate: 2250, image: 'images/raize-cutout.png', desc: 'A practical compact SUV style for city driving and quick trips.' },
    { id: 'montero', name: 'Mitsubishi Montero Sport', type: 'SUV', tag: '7-seat SUV', seats: 7, gear: 'Automatic', fuel: 'Diesel', rate: 3600, image: 'images/montero-cutout.png', desc: 'Room for more people and bags in a family-sized SUV.' },
    { id: 'innova', name: 'Toyota Innova', type: 'MPV / APV', tag: 'Family people-mover', seats: 7, gear: 'Automatic', fuel: 'Diesel', rate: 2900, image: 'images/innova-cutout.png', desc: 'Designed around group travel with useful passenger capacity.' },
    { id: 'xpander', name: 'Mitsubishi Xpander', type: 'MPV / APV', tag: 'Versatile MPV', seats: 7, gear: 'Automatic', fuel: 'Gasoline', rate: 2700, image: 'images/xpander-cutout.png', desc: 'Flexible seating and comfort for families and group journeys.' },
    { id: 'urvan', name: 'Nissan Urvan', type: 'Van', tag: 'Passenger van', seats: 12, gear: 'Manual', fuel: 'Diesel', rate: 3800, image: 'images/urvan-cutout.png', desc: 'Useful for group outings and journeys needing more seats.' },
    { id: 'hilux', name: 'Toyota Hilux', type: 'Pickup', tag: 'Practical pickup', seats: 5, gear: 'Manual', fuel: 'Diesel', rate: 3300, image: 'images/hilux-cutout.png', desc: 'A rugged utility option for driving with equipment and luggage.' },
    { id: 'click', name: 'Honda Click 125', type: 'Motorcycle', tag: 'City scooter', seats: 2, gear: 'Automatic', fuel: 'Gasoline', rate: 700, image: 'images/click-cutout.png', desc: 'A lightweight scooter ideal for convenient local trips.' },
    { id: 'nmax', name: 'Yamaha NMAX', type: 'Motorcycle', tag: 'Comfort scooter', seats: 2, gear: 'Automatic', fuel: 'Gasoline', rate: 1000, image: 'images/nmax-cutout.png', desc: 'A bigger scooter style for a comfortable everyday ride.' }
];
const categories = [
    { type: 'Sedan', image: 'images/vios-cutout.png', tag: 'City-ready and comfortable' },
    { type: 'SUV', image: 'images/montero-cutout.png', tag: 'Space for every adventure' },
    { type: 'MPV / APV', image: 'images/xpander-cutout.png', tag: 'Room for your whole group' },
    { type: 'Van', image: 'images/urvan-cutout.png', tag: 'Bigger plans, more seats' },
    { type: 'Pickup', image: 'images/hilux-cutout.png', tag: 'Built for getting things done' },
    { type: 'Motorcycle', image: 'images/click-cutout.png', tag: 'Keep moving with ease' }
];
const storedBookingKey = 'jmtDemoReservations_v1';
const storedDatesKey = 'jmtRentalDates_v2';
const peso = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
let bookings = [];
let toastTimeout;
const addOnRates = { gps: 150, cover: 250, helmet: 50 };
function getVehicle(id) { return fleet.find(item => item.id === id) || null; }
function localISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function addDays(date, n) { const [y, m, d] = date.split('-').map(Number); const x = new Date(y, m - 1, d + n); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; }
function rentalDays(start, end) { if (!start || !end || end < start) return 0; const a = start.split('-').map(Number), b = end.split('-').map(Number); return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000) + 1; }
function validDates(start, end) { return !!(start && end && start >= localISO() && end >= start && rentalDays(start, end) > 0); }
function formattedDate(date) { if (!date) return '—'; const [y, m, d] = date.split('-').map(Number); return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(y, m - 1, d)); }
function readBookings() { try { const raw = JSON.parse(localStorage.getItem(storedBookingKey) || '[]'); return Array.isArray(raw) ? raw.filter(r => r && typeof r.id === 'string' && getVehicle(r.vehicleId) && /^\d{4}-\d{2}-\d{2}$/.test(r.start || '') && /^\d{4}-\d{2}-\d{2}$/.test(r.end || '')) : []; } catch (e) { return []; } }
function saveBookings() { try { localStorage.setItem(storedBookingKey, JSON.stringify(bookings)); return true; } catch (e) { toast('Browser storage is disabled; booking is temporary for this page.'); return false; } }
function getDates() { let dates; try { dates = JSON.parse(sessionStorage.getItem(storedDatesKey) || 'null'); } catch (e) { } const start = dates?.start && dates.start >= localISO() ? dates.start : localISO(), end = dates?.end && dates.end >= start ? dates.end : addDays(start, 1); return { start, end }; }
function setDates(start, end) { try { sessionStorage.setItem(storedDatesKey, JSON.stringify({ start, end })); } catch (e) { } }
function isAvailable(id, start, end) { return validDates(start, end) && !bookings.some(r => r.vehicleId === id && start <= r.end && end >= r.start); }
function toast(message) { const el = $('toast'); if (!el) return; el.textContent = message; el.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('show'), 3500); }
function queryHref(file, data) { const query = new URLSearchParams(data); return `${file}?${query.toString()}`; }
function closeDialog(el) { if (el?.open) el.close(); }
function addTextRow(dl, title, value) { const div = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = title; dd.textContent = value; div.append(dt, dd); dl.append(div); }

function initNav() { const toggle = $('menu-toggle'), nav = $('site-nav'); if (!toggle || !nav) return; toggle.addEventListener('click', () => { const opened = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(opened)); }); nav.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }); }
function initIntro() {
    const intro = $('intro'), cover = $('intro-cover'), video = $('intro-car-video'), shell = $('intro-car-shell');
    if (!intro || !cover || !shell) return;
    let runId = 0, activeAnimations = [];
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    function cancelMotion() { activeAnimations.forEach(a => a.cancel()); activeAnimations = []; }
    function showHomepage() {
        runId++;
        cancelMotion();
        intro.style.display = 'none';
        if (video) video.pause();
        try { sessionStorage.setItem('jmtIntroWatched', 'yes'); } catch (e) { }
    }
    async function move(el, frames, options, id) {
        if (id !== runId) return false;
        const animation = el.animate(frames, { fill: 'forwards', ...options });
        activeAnimations.push(animation);
        try { await animation.finished; } catch (e) { return false; }
        return id === runId;
    }
    async function start() {
        runId++;
        const id = runId;
        cancelMotion();
        intro.style.display = 'block';
        intro.classList.remove('lit', 'departing');
        cover.style.clipPath = 'inset(0 0% 0 0)';
        shell.classList.remove('no-video');
        const width = shell.getBoundingClientRect().width;
        const vw = window.innerWidth;
        // The model faces left; keep its front headlamp near the middle-right at its stop.
        const atRight = vw + 55;
        const stopped = Math.max(16, vw - width - (vw < 620 ? 16 : 45));
        const offLeft = -width - 80;
        shell.style.transform = `translate3d(${atRight}px,-50%,0)`;
        if (video) {
            try { video.pause(); video.currentTime = 0; } catch (e) { }
            video.play().catch(() => shell.classList.add('no-video'));
        }
        if (!await move(shell, [
            { transform: `translate3d(${atRight}px,-50%,0)` },
            { transform: `translate3d(${stopped}px,-50%,0)` }
        ], { duration: 1550, easing: 'cubic-bezier(.25,.65,.26,1)' }, id)) return;
        shell.style.transform = `translate3d(${stopped}px,-50%,0)`;
        cancelMotion();
        if (video) video.pause();
        await sleep(350);
        if (id !== runId) return;
        // Headlamp glows originate at x=4.8%, y=50.5% of the actual cut-out.
        intro.classList.add('lit');
        await sleep(1600);
        if (id !== runId) return;
        intro.classList.add('departing');
        if (video) video.play().catch(() => { });
        // Right-to-left reveal: the trailing (rear) edge of the car pulls the curtain.
        const rearAtStop = stopped + width * .97;
        const startReveal = Math.min(1, Math.max(0, (rearAtStop - vw) / (stopped - offLeft)));
        const carExit = move(shell, [
            { transform: `translate3d(${stopped}px,-50%,0)` },
            { transform: `translate3d(${offLeft}px,-50%,0)` }
        ], { duration: 1750, easing: 'linear' }, id);
        const curtainExit = move(cover, [
            { clipPath: 'inset(0 0% 0 0)', offset: 0 },
            { clipPath: 'inset(0 0% 0 0)', offset: startReveal },
            { clipPath: 'inset(0 100% 0 0)', offset: 1 }
        ], { duration: 1750, easing: 'linear' }, id);
        await Promise.all([carExit, curtainExit]);
        if (id !== runId) return;
        showHomepage();
    }
    if (video) {
        video.addEventListener('loadeddata', () => shell.classList.add('video-ready'));
        video.addEventListener('error', () => shell.classList.add('no-video'));
        if (video.readyState >= 2) shell.classList.add('video-ready');
    }
    $('skip-intro')?.addEventListener('click', showHomepage);
    $('replay-intro')?.addEventListener('click', start);
    let seen = false;
    try { seen = sessionStorage.getItem('jmtIntroWatched') === 'yes'; } catch (e) { }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || seen) showHomepage();
    else start();
}

function initCategories() { const grid = $('category-grid'); if (!grid) return; grid.innerHTML = categories.map((cat, i) => `<a class="category-card" href="${queryHref('vehicles.html', { type: cat.type })}"><div class="category-title"><h3>${cat.type.toUpperCase()}</h3><small>0${i + 1}</small></div><img src="${cat.image}" alt="Photorealistic vehicle concept render for ${cat.type}" loading="lazy"><div class="category-bottom"><span>${cat.tag}</span><b aria-hidden="true">↗</b></div></a>`).join(''); }
function initShowroom() {
    const grid = $('showroom-grid'); if (!grid) return; const pills = $('filter-pills'); let filter = params.get('type'); if (filter && !categories.some(c => c.type === filter)) filter = 'All'; if (!filter) filter = 'All'; let search = '';
    function update() {
        const models = fleet.filter(v => (filter === 'All' || v.type === filter) && `${v.name} ${v.type} ${v.tag}`.toLowerCase().includes(search)); $('showroom-title').innerHTML = filter === 'All' ? 'EXPLORE THE<br><em>SHOWROOM.</em>' : `${filter.toUpperCase()}<br><em>SHOWROOM.</em>`; $('showroom-intro').textContent = filter === 'All' ? 'Explore available vehicle types and illustrative rental rates. Choose a model to view its details.' : `Browse sample ${filter} models and choose one that suits your trip.`; $('showroom-count').textContent = `${models.length} model${models.length === 1 ? '' : 's'} found · Prices are illustrative`; pills.querySelectorAll('button').forEach(b => { const active = b.dataset.type === filter; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
        if (!models.length) { grid.innerHTML = '<div class="empty-state">No vehicles match your search. Try another model or category.</div>'; return; }
        grid.innerHTML = models.map(v => `<article class="vehicle-card"><div class="vehicle-card-visual"><span class="vehicle-tag">${v.type}</span><img src="${v.image}" alt="Photorealistic concept render of ${v.name}" loading="lazy"></div><div class="vehicle-card-info"><h3>${v.name}</h3><p class="vehicle-sub">${v.tag}</p><div class="spec-row"><span>◉ ${v.seats} seats</span><span>◇ ${v.gear}</span><span>● ${v.fuel}</span></div><div class="vehicle-price-line"><small>ESTIMATED RATE / DAY</small><strong>${peso.format(v.rate)}</strong></div><div class="vehicle-actions"><button class="button button-ghost-dark" type="button" data-detail="${v.id}">View details</button><a class="button button-red" href="${queryHref('booking.html', { vehicle: v.id })}">Book this ↗</a></div></div></article>`).join('');
    }
    pills.innerHTML = ['All', ...categories.map(c => c.type)].map(t => `<button type="button" data-type="${t}" aria-pressed="false">${t === 'All' ? 'All models' : t}</button>`).join('');
    pills.addEventListener('click', e => { const b = e.target.closest('[data-type]'); if (!b) return; filter = b.dataset.type; try { history.replaceState({}, '', filter === 'All' ? 'vehicles.html' : queryHref('vehicles.html', { type: filter })); } catch (e) { } update(); });
    $('vehicle-search').addEventListener('input', e => { search = e.target.value.trim().toLowerCase(); update(); });
    const dialog = $('detail-dialog'); grid.addEventListener('click', e => { const b = e.target.closest('[data-detail]'); if (!b) return; const v = getVehicle(b.dataset.detail); if (!v) return; $('detail-photo').src = v.image; $('detail-photo').alt = `Photorealistic render of ${v.name}`; $('detail-name').textContent = v.name; $('detail-desc').textContent = v.desc; $('detail-price').textContent = peso.format(v.rate); $('detail-specs').innerHTML = ''; for (const [label, value] of [['Category', v.type], ['Passenger seats', v.seats], ['Transmission', v.gear], ['Fuel type', v.fuel]]) { const d = document.createElement('div'), small = document.createElement('small'), bold = document.createElement('b'); small.textContent = label; bold.textContent = value; d.append(small, bold); $('detail-specs').append(d); } $('detail-book').onclick = () => location.href = queryHref('booking.html', { vehicle: v.id }); dialog.showModal(); });
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => closeDialog(dialog)); dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(dialog); }); update();
}
function initAvailability() {
    const form = $('availability-form'); if (!form) return; const { start, end } = getDates(); $('availability-start').value = start; $('availability-end').value = end;
    function render() { const s = $('availability-start').value, e = $('availability-end').value; const valid = validDates(s, e); $('availability-caption').textContent = valid ? `${formattedDate(s)} – ${formattedDate(e)} · ${rentalDays(s, e)} calendar day(s) · Sample availability only` : 'Please choose valid dates to check the table.'; const body = $('availability-body'); body.innerHTML = ''; for (const category of categories) { const group = fleet.filter(v => v.type === category.type); group.forEach((v, index) => { const tr = document.createElement('tr'); if (index === 0) { const th = document.createElement('th'); th.scope = 'rowgroup'; th.rowSpan = group.length; th.textContent = category.type; tr.append(th); } for (const val of [v.name, String(v.seats), v.gear, peso.format(v.rate)]) { const td = document.createElement('td'); td.textContent = val; tr.append(td); } const td = document.createElement('td'); const pill = document.createElement('span'); const available = valid && isAvailable(v.id, s, e); pill.className = `status-pill ${available ? '' : 'is-booked'}`; pill.textContent = valid ? (available ? 'Available' : 'Reserved (demo)') : 'Select dates'; td.append(pill); tr.append(td); const action = document.createElement('td'); const link = document.createElement('a'); link.className = 'table-link'; link.textContent = 'Book ↗'; link.href = queryHref('booking.html', { vehicle: v.id }); action.append(link); tr.append(action); body.append(tr); }); } }
    for (const id of ['availability-start', 'availability-end']) { $(id).min = localISO(); $(id).addEventListener('change', () => { if ($('availability-start').value) $('availability-end').min = $('availability-start').value; render(); }); }
    form.addEventListener('submit', e => { e.preventDefault(); const s = $('availability-start').value, end = $('availability-end').value; if (!validDates(s, end)) { toast('Choose dates from today, with return date on or after pick-up.'); return; } setDates(s, end); render(); toast('Sample availability updated for your selected dates.'); }); render();
}
function initBooking() {
    const form = $('booking-form'); if (!form) return; const vSelect = $('booking-vehicle'), startInput = $('booking-start'), endInput = $('booking-end'); const current = getDates(); vSelect.innerHTML = '<option value="">Select a vehicle</option>' + fleet.map(v => `<option value="${v.id}">${v.name} · ${v.type} · ${peso.format(v.rate)}/day</option>`).join('');
    vSelect.value = getVehicle(params.get('vehicle'))?.id || ''; startInput.value = current.start; endInput.value = current.end; startInput.min = localISO(); endInput.min = current.start;
    const breakdown = () => { const v = getVehicle(vSelect.value), start = startInput.value, end = endInput.value, days = rentalDays(start, end), base = v && validDates(start, end) ? v.rate * days : 0, addons = []; if ($('addon-gps').checked) addons.push({ name: 'GPS navigation', amount: days * addOnRates.gps }); if ($('addon-cover').checked) addons.push({ name: 'Extra coverage (demo)', amount: days * addOnRates.cover }); if ($('addon-helmet').checked && v?.type === 'Motorcycle') addons.push({ name: 'Helmet', amount: days * addOnRates.helmet }); const extras = validDates(start, end) ? addons.reduce((sum, a) => sum + a.amount, 0) : 0; return { v, start, end, days, base, addons, extras, total: base + extras }; };
    function update() { const b = breakdown(); startInput.min = localISO(); endInput.min = startInput.value || localISO(); $('helmet-row').hidden = b.v?.type !== 'Motorcycle'; if (b.v?.type !== 'Motorcycle') $('addon-helmet').checked = false; const img = $('booking-photo'); img.src = b.v?.image || 'images/vios-cutout.png'; img.alt = b.v ? `Render of ${b.v.name}` : 'Example car'; $('booking-model').textContent = b.v?.name || 'Choose a model'; $('booking-category').textContent = b.v?.type || 'Vehicle type'; $('s-rate').textContent = peso.format(b.v?.rate || 0); $('s-days').textContent = b.days || '—'; $('s-base').textContent = peso.format(b.base); $('s-addons').textContent = peso.format(b.extras); $('s-total').textContent = peso.format(b.total); const label = $('s-status'); label.classList.remove('is-error'); if (!b.v) label.textContent = 'Choose a vehicle to see your estimate.'; else if (!validDates(b.start, b.end)) { label.textContent = 'Choose a valid rental date range.'; label.classList.add('is-error'); } else if (!isAvailable(b.v.id, b.start, b.end)) { label.textContent = 'This model is already reserved for those demo dates. Try another.'; label.classList.add('is-error'); } else label.textContent = 'This model is open for the selected demo dates.'; return b; }
    vSelect.addEventListener('change', update);[startInput, endInput].forEach(input => input.addEventListener('change', () => { if (validDates(startInput.value, endInput.value)) setDates(startInput.value, endInput.value); update(); })); for (const id of ['addon-gps', 'addon-cover', 'addon-helmet']) $(id).addEventListener('change', update);
    const dialog = $('review-dialog'); let pending = null;
    form.addEventListener('submit', e => { e.preventDefault(); $('booking-error').hidden = true; const b = update(); startInput.setCustomValidity(b.start < localISO() ? 'Pick-up cannot be in the past.' : ''); endInput.setCustomValidity(b.end < b.start ? 'Return date cannot be before pick-up.' : ''); if (!form.reportValidity()) return; if (!validDates(b.start, b.end)) { error('Choose valid dates: return date must be on or after pick-up.'); return; } if (!isAvailable(b.v.id, b.start, b.end)) { error('That vehicle is already reserved for these demo dates.'); return; } pending = b; const dl = $('review-list'); dl.replaceChildren(); addTextRow(dl, 'Customer', $('customer-name').value.trim()); addTextRow(dl, 'Vehicle', b.v.name); addTextRow(dl, 'Rental dates', `${formattedDate(b.start)} — ${formattedDate(b.end)}`); addTextRow(dl, 'Number of days', String(b.days)); addTextRow(dl, 'Add-ons', b.addons.length ? b.addons.map(a => a.name).join(', ') : 'None'); addTextRow(dl, 'Estimated total', peso.format(b.total)); dialog.showModal(); });
    function error(message) { const el = $('booking-error'); el.hidden = false; el.textContent = message; toast(message); }
    $('confirm-booking').addEventListener('click', () => { if (!pending) return; const b = pending; if (!isAvailable(b.v.id, b.start, b.end)) { closeDialog(dialog); error('This vehicle was reserved for those demo dates. Try another period.'); update(); return; } const record = { id: 'JMT-' + Date.now().toString(36).toUpperCase().slice(-7) + Math.random().toString(36).slice(2, 4).toUpperCase(), vehicleId: b.v.id, start: b.start, end: b.end, total: b.total, createdAt: Date.now() }; bookings.unshift(record); saveBookings(); setDates(b.start, b.end); location.href = queryHref('reservations.html', { success: record.id }); });
    dialog.querySelectorAll('[data-close-dialog]').forEach(b => b.addEventListener('click', () => closeDialog(dialog))); dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(dialog); }); update();
}
function initReservations() {
    const tbody = $('booking-records'); if (!tbody) return; const success = params.get('success'); if (success && bookings.some(r => r.id === success)) $('records-success').hidden = false;
    function render() { tbody.replaceChildren(); if (!bookings.length) { const tr = document.createElement('tr'), td = document.createElement('td'); td.colSpan = 6; td.textContent = 'No browser-only bookings yet. Choose a vehicle to make your first demonstration reservation.'; tr.append(td); tbody.append(tr); return; } for (const r of bookings) { const v = getVehicle(r.vehicleId), tr = document.createElement('tr'); for (const value of [r.id, v?.name || 'Unknown', `${formattedDate(r.start)} — ${formattedDate(r.end)}`, String(rentalDays(r.start, r.end)), peso.format(r.total || 0)]) { const td = document.createElement('td'); td.textContent = value; tr.append(td); } const td = document.createElement('td'), button = document.createElement('button'); button.className = 'cancel-btn'; button.dataset.cancel = r.id; button.textContent = 'Cancel demo'; button.type = 'button'; td.append(button); tr.append(td); tbody.append(tr); } }
    tbody.addEventListener('click', e => { const button = e.target.closest('[data-cancel]'); if (!button) return; const id = button.dataset.cancel; if (!window.confirm(`Cancel demo booking ${id}?`)) return; bookings = bookings.filter(r => r.id !== id); saveBookings(); $('records-success').hidden = true; render(); toast('Demonstration booking canceled.'); }); render();
}
function initialize() { bookings = readBookings(); initNav(); initIntro(); initCategories(); initShowroom(); initAvailability(); initBooking(); initReservations(); }
document.addEventListener('DOMContentLoaded', initialize);


/* ITWS 02 - UNIT 6: DOM Manipulation */

// Allows customers to compare up to 3 vehicles
function initVehicleComparison() {
    const grid = document.getElementById('showroom-grid');
    if (!grid) return;

    const selected = new Set();
    const panel = document.createElement('section');
    panel.id = 'compare-panel';
    panel.className = 'compare-panel';
    panel.hidden = true;
    grid.insertAdjacentElement('afterend', panel);

    function updateButtons() {
        grid.querySelectorAll('.vehicle-card').forEach(card => {
            const action = card.querySelector('[data-detail]');
            if (!action) return;

            const id = action.dataset.detail;
            let button = card.querySelector('[data-compare]');

            if (!button) {
                button = document.createElement('button');
                button.type = 'button';
                button.className = 'compare-toggle';
                button.dataset.compare = id;

                card.querySelector('.vehicle-actions')
                    .insertAdjacentElement('afterend', button);
            }

            const active = selected.has(id);
            button.textContent = active
                ? '✓ Added to comparison'
                : '+ Add to comparison';

            button.classList.toggle('selected', active);
            button.setAttribute('aria-pressed', String(active));
        });
    }

    function renderComparison() {
        panel.replaceChildren();
        panel.hidden = selected.size === 0;

        if (!selected.size) return;

        const models = [...selected]
            .map(id => getVehicle(id))
            .filter(Boolean);

        const heading = document.createElement('div');
        heading.className = 'compare-heading';

        const title = document.createElement('h2');
        title.textContent = `Compare vehicles (${models.length}/3)`;

        const clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'compare-clear';
        clear.dataset.clearCompare = '';
        clear.textContent = 'Clear all';

        heading.append(title, clear);
        panel.append(heading);

        // Create removable vehicle labels
        const chips = document.createElement('div');
        chips.className = 'compare-chips';

        models.forEach(vehicle => {
            const chip = document.createElement('div');
            chip.className = 'compare-chip';

            const name = document.createElement('span');
            name.textContent = vehicle.name;

            const remove = document.createElement('button');
            remove.type = 'button';
            remove.dataset.removeCompare = vehicle.id;
            remove.textContent = '×';
            remove.setAttribute(
                'aria-label',
                `Remove ${vehicle.name} from comparison`
            );

            chip.append(name, remove);
            chips.append(chip);
        });

        panel.append(chips);

        if (models.length < 2) {
            const hint = document.createElement('p');
            hint.className = 'compare-hint';
            hint.textContent =
                'Select one more model to see a side-by-side comparison.';
            panel.append(hint);
            return;
        }

        // Dynamically create a semantic HTML table
        const wrapper = document.createElement('div');
        wrapper.className = 'compare-table-wrap';

        const table = document.createElement('table');
        table.className = 'compare-table';

        const caption = document.createElement('caption');
        caption.textContent =
            'Selected vehicle specifications and illustrative prices';

        const thead = document.createElement('thead');
        const header = document.createElement('tr');

        ['Feature', ...models.map(v => v.name)].forEach(label => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = label;
            header.append(th);
        });

        thead.append(header);

        const tbody = document.createElement('tbody');

        const rows = [
            ['Category', v => v.type],
            ['Seats', v => String(v.seats)],
            ['Transmission', v => v.gear],
            ['Fuel', v => v.fuel],
            ['Daily rate', v => peso.format(v.rate)]
        ];

        rows.forEach(([label, value]) => {
            const tr = document.createElement('tr');
            const th = document.createElement('th');

            th.scope = 'row';
            th.textContent = label;
            tr.append(th);

            models.forEach(vehicle => {
                const td = document.createElement('td');
                td.textContent = value(vehicle);
                tr.append(td);
            });

            tbody.append(tr);
        });

        table.append(caption, thead, tbody);
        wrapper.append(table);
        panel.append(wrapper);
    }

    // Handle comparison button clicks
    grid.addEventListener('click', event => {
        const button = event.target.closest('[data-compare]');
        if (!button) return;

        const id = button.dataset.compare;

        if (selected.has(id)) {
            selected.delete(id);
        } else if (selected.size >= 3) {
            toast('You can compare up to three vehicles.');
            return;
        } else {
            selected.add(id);
        }

        updateButtons();
        renderComparison();
    });

    // Remove one vehicle or clear the comparison
    panel.addEventListener('click', event => {
        const remove = event.target.closest('[data-remove-compare]');

        if (remove) {
            selected.delete(remove.dataset.removeCompare);
        } else if (event.target.closest('[data-clear-compare]')) {
            selected.clear();
        } else {
            return;
        }

        updateButtons();
        renderComparison();
    });

    // Refresh buttons when the existing showroom changes
    document.getElementById('filter-pills')
        .addEventListener('click', updateButtons);

    document.getElementById('vehicle-search')
        .addEventListener('input', updateButtons);

    updateButtons();
}


/* ITWS 02 - UNIT 7: Client-Side Form Validation */

function initBookingValidation() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    const ids = [
        'booking-vehicle',
        'booking-start',
        'booking-end',
        'customer-name',
        'customer-phone',
        'customer-email',
        'customer-license'
    ];

    const fields = ids.map(id => document.getElementById(id));
    const touched = new Set();
    const messages = new Map();

    let attempted = false;

    // Create an inline feedback message for every input
    fields.forEach(field => {
        const message = document.createElement('span');
        message.className = 'field-feedback';
        message.id = `${field.id}-feedback`;
        message.setAttribute('aria-live', 'polite');

        field.insertAdjacentElement('afterend', message);
        field.setAttribute('aria-describedby', message.id);

        messages.set(field.id, message);
    });

    function checkField(field) {
        const value = field.value.trim();
        let error = '';

        // Conditions and Regular Expressions (RegEx)
        switch (field.id) {

            case 'booking-vehicle':
                if (!getVehicle(value)) {
                    error = 'Please select a vehicle.';
                }
                break;

            case 'booking-start':
                if (!value) {
                    error = 'Please select your pick-up date.';
                } else if (value < localISO()) {
                    error = 'Pick-up cannot be in the past.';
                }
                break;

            case 'booking-end':
                if (!value) {
                    error = 'Please select your return date.';
                } else if (
                    value < document.getElementById('booking-start').value
                ) {
                    error = 'Return date cannot be earlier than pick-up.';
                }
                break;

            case 'customer-name':
                if (!value) {
                    error = 'Please enter your full name.';
                } else if (
                    value.replace(/[^\p{L}]/gu, '').length < 3
                ) {
                    error = 'Enter at least 3 letters.';
                } else if (
                    !/^[\p{L}\p{M} .'-]+$/u.test(value)
                ) {
                    error = 'Use letters, spaces, apostrophes or hyphens.';
                }
                break;

            case 'customer-phone':
                if (!/^09\d{9}$/.test(value)) {
                    error =
                        'Enter 11 digits beginning with 09 (e.g., 09171234567).';
                }
                break;

            case 'customer-email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Please enter a valid email address.';
                }
                break;

            case 'customer-license':
                if (!/^[A-Za-z0-9-]{5,24}$/.test(value)) {
                    error =
                        'Use 5–24 letters, numbers or hyphens (demo format only).';
                }
                break;
        }

        // HTML5 Constraint Validation API
        field.setCustomValidity('');

        if (!error && !field.validity.valid) {
            error = field.validity.valueMissing
                ? 'This field is required.'
                : 'Please check this value.';
        }

        field.setCustomValidity(error);

        // Display messages using DOM manipulation
        const show = attempted || touched.has(field.id);
        const message = messages.get(field.id);

        message.textContent = show
            ? (error || '✓ Looks good')
            : '';

        message.classList.toggle('error', show && Boolean(error));
        message.classList.toggle('success', show && !error);

        field.classList.toggle('input-invalid', show && Boolean(error));
        field.classList.toggle('input-valid', show && !error);

        field.setAttribute(
            'aria-invalid',
            String(show && Boolean(error))
        );

        return !error;
    }

    // Validate as the user enters information
    fields.forEach(field => {
        for (const type of ['input', 'change']) {
            field.addEventListener(type, () => {
                touched.add(field.id);
                checkField(field);

                if (field.id === 'booking-start') {
                    checkField(
                        document.getElementById('booking-end')
                    );
                }
            });
        }

        field.addEventListener('blur', () => {
            touched.add(field.id);
            checkField(field);
        });
    });

    // Prevent submission when information is invalid
    form.addEventListener('submit', event => {
        attempted = true;

        const invalid = fields.find(field => !checkField(field));
        fields.forEach(checkField);

        if (!invalid) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        invalid.focus();
        invalid.reportValidity();
    }, true);

    // HTML5 may block invalid fields before submit is fired
    form.addEventListener('invalid', event => {
        attempted = true;

        if (messages.has(event.target.id)) {
            touched.add(event.target.id);
            checkField(event.target);
        }
    }, true);


    /* UNIT 6: Dynamic Booking Add-ons */

    const addons = form.querySelector('.addons');

    const chosenBox = document.createElement('div');
    chosenBox.className = 'chosen-addons';
    chosenBox.setAttribute('aria-live', 'polite');

    addons.insertAdjacentElement('afterend', chosenBox);

    function renderAddons() {
        chosenBox.replaceChildren();

        const options = [
            ['addon-gps', 'GPS navigation'],
            ['addon-cover', 'Extra coverage'],
            ['addon-helmet', 'Helmet']
        ];

        const active = options.filter(([id]) =>
            document.getElementById(id).checked
        );

        if (!active.length) {
            const empty = document.createElement('span');
            empty.textContent = 'No add-ons selected';
            empty.className = 'addons-empty';
            chosenBox.append(empty);
        }

        active.forEach(([id, label]) => {
            const button = document.createElement('button');

            button.type = 'button';
            button.className = 'addon-chip';
            button.textContent = `${label} ×`;
            button.setAttribute('aria-label', `Remove ${label}`);

            button.addEventListener('click', () => {
                const checkbox = document.getElementById(id);
                checkbox.checked = false;

                checkbox.dispatchEvent(
                    new Event('change', {bubbles: true})
                );
            });

            chosenBox.append(button);
        });

        addons.querySelectorAll('.check-row').forEach(row => {
            row.classList.toggle(
                'picked',
                row.querySelector('input').checked
            );
        });
    }

    form.addEventListener('change', renderAddons);
    renderAddons();
}


// Initialize the new features after the original website
document.addEventListener('DOMContentLoaded', () => {
    initVehicleComparison();
    initBookingValidation();
});
