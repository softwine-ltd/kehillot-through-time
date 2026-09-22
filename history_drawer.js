/**
 * Town history drawer.
 *
 * A side panel (a bottom sheet on phones) that lists ONE town's own rows from kehilot.csv -- population points and narrative
 * events -- sorted by year, with a small population-over-time chart. Opened from a "Full history" button in the marker popup
 * or by right-clicking a marker.
 *
 * Performance: nothing here runs on the year-change path except a boolean check. The per-town index is built lazily from the
 * rows helpers.js has already parsed (cachedParsedKehilot); the drawer's DOM is built only when a town is opened (<= ~115 rows).
 * While the drawer is open it follows the slider: the row(s) covering the current year are highlighted (rAF-throttled).
 *
 * Hooks in helpers.js: historyButtonHtml() in the two popup templates, attachHistoryHandlers() on the marker cluster group,
 * initHistoryDrawer() once the map exists, historyDrawerOnYear() from the slider's 'update' handler.
 */
(function () {
    'use strict';

    let map = null;
    let drawer = null;
    let els = {};
    let townIndex = null;
    let indexSize = -1;
    let previousFocus = null;
    let rafPending = false;
    let lastUserScroll = 0;
    const state = { open: false, country: null, name: null, infos: [], filter: 'all', hideLow: false, activeSig: '', pendingYear: null };

    /* ---------- small helpers ---------- */
    function tr(key, fallback, params) {
        try {
            if (window.i18n && typeof window.i18n.t === 'function') {
                const v = window.i18n.t(key, params || {});
                if (typeof v === 'string' && v !== key) return v;
            }
        } catch (_) { /* fall through to the English fallback */ }
        return fallback;
    }

    function esc(v) {
        if (typeof escapeHtml === 'function') return escapeHtml(v);
        return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function lang() {
        return window.i18n && window.i18n.getCurrentLanguage ? window.i18n.getCurrentLanguage() : 'en';
    }

    function fmtYear(y) {
        return y < 0 ? `${Math.abs(y)} ${tr('history.bce', 'BCE')}` : String(y);
    }

    function fmtNum(n) {
        return Number.isFinite(n) ? n.toLocaleString() : '';
    }

    function sliderEl() {
        return document.getElementById('timeline');
    }

    function currentSliderYear() {
        const t = sliderEl();
        return t && t.noUiSlider ? parseInt(t.noUiSlider.get()) : NaN;
    }

    function jumpToYear(y) {
        const t = sliderEl();
        if (!t || !t.noUiSlider || !Number.isFinite(y)) return;
        const lo = typeof startYear0 === 'number' ? startYear0 : -1312;
        const hi = typeof endYear0 === 'number' ? endYear0 : 2023;
        t.noUiSlider.set(Math.max(lo, Math.min(hi, Math.round(y))));
    }

    /* ---------- data ---------- */
    function ensureIndex() {
        if (typeof cachedParsedKehilot === 'undefined' || !cachedParsedKehilot) return null;
        if (townIndex && indexSize === cachedParsedKehilot.length) return townIndex;
        townIndex = new Map();
        for (const r of cachedParsedKehilot) {
            const k = r.country + '||' + r.name;
            let a = townIndex.get(k);
            if (!a) townIndex.set(k, a = []);
            a.push(r);
        }
        indexSize = cachedParsedKehilot.length;
        return townIndex;
    }

    function rowsFor(country, name) {
        const idx = ensureIndex();
        return (idx && idx.get(country + '||' + name)) || [];
    }

    function cleanComment(c) {
        return String(c == null ? '' : c).replace(/\r/g, '').replace(/^[\s,;"]+/, '').trim();
    }

    function toInfo(r) {
        const ps = r.population_start || 0;
        const pe = r.population_end || 0;
        const ys = r.year_start;
        const open = r.year_end === undefined || Number.isNaN(r.year_end);
        const ye = open ? ys : Math.max(ys, r.year_end);
        return {
            ys, ye, open, ps, pe,
            hasPop: ps > 0 || pe > 0,
            comment: cleanComment(r.comment),
            source: r.source || '',
            confidence: String(r.confidence || '').toLowerCase(),
            row: r
        };
    }

    function buildInfos(rows) {
        return rows.map(toInfo).sort((a, b) => (a.ys - b.ys) || (a.ye - b.ye));
    }

    function isCurrent(i, year) {
        return Number.isFinite(year) && year >= i.ys && (i.open || year <= i.ye);
    }

    /* ---------- popup button + handlers (called from helpers.js) ---------- */
    window.historyRowCount = function (kehila) {
        return rowsFor(kehila.country, kehila.name).length;
    };

    window.historyButtonHtml = function (kehila) {
        const n = rowsFor(kehila.country, kehila.name).length;
        if (n < 2) return ''; // one row is already fully shown in the popup
        return `<div class="history-open-wrap"><button type="button" class="history-open-btn" data-country="${esc(kehila.country)}" data-name="${esc(kehila.name)}">${esc(tr('history.openButton', 'Full history'))} (${n})</button></div>`;
    };

    window.attachHistoryHandlers = function (group) {
        if (!group || group._historyHandlers) return;
        group._historyHandlers = true;
        // One listener on the cluster group (it re-fires its markers' events) -- no per-marker cost.
        group.on('contextmenu', function (e) {
            const k = e.layer && e.layer.kehilaData;
            if (!k) return;
            if (e.originalEvent) L.DomEvent.preventDefault(e.originalEvent);
            openHistory(k.country, k.name);
        });
    };

    /* ---------- drawer DOM ---------- */
    function buildDrawer() {
        drawer = document.createElement('aside');
        drawer.id = 'historyDrawer';
        drawer.className = 'history-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.innerHTML = `
            <div class="hd-handle" aria-hidden="true"></div>
            <div class="hd-head">
                <div class="hd-titles">
                    <div class="hd-title-he" id="hdTitleHe"></div>
                    <div class="hd-title-en" id="hdTitleEn"></div>
                    <div class="hd-sub" id="hdSub"></div>
                </div>
                <button type="button" class="hd-close" id="hdClose">&#10005;</button>
            </div>
            <div class="hd-summary" id="hdSummary"></div>
            <div class="hd-chart-wrap" id="hdChartWrap"></div>
            <div class="hd-controls">
                <div class="hd-seg" role="group" id="hdSeg">
                    <button type="button" data-filter="all" class="active" id="hdFilterAll"></button>
                    <button type="button" data-filter="pop" id="hdFilterPop"></button>
                    <button type="button" data-filter="events" id="hdFilterEvents"></button>
                </div>
                <label class="hd-check"><input type="checkbox" id="hdHideLow"><span id="hdHideLowLabel"></span></label>
            </div>
            <ol class="hd-list" id="hdList"></ol>`;
        map.getContainer().appendChild(drawer);
        // A control living inside the map container: keep its clicks/scrolls/right-clicks from panning, zooming or re-triggering the map.
        L.DomEvent.disableClickPropagation(drawer);
        L.DomEvent.disableScrollPropagation(drawer);
        L.DomEvent.on(drawer, 'contextmenu', L.DomEvent.stopPropagation);

        els = {
            titleHe: drawer.querySelector('#hdTitleHe'), titleEn: drawer.querySelector('#hdTitleEn'), sub: drawer.querySelector('#hdSub'),
            close: drawer.querySelector('#hdClose'), summary: drawer.querySelector('#hdSummary'), chart: drawer.querySelector('#hdChartWrap'),
            seg: drawer.querySelector('#hdSeg'), hideLow: drawer.querySelector('#hdHideLow'), hideLowLabel: drawer.querySelector('#hdHideLowLabel'),
            list: drawer.querySelector('#hdList')
        };
        els.close.addEventListener('click', closeHistory);
        els.seg.addEventListener('click', e => {
            const b = e.target.closest('button[data-filter]');
            if (!b) return;
            state.filter = b.dataset.filter;
            els.seg.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
            renderList();
        });
        els.hideLow.addEventListener('change', () => { state.hideLow = els.hideLow.checked; renderList(); });
        els.list.addEventListener('click', e => {
            const b = e.target.closest('button[data-year]');
            if (b) jumpToYear(parseInt(b.dataset.year));
        });
        ['wheel', 'touchmove'].forEach(ev => els.list.addEventListener(ev, () => { lastUserScroll = Date.now(); }, { passive: true }));
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.open) closeHistory(); });
    }

    function applyStaticLabels() {
        drawer.setAttribute('dir', lang() === 'he' ? 'rtl' : 'ltr');
        drawer.setAttribute('aria-label', tr('history.title', 'Town history'));
        els.close.setAttribute('aria-label', tr('history.close', 'Close'));
        els.close.title = tr('history.close', 'Close');
        drawer.querySelector('#hdFilterAll').textContent = tr('history.filterAll', 'All');
        drawer.querySelector('#hdFilterPop').textContent = tr('history.filterPopulation', 'Population');
        drawer.querySelector('#hdFilterEvents').textContent = tr('history.filterEvents', 'Events');
        els.hideLowLabel.textContent = tr('history.hideLowConfidence', 'Hide low-confidence');
    }

    /* ---------- rendering ---------- */
    function renderHeader() {
        const k = state.infos.length ? state.infos[0].row : null;
        if (!k) return;
        els.titleHe.textContent = k.name_he || '';
        els.titleHe.style.display = k.name_he ? '' : 'none';
        els.titleEn.textContent = k.name || '';
        const alt = [k.names && k.names.english, k.names && k.names.german, k.names && k.names.yiddish, k.names && k.names.other]
            .filter((v, i, a) => v && v !== k.name && a.indexOf(v) === i);
        els.sub.textContent = [k.country].concat(alt).join(' · ');
        const years = state.infos.map(i => i.ys);
        const yEnd = state.infos.map(i => (i.open ? i.ys : i.ye));
        let peak = { p: 0, y: null };
        state.infos.forEach(i => {
            if (i.ps > peak.p) peak = { p: i.ps, y: i.ys };
            if (i.pe > peak.p) peak = { p: i.pe, y: i.ye };
        });
        const parts = [tr('history.entries', '{{count}} entries', { count: state.infos.length }),
            `${fmtYear(Math.min(...years))}–${fmtYear(Math.max(...yEnd))}`];
        if (peak.p > 0) parts.push(tr('history.peak', 'peak {{pop}} ({{year}})', { pop: fmtNum(peak.p), year: fmtYear(peak.y) }));
        els.summary.textContent = parts.join(' · ');
    }

    function chartData() {
        const segs = [];
        state.infos.forEach(i => {
            if (!i.hasPop) return;
            const p0 = i.ps || i.pe;
            const p1 = i.pe || i.ps;
            segs.push({ y0: i.ys, p0, y1: i.open ? i.ys : i.ye, p1 });
        });
        return segs;
    }

    function renderChart() {
        const segs = chartData();
        if (!segs.length) {
            els.chart.innerHTML = `<div class="hd-chart-empty">${esc(tr('history.noPopulation', 'No population figures recorded for this town.'))}</div>`;
            els.chart._geom = null;
            return;
        }
        const W = 360, H = 104, padX = 8, padTop = 8, padBot = 8;
        let x0 = Infinity, x1 = -Infinity, pMax = 0;
        segs.forEach(s => { x0 = Math.min(x0, s.y0, s.y1); x1 = Math.max(x1, s.y0, s.y1); pMax = Math.max(pMax, s.p0, s.p1); });
        if (x1 === x0) { x0 -= 5; x1 += 5; }
        const sx = y => padX + (y - x0) / (x1 - x0) * (W - 2 * padX);
        const sy = p => H - padBot - p / (pMax * 1.08) * (H - padTop - padBot);
        const paths = [], dots = [];
        segs.forEach(s => {
            if (s.y1 > s.y0) paths.push(`<path d="M${sx(s.y0).toFixed(1)} ${sy(s.p0).toFixed(1)}L${sx(s.y1).toFixed(1)} ${sy(s.p1).toFixed(1)}" class="hd-seg-line"/>`);
            dots.push(`<circle cx="${sx(s.y0).toFixed(1)}" cy="${sy(s.p0).toFixed(1)}" r="2.6" class="hd-dot"><title>${esc(fmtYear(s.y0))}: ${esc(fmtNum(s.p0))}</title></circle>`);
            if (s.y1 > s.y0) dots.push(`<circle cx="${sx(s.y1).toFixed(1)}" cy="${sy(s.p1).toFixed(1)}" r="2.6" class="hd-dot"><title>${esc(fmtYear(s.y1))}: ${esc(fmtNum(s.p1))}</title></circle>`);
        });
        els.chart._geom = { x0, x1, W, padX };
        els.chart.innerHTML = `
            <div class="hd-chart-title">${esc(tr('history.chartTitle', 'Jewish population over time'))}</div>
            <svg viewBox="0 0 ${W} ${H}" class="hd-chart" role="img" aria-label="${esc(tr('history.chartTitle', 'Jewish population over time'))}">
                <line x1="${padX}" y1="${H - padBot}" x2="${W - padX}" y2="${H - padBot}" class="hd-axis"/>
                ${paths.join('')}${dots.join('')}
                <line id="hdYearLine" x1="0" y1="0" x2="0" y2="${H}" class="hd-yearline" style="display:none"/>
                <rect x="0" y="0" width="${W}" height="${H}" fill="transparent" class="hd-hit"><title>${esc(tr('history.clickToJump', 'Click to jump to this year'))}</title></rect>
            </svg>
            <div class="hd-chart-axis" dir="ltr"><span>${esc(fmtYear(x0))}</span><span>${esc(tr('history.maxPop', 'max {{pop}}', { pop: fmtNum(pMax) }))}</span><span>${esc(fmtYear(x1))}</span></div>`;
        const svg = els.chart.querySelector('svg');
        svg.addEventListener('click', e => {
            const g = els.chart._geom;
            if (!g) return;
            const r = svg.getBoundingClientRect();
            const xv = (e.clientX - r.left) / r.width * g.W;
            jumpToYear(g.x0 + (xv - g.padX) / (g.W - 2 * g.padX) * (g.x1 - g.x0));
        });
        updateYearLine(currentSliderYear());
    }

    function updateYearLine(year) {
        const line = els.chart.querySelector('#hdYearLine');
        const g = els.chart._geom;
        if (!line || !g) return;
        if (!Number.isFinite(year) || year < g.x0 || year > g.x1) { line.style.display = 'none'; return; }
        const x = g.padX + (year - g.x0) / (g.x1 - g.x0) * (g.W - 2 * g.padX);
        line.setAttribute('x1', x.toFixed(1));
        line.setAttribute('x2', x.toFixed(1));
        line.style.display = '';
    }

    function confLabel(c) {
        const map = { high: ['history.confidenceHigh', 'High confidence'], medium: ['history.confidenceMedium', 'Medium confidence'], low: ['history.confidenceLow', 'Low confidence'] };
        const e = map[c] || ['history.confidenceUnknown', 'Confidence unknown'];
        return tr(e[0], e[1]);
    }

    function itemHtml(i, idx, year) {
        const label = (i.open || i.ye === i.ys) ? fmtYear(i.ys) : `${fmtYear(i.ys)}–${fmtYear(i.ye)}`;
        let pop = '';
        if (i.hasPop) {
            const a = i.ps || i.pe, b = i.pe || i.ps;
            pop = `<div class="hd-pop">${esc(fmtNum(a))}${(b !== a && !i.open && i.ye > i.ys) ? ` <span class="hd-arrow">→ ${esc(fmtNum(b))}</span>` : ''}</div>`;
        }
        const comment = i.comment ? `<div class="hd-comment">${esc(i.comment)}</div>` : '';
        const src = i.source ? (typeof formatSource === 'function' ? formatSource(i.source) : esc(i.source)) : '';
        const badgeColor = typeof getConfidenceColor === 'function' ? getConfidenceColor(i.confidence || '') : '#ef4444';
        return `<li class="hd-item${isCurrent(i, year) ? ' hd-current' : ''}" data-idx="${idx}">
            <button type="button" class="hd-year" data-year="${i.ys}" title="${esc(tr('history.jumpToYear', 'Show this year on the map'))}">${esc(label)}</button>
            <div class="hd-body">${pop}${comment}
                <div class="hd-meta"><span class="hd-badge" style="color:${badgeColor};background:${badgeColor}22">${esc(confLabel(i.confidence))}</span>${src ? `<span class="hd-src">${src}</span>` : ''}</div>
            </div></li>`;
    }

    function visibleInfos() {
        return state.infos.filter(i =>
            (state.filter === 'all' || (state.filter === 'pop' ? i.hasPop : !i.hasPop)) && !(state.hideLow && i.confidence === 'low'));
    }

    function renderList() {
        const year = currentSliderYear();
        const items = visibleInfos();
        els.list.innerHTML = items.length
            ? items.map(i => itemHtml(i, state.infos.indexOf(i), year)).join('')
            : `<li class="hd-empty">${esc(tr('history.noEntries', 'No entries match the current filter.'))}</li>`;
        state.activeSig = activeSignature(year);
        scrollToCurrent(false);
    }

    function activeSignature(year) {
        return state.infos.map((i, n) => (isCurrent(i, year) ? n : -1)).filter(n => n >= 0).join(',');
    }

    function scrollToCurrent(smooth) {
        const first = els.list.querySelector('.hd-current');
        if (!first) return;
        const top = first.offsetTop - els.list.clientHeight / 3;
        els.list.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
    }

    /* ---------- open / close ---------- */
    function openHistory(country, name) {
        if (!map) return;
        const rows = rowsFor(country, name);
        if (!rows.length) return;
        if (!drawer) buildDrawer();
        previousFocus = document.activeElement;
        state.country = country; state.name = name;
        state.infos = buildInfos(rows);
        state.filter = 'all'; state.hideLow = false;
        els.hideLow.checked = false;
        els.seg.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
        applyStaticLabels();
        renderHeader();
        renderChart();
        renderList();
        state.open = true;
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        els.close.focus({ preventScroll: true });
        // Phones: the bottom sheet sits at the bottom of the map, which can be below the fold -- bring it into view.
        // (Not on wide screens: there it would scroll the timeline controls out of view.)
        if (window.matchMedia && window.matchMedia('(max-width: 640px)').matches) {
            requestAnimationFrame(() => {
                const bottom = map.getContainer().getBoundingClientRect().bottom;
                if (bottom > window.innerHeight) window.scrollBy(0, bottom - window.innerHeight + 8);
            });
        }
    }

    function closeHistory() {
        if (!drawer || !state.open) return;
        state.open = false;
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        if (previousFocus && previousFocus.focus && document.contains(previousFocus)) previousFocus.focus({ preventScroll: true });
        previousFocus = null;
    }

    window.openTownHistory = openHistory;
    window.closeTownHistory = closeHistory;

    /* ---------- follow the slider (called from helpers.js on every year update) ---------- */
    window.historyDrawerOnYear = function (year) {
        if (!state.open) return; // the only cost when the drawer is closed
        state.pendingYear = year;
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            if (!state.open) return;
            const y = state.pendingYear;
            updateYearLine(y);
            const sig = activeSignature(y);
            if (sig === state.activeSig) return;
            state.activeSig = sig;
            els.list.querySelectorAll('.hd-item').forEach(li => {
                const i = state.infos[parseInt(li.dataset.idx)];
                li.classList.toggle('hd-current', isCurrent(i, y));
            });
            if (Date.now() - lastUserScroll > 4000) scrollToCurrent(true); // don't fight a user who is reading further down the list
        });
    };

    /* ---------- init ---------- */
    window.initHistoryDrawer = function (leafletMap) {
        if (map) return;
        map = leafletMap;
        // The popup button: bound when a popup opens (Leaflet stops click bubbling out of popups, so document-level delegation cannot see it).
        map.on('popupopen', function (e) {
            const el = e.popup && e.popup.getElement && e.popup.getElement();
            const btn = el && el.querySelector('.history-open-btn');
            if (!btn) return;
            btn.addEventListener('click', function () {
                openHistory(btn.dataset.country, btn.dataset.name);
            });
        });
        window.addEventListener('languageChanged', function () {
            if (!state.open) return;
            applyStaticLabels();
            renderHeader();
            renderChart();
            renderList();
        });
    };
})();
