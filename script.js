/**
 * Smart Campus Navigation System - High Performance Presentation Logic
 * Optimized for ultra-fast response, zero layout thrashing, and buttery smooth 60-120fps scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Theme Toggle (Instant with local storage cache)
    // ---------------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');
    const rootEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            rootEl.setAttribute('data-theme', 'dark');
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
        } else {
            rootEl.removeAttribute('data-theme');
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
        }
    }

    const savedTheme = localStorage.getItem('ghrce_theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = rootEl.getAttribute('data-theme') === 'dark';
            const nextTheme = isDark ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('ghrce_theme', nextTheme);
        }, { passive: true });
    }

    // ---------------------------------------------------------
    // 2. High-Performance Scroll Handling (rAF + Passive Listeners)
    // ---------------------------------------------------------
    const progressBar = document.getElementById('progress-bar');
    const backToTopBtn = document.getElementById('backToTopBtn');
    let ticking = false;

    function onScrollUpdate() {
        const scrollTop = window.pageYOffset || rootEl.scrollTop || document.body.scrollTop || 0;
        const scrollHeight = (rootEl.scrollHeight || document.body.scrollHeight) - window.innerHeight;
        
        if (progressBar && scrollHeight > 0) {
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                if (!backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.classList.add('visible');
                }
            } else {
                if (backToTopBtn.classList.contains('visible')) {
                    backToTopBtn.classList.remove('visible');
                }
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScrollUpdate);
            ticking = true;
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------------------------------------------------------
    // 3. Active Section Tracking using IntersectionObserver (Zero layout thrashing)
    // ---------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    const navMap = new Map();

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && href.startsWith('#')) {
            navMap.set(href.substring(1), item);
        }
    });

    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navItems.forEach(link => link.classList.remove('active'));
                    const activeLink = navMap.get(id);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(sec => sectionObserver.observe(sec));
    }

    // ---------------------------------------------------------
    // 4. Mobile Menu & More Dropdown Toggle
    // ---------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navDropdown = document.getElementById('navDropdown');
    const navDropdownBtn = document.getElementById('navDropdownBtn');
    const navDropdownMenu = document.getElementById('navDropdownMenu');

    if (navDropdownBtn && navDropdown) {
        navDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navDropdown.classList.toggle('open');
            const isOpen = navDropdown.classList.contains('open');
            navDropdownBtn.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (navDropdown && !navDropdown.contains(e.target)) {
                navDropdown.classList.remove('open');
                if (navDropdownBtn) navDropdownBtn.setAttribute('aria-expanded', 'false');
            }
        });

        if (navDropdownMenu) {
            navDropdownMenu.addEventListener('click', () => {
                navDropdown.classList.remove('open');
                if (navDropdownBtn) navDropdownBtn.setAttribute('aria-expanded', 'false');
            });
        }
    }

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
        });

        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') && !e.target.classList.contains('nav-dropdown-btn') || e.target.classList.contains('dropdown-item')) {
                navLinks.classList.remove('nav-active');
            }
        });
    }

    // ---------------------------------------------------------
    // 5. Fast Module Search Filter (DocumentFragment / CSS toggle)
    // ---------------------------------------------------------
    const moduleFilterInput = document.getElementById('moduleFilterInput');
    const moduleCards = document.querySelectorAll('.module-card');
    const moduleCountText = document.getElementById('moduleCountText');

    if (moduleFilterInput && moduleCards.length > 0) {
        // Precache text search tokens for instantaneous search
        const cardCache = Array.from(moduleCards).map(card => ({
            el: card,
            text: (card.getAttribute('data-title') + ' ' + card.innerText).toLowerCase()
        }));

        moduleFilterInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            for (let i = 0; i < cardCache.length; i++) {
                const item = cardCache[i];
                if (!query || item.text.includes(query)) {
                    item.el.style.display = 'flex';
                    visibleCount++;
                } else {
                    item.el.style.display = 'none';
                }
            }

            if (moduleCountText) {
                moduleCountText.textContent = `Showing ${visibleCount} of ${cardCache.length} Modules`;
            }
        }, { passive: true });
    }

    // ---------------------------------------------------------
    // 6. Fast Literature Survey Table Search Filter
    // ---------------------------------------------------------
    const litSearchInput = document.getElementById('litSearchInput');
    const litTable = document.getElementById('literatureTable');
    const litCountText = document.getElementById('litCountText');

    if (litSearchInput && litTable) {
        const rows = litTable.querySelectorAll('tbody tr');
        const rowCache = Array.from(rows).map(row => ({
            el: row,
            text: row.innerText.toLowerCase()
        }));

        litSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let visibleCount = 0;

            for (let i = 0; i < rowCache.length; i++) {
                const item = rowCache[i];
                if (!query || item.text.includes(query)) {
                    item.el.style.display = '';
                    visibleCount++;
                } else {
                    item.el.style.display = 'none';
                }
            }

            if (litCountText) {
                litCountText.textContent = `Showing ${visibleCount} of ${rowCache.length} Research Papers`;
            }
        }, { passive: true });
    }

    // ---------------------------------------------------------
    // 7. Interactive Campus Route Simulator
    // ---------------------------------------------------------
    const startNodeSelect = document.getElementById('startNodeSelect');
    const endNodeSelect = document.getElementById('endNodeSelect');
    const wheelchairCheck = document.getElementById('wheelchairCheck');
    const calculateRouteBtn = document.getElementById('calculateRouteBtn');
    const routeDistVal = document.getElementById('routeDistVal');
    const routeTimeVal = document.getElementById('routeTimeVal');
    const stepGuideBox = document.getElementById('stepGuideBox');
    const dynamicRoutePath = document.getElementById('dynamicRoutePath');
    const startMarkerCircle = document.getElementById('startMarkerCircle');
    const endMarkerCircle = document.getElementById('endMarkerCircle');

    const nodeCoords = {
        gate: { x: 65, y: 340, name: "Main Campus Entrance (Gate 1)", block: "Campus Gate" },
        admin: { x: 165, y: 100, name: "Admin & Dean Office Block", block: "Administrative Wing" },
        cse: { x: 307, y: 80, name: "CSE Department (Block B)", block: "Computer Science Dept" },
        library: { x: 468, y: 100, name: "Central Library & Reading Hall", block: "Library Block" },
        canteen: { x: 468, y: 300, name: "Campus Cafeteria & Food Court", block: "Cafeteria" },
        auditorium: { x: 180, y: 300, name: "Shradha Auditorium", block: "Auditorium Wing" }
    };

    function getPathString(startKey, endKey) {
        if (startKey === endKey) {
            const pt = nodeCoords[startKey];
            return `M ${pt.x},${pt.y} L ${pt.x + 1},${pt.y + 1}`;
        }

        const s = nodeCoords[startKey];
        const e = nodeCoords[endKey];

        if (startKey === 'cse' && endKey === 'library') {
            return `M ${s.x},${s.y + 20} L ${s.x},100 L ${e.x},100 L ${e.x},${e.y + 20}`;
        }
        if (startKey === 'library' && endKey === 'cse') {
            return `M ${s.x},${s.y + 20} L ${s.x},100 L ${e.x},100 L ${e.x},${e.y + 20}`;
        }
        if (startKey === 'gate' && endKey === 'cse') {
            return `M ${s.x},${s.y} L 160,340 L 160,200 L 300,200 L 300,100 L ${e.x},${e.y + 20}`;
        }
        if (startKey === 'cse' && endKey === 'gate') {
            return `M ${s.x},${s.y + 20} L 300,100 L 300,200 L 160,200 L 160,340 L ${e.x},${e.y}`;
        }
        if (startKey === 'gate' && endKey === 'library') {
            return `M ${s.x},${s.y} L 160,340 L 160,320 L 460,320 L 460,100 L ${e.x},${e.y + 20}`;
        }
        if (startKey === 'cse' && endKey === 'canteen') {
            return `M ${s.x},${s.y + 20} L 300,200 L 460,200 L 460,${e.y}`;
        }
        if (startKey === 'admin' && endKey === 'auditorium') {
            return `M ${s.x},${s.y + 30} L 160,200 L 160,300 L ${e.x},${e.y}`;
        }
        if (startKey === 'gate' && endKey === 'auditorium') {
            return `M ${s.x},${s.y} L 160,340 L 160,300 L ${e.x},${e.y}`;
        }

        return `M ${s.x},${s.y} L ${s.x},200 L ${e.x},200 L ${e.x},${e.y}`;
    }

    function calculateRoute() {
        if (!startNodeSelect || !endNodeSelect) return;
        const startKey = startNodeSelect.value;
        const endKey = endNodeSelect.value;
        const isWheelchair = wheelchairCheck ? wheelchairCheck.checked : false;

        const start = nodeCoords[startKey] || nodeCoords.cse;
        const end = nodeCoords[endKey] || nodeCoords.library;

        if (startMarkerCircle) {
            startMarkerCircle.setAttribute('cx', start.x);
            startMarkerCircle.setAttribute('cy', start.y);
        }
        if (endMarkerCircle) {
            endMarkerCircle.setAttribute('cx', end.x);
            endMarkerCircle.setAttribute('cy', end.y);
        }

        const dx = Math.abs(end.x - start.x);
        const dy = Math.abs(end.y - start.y);
        let distMeters = Math.round((dx + dy) * 0.75 + 40);

        if (startKey === endKey) {
            distMeters = 0;
        } else if (isWheelchair) {
            distMeters += 35;
        }

        const walkingMinutes = (distMeters / 75).toFixed(1);

        if (routeDistVal) routeDistVal.textContent = `${distMeters} meters`;
        if (routeTimeVal) routeTimeVal.textContent = distMeters === 0 ? "0 mins" : `~ ${walkingMinutes} mins`;

        if (dynamicRoutePath) {
            dynamicRoutePath.setAttribute('d', getPathString(startKey, endKey));
        }

        if (stepGuideBox) {
            if (startKey === endKey) {
                stepGuideBox.innerHTML = `<div class="step-line"><span class="step-badge">1</span> You are already at <strong>${start.name}</strong>.</div>`;
            } else {
                stepGuideBox.innerHTML = `
                    <div class="step-line"><span class="step-badge">1</span> Start at <strong>${start.name}</strong></div>
                    <div class="step-line"><span class="step-badge">${isWheelchair ? '♿' : '2'}</span> ${isWheelchair ? 'Proceed via designated ADA ramp and ground level corridor' : `Walk along Main Courtyard Walkway (${Math.round(distMeters * 0.6)}m)`}</div>
                    <div class="step-line"><span class="step-badge">3</span> Arrive at destination: <strong>${end.name}</strong> (${end.block})</div>
                `;
            }
        }
    }

    if (calculateRouteBtn) calculateRouteBtn.addEventListener('click', calculateRoute, { passive: true });
    if (startNodeSelect) startNodeSelect.addEventListener('change', calculateRoute, { passive: true });
    if (endNodeSelect) endNodeSelect.addEventListener('change', calculateRoute, { passive: true });
    if (wheelchairCheck) wheelchairCheck.addEventListener('change', calculateRoute, { passive: true });

    document.querySelectorAll('.map-bldg').forEach(bldg => {
        bldg.addEventListener('click', () => {
            const bldgId = bldg.id.replace('bldg-', '');
            if (nodeCoords[bldgId] && endNodeSelect) {
                endNodeSelect.value = bldgId;
                calculateRoute();
            }
        }, { passive: true });
    });

    calculateRoute();
});
